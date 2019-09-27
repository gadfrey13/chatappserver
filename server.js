var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

const users = {};

io.on("connection", socket => {
  //add a new user to the chat
  socket.on("new-user", name => {
    users[socket.id] = name; //set the key to unique value of the socket
    socket.broadcast.emit("user-connected", name);
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
});

server.listen(process.env.PORT || 2000, () => {
  console.log(`app is running in port ${process.env.PORT}`);
});
