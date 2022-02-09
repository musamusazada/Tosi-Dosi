


let connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
//Disable the send button until connection is established.
document.getElementById("createBtn").disabled = true;

connection.on("CreateChat", function (groupLink, username, _botMessage, _botUsername) {
    console.log("Room Id" + groupLink + "username" + username);
    document.querySelector(".roomId").innerText = groupLink;
    createMessageComponent(_botUsername, _botMessage);


});

connection.on("JoinChat", function (groupLink, username, _botMessage, _botUsername) {

    console.log("Room Id" + room + "username" + username);
    document.querySelector(".roomId").innerText = groupLink;
    createMessageComponent(_botUsername, _botMessage);


});

connection.on("ReceiveMessage", function (username, message) {
    createMessageComponent(username, message);
});


connection.start().then(function () {
    document.getElementById("createBtn").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());

});


document.getElementById("createRoom").addEventListener("click", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    if (username == "") {
        username = "anonymous";
    }
    let groupLink = makeid(20);
    connection.invoke("CreateRoom", username, groupLink).catch(function (err) {
        return console.error(err.toString());
    });
    document.getElementById("join").style.display = "none";
    document.getElementById("chatbox").style.display = "flex";

});



document.getElementById("joinBtn").addEventListener("click", function (event) {
    let username = document.getElementById("username").value;
    if (username == "") {
        username = "anonymous";
    }
    let room = document.getElementById("roomIdInput").value;
    if (room == "") {
        document.getElementById("joinBtn").disabled = true;
    } else {
        document.getElementById("joinBtn").disabled = false;
    }
    connection.invoke("JoinRoom", username, room).catch(function (err) {
        return console.error(err.toString());
    });
    document.getElementById("join").style.display = "none";
    document.getElementById("chatbox").style.display = "flex";

    event.preventDefault();
});


document.getElementById("sendBtn").addEventListener("click", function (event) {
    event.preventDefault();

    const message = document.getElementById("messageInput").value;

    if (message == "") {
        document.getElementById("sendBtn").disabled = true;
    }
    else {
        document.getElementById("sendBtn").disabled = false;

    }
    connection.invoke("SendMessage", message, chatRoomID).catch(function (err) {
        return console.error(err.toString());
    });
    document.getElementById("messageInput").value = '';
});



//Method to Create Room Link
function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


//Method to create a Message Component
function createMessageComponent(username, message) {
    const messageItem = document.createElement("div");
    const messageBody = document.createElement("div");
    const messageSender = document.createElement("div");
    messageItem.classList.add("message-item");
    messageBody.classList.add("message");
    messageSender.classList.add("username");

    messageBody.innerText = message;
    messageSender.innerText = username;
    messageItem.append(messageBody);
    messageItem.append(messageSender);

    document.querySelector(".messages").appendChild(messageItem);
}