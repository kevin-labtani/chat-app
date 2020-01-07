// connect to sockets.io client side
let socket = io.connect();
let form = document.getElementById("messForm");
let all_messages = document.getElementById("all_mess");
let submit = document.getElementById("submit");
let newName = document.getElementById("name").innerHTML.split(" ");

// scroll user to bottom on new message
const autoscroll = () => {
  all_messages.scrollTop = all_messages.scrollHeight;
};

socket.emit("send join", { name: newName.slice(1) });
socket.on("add join", function(data) {
  let div = document.createElement("div");
  let spanJoin = document.createElement("span");
  spanJoin.innerHTML = data.name + " joined the chat!";
  all_messages.appendChild(div);
  div.appendChild(spanJoin);
  autoscroll();
});

const logout = document.getElementById("logout");
logout.addEventListener("click", e => {
  socket.emit("send left", { name: newName.slice(1) });
});
socket.on("add left", function(data) {
  let div = document.createElement("div");
  let spanJoin = document.createElement("span");
  spanJoin.innerHTML = data.name + " left the chat!";
  all_messages.appendChild(div);
  div.appendChild(spanJoin);
  autoscroll();
});

submit.addEventListener("click", e => {
  let inputText = document.getElementById("message").value;
  event.preventDefault();
  socket.emit("send mess", { mess: inputText, name: newName.slice(1) });
  document.getElementById("message").value = "";
});
socket.on("add mess", function(data) {
  let div = document.createElement("div");
  let spanName = document.createElement("span");
  spanName.innerHTML = data.name + ": ";
  spanName.style.fontWeight = "bold";
  let spanMess = document.createElement("span");
  spanMess.innerHTML = data.msg;
  all_messages.appendChild(div);
  div.appendChild(spanName);
  div.appendChild(spanMess);
  autoscroll();
});
