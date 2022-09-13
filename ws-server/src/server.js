import SocketIO from "socket.io";

// CORS 문제 발생 : 리소스 요청이 3000 -> 4000으로.
const io = SocketIO(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// sid(map) : socket id = 개인방, rooms(set) : 개인방 + 공개방.
// sid에서 rooms 값을 넣었는데 undefined? = 공개방
function getPublicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  // const publicRooms = new Map();
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
      // publicRooms.set(sids.get(key), countRoom(sids.get(key)));
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`event : ${event}, id: ${socket.id}`);
  });
  socket.on("set_nickname", (nickname, done) => {
    socket["nickname"] = nickname;
    io.sockets.emit("room_change", getPublicRooms());
    done();
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    done(countRoom(roomName));
    io.sockets.emit("room_change", getPublicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", getPublicRooms());
  });
});
