const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const enforce = require('express-sslify');
const connectMongoDbSession = require('connect-mongodb-session');

const utils = require('./services/utils.service');
const config = require('./config');

const server = express();
const http = require('http').Server(server);

const mongoSessionStore = new (connectMongoDbSession(session))({
  uri: config.db.url,
  databaseName: config.db.name,
  collection: 'session'
}, (err) => err && console.log('Can`t connect mongo session!', err));

const sessionMiddleware = session({
  secret: 'MY_SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: mongoSessionStore
});
server.use(sessionMiddleware);
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(cookieParser());

const corsConf = {
  origin: utils.getOriginsInAllProtocols(8080, 8081),
  credentials: true
}
if (process.env.NODE_ENV === 'development') {
  server.use(cors(corsConf));
} else server.use(enforce.HTTPS( { trustProtoHeader: true } ));

const connectRoutes = require('./routes/routes');
connectRoutes(server);

const io = require('socket.io')(http, { cors: corsConf, cookie: true });
io.use((socket, next) => sessionMiddleware(socket.request, {}, next));
const { connectSocketRoutes } = require('./routes/socket');
connectSocketRoutes(io);

server.use(express.static(path.resolve(__dirname, 'public/frontend')));

const { errorHandlerMiddleware } = require('./middlewares/errorHandler.middleware');
server.use(errorHandlerMiddleware);

module.exports = http;