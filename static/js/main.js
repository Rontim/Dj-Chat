/*
 */

let chatName = "";
let chatSocket = null;
let chatWindowUrl = window.location.href;
let chatRoomUuid = Math.random().toString(36).slice(2, 12);

/*
Elements
 */

const chatElement = document.querySelector("#chat");
const chatOpenElement = document.querySelector("#chat_open");
const chatJoinElement = document.querySelector("#chat_join");
const chatIconElement = document.querySelector("#chat_icon");
const chatWelcomeElement = document.querySelector("#chat_welcome");
const chatRoomElement = document.querySelector("#chat_room");
const chatNameElement = document.querySelector("#chat_name");
const chatLoglement = document.querySelector("#chat_log");
const chatInputElement = document.querySelector("#chat_message_input");
const chatSubmitElement = document.querySelector("#chat_message_submit");

/* 
Functions
*/

function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
        let cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

                break;
            }
        }
    }

    return cookieValue;
}
function sendMessage() {
    console.log("Message: ", chatInputElement.value);
    chatSocket.send(
        JSON.stringify({
            "type": "message",
            "message": chatInputElement.value,
            "name": chatName,
        })
    );

    chatInputElement.value = "";
}

async function joinChatRoom() {
    chatName = chatNameElement.value;

    const data = new FormData();
    data.append("name", chatName);
    data.append("url", chatWindowUrl);

    await fetch(`api/create-room/${chatRoomUuid}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: data,
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log("data", data);
        });

    chatSocket = new WebSocket(
        `ws://${window.location.host}/ws/${chatRoomUuid}/`
    );

    chatSocket.onmessage = (e) => {
        console.log("onMessage");
        console.log("Received message:", e.data);
    };

    chatSocket.onopen = (e) => {
        console.log("onOpen - chat socket was opened");
        chatSocket.send(
            JSON.stringify({
                "type": "message",
                "message": 'eyee',
                "name": chatName,
            })
        );
    };

    chatSocket.onclose = (e) => {
        console.log("onClose - chat socket was closed");
    };
}

/*
Event Listeners
 */

chatSubmitElement.addEventListener("click", (e) => {
    e.preventDefault();

    sendMessage();

    return false;
});

chatOpenElement.addEventListener("click", (e) => {
    e.preventDefault();

    chatIconElement.classList.add("hidden");
    chatWelcomeElement.classList.remove("hidden");

    return false;
});

chatJoinElement.addEventListener("click", (e) => {
    e.preventDefault();

    chatWelcomeElement.classList.add("hidden");
    chatRoomElement.classList.remove("hidden");

    joinChatRoom();

    return false;
});
