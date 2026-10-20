const React = require('react');
const { render } = require('@react-email/components');

const ActivationEmail = require('./ActivationEmail');
const WelcomeEmail = require('./WelcomeEmail');
const PasswordResetEmail = require('./PasswordResetEmail');
const PasswordChangedEmail = require('./PasswordChangedEmail');
const UserUpdatedEmail = require('./UserUpdatedEmail');

const e = React.createElement;

async function renderActivationEmail(props) {
  return await render(e(ActivationEmail, props));
}

async function renderWelcomeEmail(props) {
  return await render(e(WelcomeEmail, props));
}

async function renderPasswordResetEmail(props) {
  return await render(e(PasswordResetEmail, props));
}

async function renderPasswordChangedEmail(props) {
  return await render(e(PasswordChangedEmail, props));
}

async function renderUserUpdatedEmail(props) {
  return await render(e(UserUpdatedEmail, props));
}

module.exports = {
  renderActivationEmail,
  renderWelcomeEmail,
  renderPasswordResetEmail,
  renderPasswordChangedEmail,
  renderUserUpdatedEmail,
  // Components
  ActivationEmail,
  WelcomeEmail,
  PasswordResetEmail,
  PasswordChangedEmail,
  UserUpdatedEmail
};
