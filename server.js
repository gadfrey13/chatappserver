var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

const users = {};

io.on("connection", socket => {
  //add a new user to the chat
  socket.on("new-user", name => {
    users[socket.id] = name; //set the key to unique value of the socket
    socket.broadcast.emit("user-connected", name);
    socket.broadcast.emit("users-online", Object.keys(users).length);
    socket.emit("users-online", Object.keys(users).length);
    socket.emit("users-names", users);
    socket.broadcast.emit("users-names", users);
  });

  //broadcast the message
  socket.on("send-chat-message", message => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id]
    });
  });
  //is user unique
  socket.on("check-unique-user", name => {
    let bool = true;
    if (Object.values(users).indexOf(name) > -1) {
      bool = false;
    }
    socket.emit("unique-user", bool);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      socket.broadcast.emit("user-disconnected", users[socket.id]);
      socket.broadcast.emit("users-online", Object.keys(users).length);
      socket.broadcast.emit("disconnect-user-key", socket.id);
      delete users[socket.id];
    }
  });
});

server.listen(process.env.PORT || 2000, () => {
  console.log(`app is running in port ${process.env.PORT}`);
});
