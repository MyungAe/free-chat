import SocketIO from "socket.io";

// CORS 문제 발생 : 리소스 요청이 3000 -> 4000으로.
const io = SocketIO(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`event : ${event}, id: ${socket.id}`);
  });
  socket.on("set_nickname", (nickname, done) => {
    socket["nickname"] = nickname;
    done();
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome", socket.nickname);
    done();
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname);
    });
  });
});
