const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require('path');
const socketIo = require('socket.io');
const swagguerUI = require('swagger-ui-express');
const swaggerDocument = require('./doc/api.json');
const cors = require('cors');

const config = require('./config');
const port = process.env.PORT || 5000; 
const hostname = ("RENDER" in process.env) ? "0.0.0.0" : "localhost"; // 0.0.0.0 on Render

mongoose.connect(process.env.MONGO_URI || config.db)
.then(() => console.log('Conection successful!'))
.catch((err) => console.error(err));

let router = require('./router');

var app = express();

const customFrontendUrl = process.env.FRONTEND_URL || '';

const allowedOrigins = [
  customFrontendUrl,
  'https://pwa-all-app.vercel.app',
].filter(Boolean);

const isAllowedOrigin = (origin) =>
  !origin || allowedOrigins.includes(origin);

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://*:*", //allow all IPs and All ports
  }
})

io.on("connection", (socket) => {
  console.log('Socket, new connection', socket.id);

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    socket.disconnect()
  });
})

io.on("error", (err) => {
  console.log(`socket error: ${err}`);
});

app.use(router.init(io));
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api-docs', swagguerUI.serve, swagguerUI.setup(swaggerDocument));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});