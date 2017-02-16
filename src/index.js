// Setup basic express server
import express from 'express';

import Chat from './server/modules/chat';


const app = express();
const server = require('http').createServer(app);

const port = process.env.PORT || 3000;


/* eslint-disable no-console */
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

const chat = new Chat({ server: server });
chat.start();
