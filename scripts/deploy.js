#!/usr/bin/env node
const shell = require('shelljs');
const secrets = require('./secrets.json');
const { alias } = require('./../now.json');

const envs = `-e FIREBASE_CLIENT_EMAIL=${
  secrets.client_email
} -e FIREBASE_PRIVATE_KEY="${secrets.private_key}"`;

const url = shell.exec(`now ${envs} --public`).stdout;
shell.exec(`now alias ${url} ${alias[0]}.now.sh`);
process.exit(0);
