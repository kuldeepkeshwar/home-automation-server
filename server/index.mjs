import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import Path from 'path';
import api from './api.mjs';

const app = express();
const port = process.env.PORT || 9090;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('build'));

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use((req, res, next) => {
  const {
    originalUrl, body, query, params, method,
  } = req;
  if (method !== 'GET') {
    console.log({
      originalUrl,
      body,
      query,
      params,
      method,
    });
  }
  next();
});
app.use('/api', api);

app.get('*', (req, res) => {
  const indexFile = Path.resolve('./build/index.html');
  res.sendFile(indexFile);
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(500).json({
    success: 0,
    code: err.code,
    message: err.message || 'Something broke!',
  });
});
app.listen(port, (...args) => console.log(`Example app listening on port ${port}!`, ...args));
