const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./devices");
const app = express();
const port = process.env.PORT || 9090;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  console.log(req.originalUrl);
  next();
});
app.get("/ping", function(req, res) {
  res.send("pong");
});
app.post("/api/devices", function(req, res) {
  const ip = req.body.ip;
  if (!ip) {
    throw new Error("device ip is required");
  }
  const device = db.add(ip);
  res.json({ success: 1, data: device });
});
app.get("/api/devices/:id", function(req, res) {
  const id = req.params.id - 0;
  db.update(id);
  const device = db.fetchOne(id);
  res.json({ success: 1, data: device });
});
app.post("/api/devices/:id", function(req, res) {
  const id = req.params.id - 0;
  const payload = req.body;
  const device = db.set(id, payload);
  res.json({ success: 1, data: device });
});
app.get("/api/devices", function(req, res) {
  const devices = db.fetchAll();
  res.json({ success: 1, data: devices });
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: 0, message: err.message || "Something broke!" });
});
app.listen(port, (...args) =>
  console.log(`Example app listening on port ${port}!`, ...args)
);
