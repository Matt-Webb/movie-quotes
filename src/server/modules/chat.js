const io = require('socket.io');
import Movie from './movie';

export default class Chat {
  constructor(args) {
      this.io = io(args.server);
      this.numUsers = 0;
      this.movie = new Movie();
  }

  start() {
    return this.io.on('connection', (socket) => {
      var addedUser = false;

      // when the client emits 'new message', this listens and executes
      socket.on('new message', (data) => {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
          username: socket.username,
          message: data
        });

        if(data.indexOf('quote') > -1) {

          this.movie.getQuote().then( (data) => {
            this.io.emit('new message',{
              username: 'movie_quote',
              message: data
            });

          },(error) => {
            throw new Error(error);
          });
        }
      });

      // when the client emits 'add user', this listens and executes
      socket.on('add user', (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++this.numUsers;
        addedUser = true;
        socket.emit('login', {
          numUsers: this.numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
          username: socket.username,
          numUsers: this.numUsers
        });
      });

      // when the client emits 'typing', we broadcast it to others
      socket.on('typing',  () => {
        socket.broadcast.emit('typing', {
          username: socket.username
        });
      });

      // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });

      // when the user disconnects.. perform this
      socket.on('disconnect', () => {
        if (addedUser) {
          --this.numUsers;

          // echo globally that this client has left
          socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: this.numUsers
          });
        }
      });
    });
  }

}
