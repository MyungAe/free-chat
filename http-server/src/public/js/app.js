// connect socket io server
const socket = io("http://localhost:4000");

// get dom objects
const nickname = document.querySelector("#nickname");
const roomlist = document.querySelector("#roomlist");
const room = document.querySelector("#room");

const nicknameForm = nickname.querySelector("form");
const roomlistForm = roomlist.querySelector("form");
const roomForm = room.querySelector("form");

// show content controller
nickname.hidden = false;
roomlist.hidden = true;
room.hidden = true;

let roomName;

// utility
function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

// set nickname logics
nicknameForm.addEventListener("submit", handleNicknameSubmit);

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nickname.querySelector("input");
  const id = input.value;
  socket.emit("set_nickname", id, showRoomlist);
  input.value = "";
}

function showRoomlist() {
  nickname.hidden = true;
  roomlist.hidden = false;
  roomlistForm.addEventListener("submit", handleEnterRoomSubmit);
}

// enter room logics
function handleEnterRoomSubmit(event) {
  event.preventDefault();
  const input = roomlistForm.querySelector("input");
  roomName = input.value;
  socket.emit("enter_room", roomName, showRoom);
  input.value = "";
}

function showRoom() {
  roomlist.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  roomForm.addEventListener("submit", handleMessageSubmit);
}

// send message logics
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
}

// socket events : server is send to client
socket.on("welcome", (user) => {
  addMessage(`${user} is Joined !`);
});

socket.on("bye", (user) => {
  addMessage(`${user} is left ㅜㅜ`);
});

socket.on("new_message", addMessage);
