var ws;
var stompClient;
var myUsername = "unknown";

var messageLeft = '<div class="answer left">\n' +
    '                        <div class="avatar">\n' +
    '                            <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="User name">\n' +
    '                            <div class="status offline"></div>\n' +
    '                        </div>\n' +
    '                        <div class="text">MESSAGE_TEXT' +
    '                        </div>\n' +
    '                        <div class="time">MESSAGE_DATE</div>\n' +
    '                    </div>';

var messageRight = '<div class="answer right">\n' +
    '                        <div class="avatar">\n' +
    '                            <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="User name">\n' +
    '                            <div class="status offline"></div>\n' +
    '                        </div>\n' +
    '                        <div class="name"></div>\n' +
    '                        <div class="text">MESSAGE_TEXT' +
    '                        </div>\n' +
    '                        <div class="time">MESSAGE_DATE</div>\n' +
    '                    </div>';

var chatTemplate = '<div class="user" id="ID">\n' +
    '                        <div class="avatar">\n' +
    '                            <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="User name">\n' +
    '                            <div class="status online"></div>\n' +
    '                        </div>\n' +
    '                        <div class="name">USERNAME</div>\n' +
    '<div class="mood">Online</div>' +
    '                    </div>';
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

    $('#publicMessageDataInput').bind("enterKey",function(e){
        //do stuff here
        sendPublic();
    });

    $('#publicMessageDataInput').keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });


    function sendPrivate(){
        var username = $('#usernamesSelect').find(":selected").text();
        if(username === undefined || username === '' || username === 'Choose user for private chat') {
            toastr.error("Please choose user to whom a message will be sent");
            return;
        }

        var data = $("#privateMessageDataInput").val();
        if(data === undefined || data === '') {
            toastr.error("Message can't be empty!");
            return;
        }

        stompClient.send("/app/chat.private." + username, {}, JSON.stringify({ message: data, username: 'me'}));
        addPrivateMessage(JSON.stringify({ message: data, username: 'me'}));
        $('#privateMessageUsernameInput').val('');
        $('#privateMessageDataInput').val('');
    }

    function sendPublic(){
        var data = $("#publicMessageDataInput").val();
        if(data !== undefined && data !== '') {
            stompClient.send("/app/chat.public", {}, JSON.stringify({ message: data }));
            $('#publicMessageDataInput').val('');
        } else {
            toastr.error("Message can't be empty!");
            return;
        }
    }

    function addPrivateMessage(message) {
        var parsedMessage = JSON.parse(message);
        var from = parsedMessage['username'];
        var text = parsedMessage['message'];
        var messageHTML = messageTemplate
            .replace('MESSAGE_TEXT', text)
            .replace("MESSAGE_USERNAME", from)
            .replace("MESSAGE_DATE", moment(parsedMessage['date']).format("HH:mm"));
        $('#privateChat').append(messageHTML);
    }

    function addPublicMessage(message) {
        var parsedMessage = JSON.parse(message);
        var from = parsedMessage['username'];
        var text = parsedMessage['message'];
        var messageHTML;
        if(from === myUsername) {
            messageHTML = messageRight
                .replace('MESSAGE_TEXT', text)
                .replace("MESSAGE_DATE", moment(parsedMessage['date']).format("HH:mm"));
        } else {
            messageHTML = messageLeft
                .replace('MESSAGE_TEXT', text)
                .replace("MESSAGE_DATE", moment(parsedMessage['date']).format("HH:mm"));
        }

        $(messageHTML).insertBefore(".answer-add");
        $('.message-container').animate({
            scrollTop: 1000
        }, 0);
    }

    function removeUsername(message){
        $('#' + JSON.parse(message.body).username).remove()
    }

    function showUsernames(messages) {
        JSON.parse(messages.body).forEach(function(message){
            if(message.username !== myUsername) {
                var temp = chatTemplate
                    .replace("USERNAME", message.username)
                    .replace("ID", message.username);
                $(temp).insertBefore('.user');

            }
        });
    }

    function addUsername(message){
        if(JSON.parse(message.body).username !== myUsername) {
            var temp = chatTemplate
                .replace("USERNAME", JSON.parse(message.body).username)
                .replace("ID", JSON.parse(message.body).username);
            $('.chat-users').append(temp);
        }
    }

    function updateMyUsername(){
        $('#myUsername').text(myUsername);
    }
    $(".chat").niceScroll();

    updateMyUsername();
});