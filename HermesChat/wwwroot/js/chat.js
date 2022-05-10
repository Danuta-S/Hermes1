"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("GetOnlineUsers", function (usersList) {
    console.log(usersList);
    Array.from(usersList);
    var onlineUsers = document.getElementById("user-list");
    onlineUsers.innerHTML = "";
    usersList.forEach(addOneUser);
});
function addOneUser(user) {
    var li = document.createElement("li");
    li.innerHTML = `<p>${user}</p>`;
    document.getElementById("user-list").appendChild(li);
}


connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user}: ${message}`;
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").innerHTML;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendMessage", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").innerHTML;
    var message = document.getElementById("messageInput").value;
    var room = document.getElementById("room").value;
    document.getElementById("messageInput").value = "";
    connection.invoke("SendMessage", user, message, room, false).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("joinButton").addEventListener("click", function (event) {

    var room = document.getElementById("room").value;
    var user = document.getElementById("userInput").innerHTML;
    var message = document.getElementById("messageInput").value;
    connection.invoke("CreateRoom", room).catch(function (err) {
        return console.error(err.toString());
    });
    connection.invoke("SendMessage", user, message, room, true).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

//document.getElementById("joinButton").addEventListener("click", function (e) {
//    var form = document.getElementById("myForm"),
//        list = document.getElementById("room-list");
///*    console.log(form);*/
//    list.innerHTML = [].map.call(form.querySelectorAll("input"), function (el) {
//        return "<li>" + el.value + "</li>";
//    }).join("");
//});

//function myFunction(list) {
//    var text = "";
//    var inputs = document.querySelectorAll("input[type=text]");
//    for (var i = 0; i < inputs.length; i++) {
//        text += inputs[i].value;
//    }
//    var li = document.createElement("li");
//    var node = document.createTextNode(text);
//    li.appendChild(node);
//    document.getElementById("room-list").appendChild(li);
//}

//function GetRoomList() {
//    var roomList = connection.invoke("roomList");
//}

connection.on("GetRoomList", function (roomList) {
    console.log(roomList);
    Array.from(roomList);
    var roomList = document.getElementById("room-list");
    roomList.innerHTML = "";
    roomList.forEach(addOneRoom);
});
function addOneRoom(room) {
    var li = document.createElement("li");
    li.innerHTML = `<p>${room}</p>`;
    document.getElementById("room-list").appendChild(li);
}

function scrollDown() {
  $('#messages_container').animate({scrollTop:$('#messages_container').prop('scrollHeight')}, 1000);
}

//document.getElementById("joinButton").addEventListener("click", AddNew {

//    var room = document.getElementById("room").value;
//    var user = document.getElementById("userInput").innerHTML;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendMessage", user, message, room, true).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});

//function AddNew() {
//    const newDiv = document.createElement("div");
//    console.log("add");
//    document.body, appendChild(newDiv);
//}

