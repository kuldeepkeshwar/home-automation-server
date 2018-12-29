#!/usr/bin/env node
const shell = require('shelljs');
const secrets = require('./secrets.json');
const { scripts } = require('./../package.json');

const envs = `FIREBASE_CLIENT_EMAIL=${
  secrets.client_email
} FIREBASE_PRIVATE_KEY="${secrets.private_key}"`;
shell.exec(`${envs} ${scripts.start}`);
