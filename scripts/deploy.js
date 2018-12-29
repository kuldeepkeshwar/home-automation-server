#!/usr/bin/env node
const shell = require('shelljs');
const secrets = require('./secrets.json');

const envs = `-e FIREBASE_CLIENT_EMAIL=${
  secrets.client_email
} -e FIREBASE_PRIVATE_KEY="${secrets.private_key}"`;
shell.exec(`now ${envs}`);
const url = shell.exec('pbpaste', { silent: true }).stdout;

shell.exec(`now alias ${url} home-automation-server.now.sh`);
