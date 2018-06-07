var ws;
var stompClient;
var myUsername = "unknown";

$(document).ready(function () {

    ws = new SockJS('/ws');
    stompClient = Stomp.over(ws);

    stompClient.connect({}, function (frame) {

        myUsername = JSON.parse(JSON.stringify(frame)).headers['user-name'];
        updateMyUsername();

        stompClient.subscribe("/app/chat.participants", function (message) {
            showUsernames(message);
        });

        stompClient.subscribe("/topic/chat.login", function (message) {
            addUsername(message);
        });

        stompClient.subscribe("/topic/chat.logout", function (message) {
            removeUsername(message);
        });

        stompClient.subscribe("/topic/chat.public", function (message) {
            addPublicMessage(message.body);
        });

        stompClient.subscribe("/user/exchange/amq.direct/chat.private", function (message) {
            addPrivateMessage(message.body);
        });

    }, function (error) {
        console.log(error);
        alert("Bloody hell, something went wrong!")
    });

    $('#submit').on('click', function () {
        sendData();
    });

    $('#privateSubmit').on('click', function () {
        sendPrivate();
    });

    $('#publicSubmit').on('click', function () {
        sendPublic();
    });

    $('#subscribe').on('click', function () {
        ws.onmessage = function (data) {
            console.log(data);
        };
    });

    function sendPrivate(){
        var username = $('#privateMessageUsernameInput').val();
        var data = $("#privateMessageDataInput").val();
        stompClient.send("/app/chat.private." + username, {}, JSON.stringify({ message: data, username: 'me'}));
        addPrivateMessage(JSON.stringify({ message: data, username: 'me'}));
    }

    function sendPublic(){
        var data = $("#publicMessageDataInput").val();
        stompClient.send("/app/chat.public", {}, JSON.stringify({ message: data }));
    }

    function addPrivateMessage(message) {
        var parsedMessage = JSON.parse(message);
        var from = parsedMessage['username'];
        var text = parsedMessage['message'];
        $('#privateChat').append('<li>' + text + " : "  + from + '</li>');
    }

    function addPublicMessage(message) {
        var parsedMessage = JSON.parse(message);
        var from = parsedMessage['username'];
        var text = parsedMessage['message'];
        $('#publicChat').append('<li>' + text + " : "  + from + '</li>');
    }

    function removeUsername(message){
        $('#' + JSON.parse(message.body).username).remove()
    }

    function showUsernames(messages) {
        $('#usernames').html();
        JSON.parse(messages.body).forEach(function(message){
            if(message.username !== myUsername) {
                $('#usernames').append('<li id="' + message.username + '">' + message.username + '</li>');
            }
        });
    }

    function addUsername(message){
        $('#usernames').html();
        $('#usernames').append('<li id="' + JSON.parse(message.body).username + '">' + JSON.parse(message.body).username + '</li>');
    }

    function updateMyUsername(){
        $('#myUsername').text(myUsername);
    }

    updateMyUsername();
});