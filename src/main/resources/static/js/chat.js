var ws;
var stompClient;
var myUsername = "unknown";
var messageTemplate = '<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">\n' +
    '                    <div class="d-flex w-100 justify-content-between">\n' +
    '                        <p class="mb-1">MESSAGE_TEXT</p>\n' +
    '                        <small class="text-muted">MESSAGE_DATE</small>\n' +
    '                    </div>\n' +
    '                    <small class="text-muted">MESSAGE_USERNAME</small>\n' +
    '                </a>';
$(document).ready(function () {

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

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
        toastr.warning('Bloody hell, something went wrong!');
    });

    $('#privateSubmit').on('click', function () {
        sendPrivate();
    });

    $('#publicSubmit').on('click', function () {
        sendPublic();
    });

    function sendPrivate(){
        var username = $('#usernamesSelect').find(":selected").text();
        var data = $("#privateMessageDataInput").val();
        stompClient.send("/app/chat.private." + username, {}, JSON.stringify({ message: data, username: 'me'}));
        addPrivateMessage(JSON.stringify({ message: data, username: 'me'}));
        $('#privateMessageUsernameInput').val('');
        $('#privateMessageDataInput').val('');
    }

    function sendPublic(){
        var data = $("#publicMessageDataInput").val();
        stompClient.send("/app/chat.public", {}, JSON.stringify({ message: data }));
        $('#publicMessageDataInput').val('');
    }

    function addPrivateMessage(message) {
        var parsedMessage = JSON.parse(message);
        var from = parsedMessage['username'];
        var text = parsedMessage['message'];
        var messageHTML = messageTemplate.replace('MESSAGE_TEXT', text).replace("MESSAGE_USERNAME", from).replace("MESSAGE_DATE", moment(parsedMessage['date']).format("HH:mm"));
        $('#privateChat').append(messageHTML);
    }

    function addPublicMessage(message) {
        var parsedMessage = JSON.parse(message);
        var from = parsedMessage['username'];
        var text = parsedMessage['message'];
        var messageHTML = messageTemplate.replace('MESSAGE_TEXT', text).replace("MESSAGE_USERNAME", from).replace("MESSAGE_DATE", moment(parsedMessage['date']).format("HH:mm"));
        $('#publicChat').append(messageHTML);
    }

    function removeUsername(message){
        $('#' + JSON.parse(message.body).username).remove()
    }

    function showUsernames(messages) {
        $('#usernames').html();
        JSON.parse(messages.body).forEach(function(message){
            if(message.username !== myUsername) {
                $('#usernames').append('<li class="list-group-item" id="' + message.username + '">' + message.username + '</li>');
                $('#usernamesSelect').append($('<option>', {
                    value: message.username,
                    text: message.username
                }));

            }
        });
    }

    function addUsername(message){
        $('#usernames').html();
        if(JSON.parse(message.body).username !== myUsername) {
            $('#usernamesSelect').append($('<option>', {
                value: message.username,
                text: message.username
            }));
            $('#usernames').append('<li class="list-group-item" id="' + JSON.parse(message.body).username + '">' + JSON.parse(message.body).username + '</li>');
        }
    }

    function updateMyUsername(){
        $('#myUsername').text(myUsername);
    }

    updateMyUsername();
});