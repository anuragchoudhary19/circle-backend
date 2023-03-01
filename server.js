const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
  },
  transports: ['websocket', 'polling', 'flashsocket'],
  credentials: true,
});
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const fs = require('fs');

//CONNECT TO DATABASE
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DATABASE CONNECTED'))
  .catch((err) => console.log(`DATABASE CONNECTION ERROR:${err.message}`));
const corsOptions = {
  origin: process.env.ORIGIN,
  methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors());
// app.options('*', cors());

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));
app.use(requestIp.mw());
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized!' });
  }
});
let socket;
app.use(function (req, res, next) {
  req.socket = socket;
  next();
});

fs.readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));

//port
const PORT = process.env.PORT || 8000;
http.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
let onlines = new Map();
socket = io.on('connection', (socket) => {
  socket.on('end', function () {
    socket.disconnect();
  });
  socket.on('online', function (data) {
    // console.log(id);
    onlines.set(data.id, { id: data.id, visits: data.visits, lastOnline: Date.now() });
  });
  socket.on('get-onlines', function () {
    // console.log(id);
    if (Array.from(onlines.values()).length > 0) {
      socket.emit('onlines', Array.from(onlines.values()));
    }
  });
  return socket;
});

setInterval(() => {
  for (let [user, data] of onlines) {
    if (Date.now() - data?.lastOnline > 1000 * 60 * 60 * 24) {
      onlines.delete(user);
    }
  }
  if (Array.from(onlines.values()).length > 0) {
    socket.emit('onlines', Array.from(onlines.values()));
  }
}, 5000);
