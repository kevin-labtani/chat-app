// connect to sockets.io client side
let socket = io.connect();
let form = document.getElementById("messForm");
let all_messages = document.getElementById("all_mess");
let submit = document.getElementById("submit");

submit.addEventListener("click", e => {
  let inputText = document.getElementById("message").value;
  let newName = document.getElementById("name").value;
  event.preventDefault();
  socket.emit("send mess", { mess: inputText, name: newName });
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
});
