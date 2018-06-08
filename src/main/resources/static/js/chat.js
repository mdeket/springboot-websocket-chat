var ws;
var stompClient;
var myUsername = "unknown";
var chosenChat = "Public";

var messages = [];

var messageLeft = '<div class="answer left">\n' +
    '                        <div class="avatar">\n' +
    '                            <img src="https://randomuser.me/api/portraits/thumb/men/83.jpg" alt="User name">\n' +
    '                            <div class="status online"></div>\n' +
    '                        </div>\n' +
    '                        <div class="text">MESSAGE_TEXT' +
    '                        </div>\n' +
    '                        <div class="time">MESSAGE_DATE</div>\n' +
    '                    </div>';

var messageRight = '<div class="answer right">\n' +
    '                        <div class="avatar">\n' +
    '                            <img src="https://randomuser.me/api/portraits/thumb/men/83.jpg" alt="User name">\n' +
    '                            <div class="status online"></div>\n' +
    '                        </div>\n' +
    '                        <div class="name"></div>\n' +
    '                        <div class="text">MESSAGE_TEXT' +
    '                        </div>\n' +
    '                        <div class="time">MESSAGE_DATE</div>\n' +
    '                    </div>';

var chatTemplate = '<div class="user" id="ID">\n' +
    '                        <div class="avatar">\n' +
    '                            <img src="https://randomuser.me/api/portraits/thumb/men/83.jpg" alt="User name">\n' +
    '                            <div class="status online"></div>\n' +
    '                        </div>\n' +
    '                        <div class="name">USERNAME</div>' +
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
            if(JSON.parse(message.body).from !== myUsername) {
                receivedPublicMessage(JSON.parse(message.body));
            }
        });

        stompClient.subscribe("/user/exchange/amq.direct/chat.private", function (message) {
            console.log(JSON.parse(message.body))
            var temp = JSON.parse(message.body);
            var message = JSON.parse(message.body);
            message.to = temp.from;
            message.from = temp.to;
            receivedPrivateMessage(message);
            if(message.to !== chosenChat) {
                toastr.info("You just received private message from " + message.to);
            }
        });

    }, function (error) {
        console.log(error);
        toastr.warning('Bloody hell, something went wrong!');
    });

    $('#submitMessage').on('click', function () {
        if(chosenChat === 'Public') {
            sendPublic();
        } else {
            sendPrivate();
        }
    });

    $('#messageInput').bind("enterKey",function(e){
        //do stuff here
        if(chosenChat === 'Public') {
            sendPublic();
        } else {
            sendPrivate();
        }
    });

    $('#messageInput').keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });


    function sendPrivate(){
        var username = chosenChat; //$('#usernamesSelect').find(":selected").text();
        if(username === undefined || username === '' || username === 'Choose user for private chat') {
            toastr.error("Please choose user to whom a message will be sent");
            return;
        }

        var data = $("#messageInput").val();
        if(data === undefined || data === '') {
            toastr.error("Message can't be empty!");
            return;
        }

        stompClient.send("/app/chat.private." + username, {}, JSON.stringify({ message: data, username: 'me'}));
        $('#messageInput').val('');
        addMessage({ text: data, to: username, from: myUsername, date: moment().format("HH:mm") });
        // addPrivateMessage({ text: data, to: username, from: myUsername, date: moment().format("HH:mm")});
    }

    function addPrivateMessage(message) {
        var from = message.from;
        var text = message.text;
        var date = message.date;
        if(from === myUsername) {
            messageHTML = messageRight
                .replace('MESSAGE_TEXT', text)
                .replace("MESSAGE_DATE", date);
        } else {
            messageHTML = messageLeft
                .replace('MESSAGE_TEXT', text)
                .replace("MESSAGE_DATE", date);
        }

        $(messageHTML).insertBefore(".answer-add");
        $('.message-container').animate({
            scrollTop: 1000
        }, 0);
    }

    function receivedPrivateMessage(message) {
        var to = message['to'];
        var from = message['from'];
        var text = message['message'];
        addMessage({to: to, from: to, text: text, date: moment(message['date']).format("HH:mm")});
    }

    function receivedPublicMessage(message) {
        var to = message['to'];
        var from = message['from'];
        var text = message['message'];
        addMessage({to: to, from: from, text: text, date: moment(message['date']).format("HH:mm")});
    }

    function sendPublic(){
        var data = $("#messageInput").val();
        if(data !== undefined && data !== '') {
            stompClient.send("/app/chat.public", {}, JSON.stringify({ message: data }));
            $('#messageInput').val('');
            addMessage({ to: "Public", text: data, from: myUsername, date: moment().format("HH:mm") });
        } else {
            toastr.error("Message can't be empty!");
            return;
        }
    }

    function addPublicMessage(message) {
        var from = message.from;
        var text = message.text;
        var date = message.date;
        var messageHTML;
        if(from === myUsername) {
            messageHTML = messageRight
                .replace('MESSAGE_TEXT', text)
                .replace("MESSAGE_DATE", date);
        } else {
            messageHTML = messageLeft
                .replace('MESSAGE_TEXT', text)
                .replace("MESSAGE_DATE", date);
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
                $('.chat-users').append(temp);
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

    function addMessage(message){
        if(messages.length > 0) {
            debugger
            var added = false;
            messages.forEach(function (data) {
                if(data.chat === message.to) {
                    if(data.message === undefined){
                        data.message = [];
                    }
                    data.message.push({ text: message.text, date: message.date, from: message.from });
                    added = true;
                }
            });
            if(!added) {
                messages.push({ chat: message.to, message: [{ text: message.text, date: message.date, from: message.from}]})
            }
        } else {
            messages.push({ chat: message.to, message: [{ text: message.text, date: message.date, from: message.from }]})
        }
        parseMessages();
    }

    $(".chat").niceScroll();

    $(".chat-users").on('click','.user',  function(event) {
        chosenChat = $(this.closest('.user')).attr('id');
        $('#chatTitle').text(chosenChat);
        parseMessages();
    });

    function parseMessages() {
        $('.answer').remove();
        if(chosenChat === 'Public'){
            messages.forEach(function (value) {
                if(value.chat === 'Public') {
                    value.message.forEach(function (data) {
                        addPublicMessage({ from: data.from , text: data.text, date: data.date });
                    })
                }
            });
        } else {
            messages.forEach(function (value) {
                if(value.chat === chosenChat) {
                    value.message.forEach(function (data) {
                        addPrivateMessage({ from: data.from , text: data.text, date: data.date });
                    })
                }
            });
        }
    }

    updateMyUsername();
});