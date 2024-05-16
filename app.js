const express = require('express');
const { createServer } = require('http');
const { Server } = require("socket.io");

const app = express();

app.use(express.static("public"));

const server = createServer(app);
const io = new Server(server);


server.listen(5500, () => console.log(`listening on http://localhost:${5500}`));