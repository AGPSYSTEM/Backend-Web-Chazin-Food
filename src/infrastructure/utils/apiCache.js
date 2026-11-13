const crypto = require('crypto');
const zlib = require('zlib');

const store = new Map();
const MAX_CACHE_ENTRIES = 300;

function pruneStoreIfNeeded() {
  if (store.size < MAX_CACHE_ENTRIES) return;
  const now = Date.now();
  for (const [k, entry] of store.entries()) {
    if (entry.expiresAt <= now) store.delete(k);
  }
  while (store.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (!oldestKey) break;
    store.delete(oldestKey);
  }
}

function buildEtag(rawBuffer) {
  const hash = crypto.createHash('sha1').update(rawBuffer).digest('base64url').slice(0, 16);
  return `W/"${rawBuffer.length}-${hash}"`;
}

function storeEntry(namespace, key, payload, ttlMs) {
  const jsonString = JSON.stringify(payload);
  const raw = Buffer.from(jsonString, 'utf-8');
  const etag = buildEtag(raw);
  const entry = {
    namespace,
    raw,
    gzipped: null,
    etag,
    expiresAt: Date.now() + ttlMs
  };
  pruneStoreIfNeeded();
  store.set(key, entry);

  if (raw.length > 1024) {
    zlib.gzip(raw, (err, compressed) => {
      if (!err && compressed && store.get(key) === entry) {
        entry.gzipped = compressed;
      }
    });
  }

  return entry;
}

/**
 * Middleware de caché en memoria con TTL corto, soporte ETag (304) y respuesta gzip precomputada.
 * Debe montarse DESPUÉS de middlewares de autenticación en rutas protegidas.
 */
function cacheResponse(namespace, { ttlMs = 30000, cacheControl = 'public, max-age=15, stale-while-revalidate=30' } = {}) {
  return (req, res, next) => {
    if (req.method !== 'GET' || req.query?.refresh === 'true' || req.headers['cache-control'] === 'no-cache') {
      return next();
    }

    const key = `${namespace}:${req.originalUrl}`;
    const existing = store.get(key);
    if (existing && existing.expiresAt > Date.now()) {
      if (cacheControl) {
        res.setHeader('Cache-Control', cacheControl);
      }
      res.setHeader('ETag', existing.etag);
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('X-Cache', 'HIT');

      if (req.headers['if-none-match'] === existing.etag) {
        return res.status(304).end();
      }

      const acceptEncoding = req.headers['accept-encoding'] || '';
      if (acceptEncoding.includes('gzip') && existing.gzipped) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Content-Length', existing.gzipped.length);
        return res.status(200).send(existing.gzipped);
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Length', existing.raw.length);
      return res.status(200).send(existing.raw);
    }

    if (existing) {
      store.delete(key);
    }

    const originalJson = res.json.bind(res);
    res.json = function (obj) {
      if (res.statusCode >= 200 && res.statusCode < 300 && obj !== undefined) {
        const saved = storeEntry(namespace, key, obj, ttlMs);
        if (!res.headersSent) {
          if (cacheControl) {
            res.setHeader('Cache-Control', cacheControl);
          }
          res.setHeader('ETag', saved.etag);
          res.setHeader('Vary', 'Accept-Encoding');
          res.setHeader('X-Cache', 'MISS');
        }
      }
      return originalJson(obj);
    };

    return next();
  };
}

function invalidateNamespaces(namespaces = []) {
  const targets = Array.isArray(namespaces) ? namespaces : [namespaces];
  if (targets.length === 0) return;

  if (targets.includes('*')) {
    store.clear();
    return;
  }

  for (const [key, entry] of store.entries()) {
    if (targets.includes(entry.namespace)) {
      store.delete(key);
    }
  }
}

const MUTATION_INVALIDATION_MAP = [
  { prefix: '/api/productos', namespaces: ['productos', 'categorias', 'eventos', 'fichas', 'dashboard'] },
  { prefix: '/api/products', namespaces: ['productos', 'categorias', 'eventos', 'fichas', 'dashboard'] },
  { prefix: '/api/categorias-producto', namespaces: ['categorias', 'productos'] },
  { prefix: '/api/categorias-productos', namespaces: ['categorias', 'productos'] },
  { prefix: '/api/categorias-insumo', namespaces: ['categorias-insumo', 'categories', 'insumos'] },
  { prefix: '/api/categorias-insumos', namespaces: ['categorias-insumo', 'categories', 'insumos'] },
  { prefix: '/api/categorias', namespaces: ['categorias', 'productos', 'categories'] },
  { prefix: '/api/categories', namespaces: ['categories', 'categorias', 'categorias-insumo'] },
  { prefix: '/api/roles', namespaces: ['roles'] },
  { prefix: '/api/usuarios', namespaces: ['roles', 'dashboard'] },
  { prefix: '/api/users', namespaces: ['roles', 'dashboard'] },
  { prefix: '/api/autenticacion', namespaces: ['roles', 'dashboard'] },
  { prefix: '/api/auth', namespaces: ['roles', 'dashboard'] },
  { prefix: '/api/adiciones', namespaces: ['adiciones', 'productos', 'insumos'] },
  { prefix: '/api/eventos', namespaces: ['eventos', 'productos'] },
  { prefix: '/api/fichas-tecnicas', namespaces: ['fichas', 'productos'] },
  { prefix: '/api/insumos-preparados', namespaces: ['fichas', 'productos', 'insumos'] },
  { prefix: '/api/insumos', namespaces: ['insumos', 'adiciones', 'productos', 'fichas', 'categorias-insumo', 'categories', 'dashboard'] },
  { prefix: '/api/compras', namespaces: ['insumos', 'adiciones', 'productos', 'dashboard'] },
  { prefix: '/api/ventas', namespaces: ['productos', 'adiciones', 'dashboard'] },
  { prefix: '/api/pedidos', namespaces: ['productos', 'adiciones', 'dashboard'] },
  { prefix: '/api/orders', namespaces: ['productos', 'adiciones', 'dashboard'] },
  { prefix: '/api/produccion', namespaces: ['productos', 'insumos', 'dashboard'] },
  { prefix: '/api/devoluciones', namespaces: ['productos', 'insumos', 'dashboard'] },
  { prefix: '/api/clientes', namespaces: ['dashboard'] },
  { prefix: '/api/empleados', namespaces: ['roles', 'dashboard'] },
  { prefix: '/api/resenas', namespaces: ['productos'] },
  { prefix: '/api/wompi', namespaces: ['productos', 'adiciones', 'dashboard'] }
];

function cacheInvalidationMiddleware(req, res, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      const path = (req.originalUrl || req.url || '').split('?')[0];
      const toInvalidate = new Set();
      for (const rule of MUTATION_INVALIDATION_MAP) {
        if (path.startsWith(rule.prefix)) {
          rule.namespaces.forEach((ns) => toInvalidate.add(ns));
        }
      }
      if (toInvalidate.size > 0) {
        invalidateNamespaces(Array.from(toInvalidate));
      }
    }
  });

  return next();
}

module.exports = {
  cacheResponse,
  invalidateNamespaces,
  cacheInvalidationMiddleware
};
