// connect to sockets.io client side
let socket = io.connect();
let form = document.getElementById("messForm");
let all_messages = document.getElementById("all_mess");
let submit = document.getElementById("submit");
let newName = document.getElementById("name").innerHTML.split(" ").slice(1).toString().replace(/,/g, " ");

// scroll user to bottom on new message
const autoscroll = () => {
  all_messages.scrollTop = all_messages.scrollHeight;
};

socket.emit("send join", { name: newName});
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
  socket.emit("send left", { name: newName});
});
socket.on("add left", function(data) {
  let div = document.createElement("div");
  let spanJoin = document.createElement("span");
  spanJoin.innerHTML = data.name + " left the chat!";
  all_messages.appendChild(div);
  div.appendChild(spanJoin);
  autoscroll();
});

let textArea = document.getElementById("message");

textArea.addEventListener("keyup", e => {
  let inputText = document.getElementById("message").value;
  if (inputText != "") {
    submit.removeAttribute("disabled");
  } else {
    submit.setAttribute("disabled", "true");
  }
});

submit.addEventListener("click", e => {
  event.preventDefault();
  const regEx = /[<>]+/i;
  let inputText = document.getElementById("message").value;
  const error = document.getElementById("error");
  if (inputText.match(regEx)) {
    // error.innerHTML = "*You may not allowed using '>' and '<' symbols";
    error.style.color = "red";
    error.style.opacity = "1";
  } else {
    const sanitText = inputText.replace(/\s{2,}/g, " ");
    socket.emit("send mess", { mess: sanitText, name: newName });
    document.getElementById("message").value = "";
    textArea.style.border = "1px solid #ced4da";
    error.style.opacity = "0";
    // error.innerHTML = "";
  }
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
