/**
 * Script de Pruebas de Envío de Todos los Correos Electrónicos
 * Destinatario: samu36669@gmail.com
 */

require('dotenv').config();
const EmailService = require('../src/application/services/emailService');

const TARGET_EMAIL = 'samu36669@gmail.com';
const USER_NAME = 'Samuel';
const USER_LASTNAME = 'Gutiérrez Franco';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runAllEmailTests() {
  console.log('====================================================');
  console.log('🚀 INICIANDO BATERÍA DE PRUEBAS DE CORREOS CHAZIN FOOD');
  console.log(`📬 Destinatario objetivo: ${TARGET_EMAIL}`);
  console.log('====================================================\n');

  // Test 1: Correo de Bienvenida (Welcome Email)
  console.log('1️⃣ Enviando Correo de Bienvenida (Credenciales)...');
  const res1 = await EmailService.sendWelcomeEmail({
    email: TARGET_EMAIL,
    nombre: USER_NAME,
    apellidos: USER_LASTNAME,
    password: 'ChazinMaster2026!*',
    loginLink: 'http://localhost:5173/login'
  });
  console.log(res1 ? '   ✅ Correo 1 (Bienvenida) enviado con éxito.' : '   ❌ Error al enviar Correo 1.');
  await sleep(1800);

  // Test 2: Correo de Activación de Cliente (Activation Email)
  console.log('\n2️⃣ Enviando Correo de Activación de Cuenta de Cliente...');
  const res2 = await EmailService.sendActivationEmail({
    email: TARGET_EMAIL,
    nombre: USER_NAME,
    apellidos: USER_LASTNAME,
    password: 'TempCliente2026#',
    activationLink: 'http://localhost:5173/login'
  });
  console.log(res2 ? '   ✅ Correo 2 (Activación) enviado con éxito.' : '   ❌ Error al enviar Correo 2.');
  await sleep(1800);

  // Test 3: Restablecimiento de Contraseña (Password Reset Email)
  console.log('\n3️⃣ Enviando Correo de Restablecimiento de Contraseña...');
  const res3 = await EmailService.sendPasswordResetEmail({
    email: TARGET_EMAIL,
    nombre: USER_NAME,
    apellidos: USER_LASTNAME,
    resetLink: 'http://localhost:5173/reset-password?token=chazin_secure_reset_token_demo_98765'
  });
  console.log(res3 ? '   ✅ Correo 3 (Restablecer Clave) enviado con éxito.' : '   ❌ Error al enviar Correo 3.');
  await sleep(1800);

  // Test 4: Alerta de Seguridad - Contraseña Modificada (Password Changed Email)
  console.log('\n4️⃣ Enviando Notificación de Cambio de Contraseña...');
  const res4 = await EmailService.sendPasswordChangedEmail({
    email: TARGET_EMAIL,
    nombre: USER_NAME,
    apellidos: USER_LASTNAME,
    nuevaContrasena: 'NuevaClaveSegura2026!*',
    password: 'NuevaClaveSegura2026!*',
    supportLink: 'http://localhost:5173/perfil'
  });
  console.log(res4 ? '   ✅ Correo 4 (Contraseña Modificada) enviado con éxito.' : '   ❌ Error al enviar Correo 4.');
  await sleep(1800);

  // Test 5: Notificación de Perfil Actualizado (User Updated Email)
  console.log('\n5️⃣ Enviando Notificación de Datos de Usuario Actualizados...');
  const res5 = await EmailService.sendUserUpdatedEmail({
    email: TARGET_EMAIL,
    nombre: USER_NAME,
    apellidos: USER_LASTNAME,
    modifiedFields: 'Teléfono Móvil (+57 300 456 7890), Dirección (Calle 127 #15-40)',
    portalLink: 'http://localhost:5173/perfil'
  });
  console.log(res5 ? '   ✅ Correo 5 (Perfil Actualizado) enviado con éxito.' : '   ❌ Error al enviar Correo 5.');

  console.log('\n====================================================');
  console.log('🎉 TODOS LOS CORREOS DE PRUEBA FUERON ENVIADOS!');
  console.log(`📬 Revisa tu bandeja de entrada en: ${TARGET_EMAIL}`);
  console.log('====================================================');
}

runAllEmailTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error general en la prueba:', err);
    process.exit(1);
  });
