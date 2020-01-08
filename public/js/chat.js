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
  div.className = "border-bottom border-top";
  div.style.height = "80px";
  let spanJoin = document.createElement("p");
  let spanName = document.createElement("span");
  spanName.innerHTML = data.name;
  console.log(spanName);
  spanName.className = "text-info font-weight-bold";
  spanJoin.innerHTML = `It's a bird! It's a plane! Nevermind, it's just `;
  spanJoin.className = "pl-3";
  spanJoin.appendChild(spanName);
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
    socket.emit("send mess", { mess: sanitText, name: newName.slice(1) });
    document.getElementById("message").value = "";
    textArea.style.border = "1px solid #ced4da";
    error.style.opacity = "0";
    // error.innerHTML = "";
  }
});

socket.on("add mess", function(data) {
  const div = document.createElement("div");
  const spanName = document.createElement("span");
  spanName.className = "d-block pl-3 font-weight-bold text-info";
  div.className = "border-bottom border-top";
  div.style.height = "80px";
  spanName.innerHTML = data.name;
  spanName.style.fontWeight = "bold";
  const spanMess = document.createElement("span");
  spanMess.className = "pl-3 pt-2";
  spanMess.innerHTML = data.msg;
  all_messages.appendChild(div);
  div.appendChild(spanName);
  div.appendChild(spanMess);
  autoscroll();
});
