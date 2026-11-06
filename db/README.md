# Base de Datos Chazin Food

Esta carpeta contiene los scripts SQL actualizados y respaldos de la base de datos del sistema **Chazin Food**.

---

## 📁 Estructura de Archivos

| Archivo / Carpeta | Descripción |
| :--- | :--- |
| **`chazinfood_tidb_ready.sql`** | **Script activo y desplegado.** 100% compatible con TiDB Cloud Serverless y MySQL 8.0 / MariaDB (XAMPP). Contiene el esquema completo, tablas maestras, datos de producción y vistas. |
| **`chazinfood.sql`** | Archivo SQL principal del proyecto (sincronizado con la versión `chazinfood_tidb_ready.sql`). |
| **`init.sql`** | Archivo de inicialización para Docker (`db/init.sql`). |

---

## 🚀 Cómo importar la base de datos

### Opción 1: En XAMPP (MySQL Local)
1. Inicia **Apache** y **MySQL** desde el panel de control de XAMPP.
2. Abre tu terminal o PowerShell en la carpeta `backend` y ejecuta:
   ```bash
   C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS chazinfood DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   C:\xampp\mysql\bin\mysql.exe -u root chazinfood < "db\chazinfood_tidb_ready.sql"
   ```
3. O si prefieres desde **phpMyAdmin** (`http://localhost/phpmyadmin`):
   - Crea la base de datos `chazinfood`.
   - Ve a la pestaña **Importar** y selecciona `db/chazinfood_tidb_ready.sql` o `db/chazinfood.sql`.

### Opción 2: En TiDB Cloud Serverless (Nube)
1. Conéctate a tu clúster de TiDB Cloud usando el CLI de MySQL o la consola web de TiDB:
   ```bash
   mysql -u '<tu_usuario>' -h '<gateway.tidbcloud.com>' -P 4000 -D chazinfood --ssl-mode=VERIFY_IDENTITY -p < "db\chazinfood_tidb_ready.sql"
   ```
2. En tu archivo `.env`, configura las variables de conexión:
   ```env
   DB_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
   DB_PORT=4000
   DB_USER=tu_usuario_tidb
   DB_PASSWORD=tu_contraseña_tidb
   DB_NAME=chazinfood
   DB_SSL=true
   ```
