package com.websocket.demo.web;

import com.websocket.demo.domain.ChatMessage;
import com.websocket.demo.ChatRepository;
import com.websocket.demo.domain.LoginEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Collection;

@Controller("/chat")
public class ChatController {

    @Autowired
    private ChatRepository participantRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @SubscribeMapping("/chat.participants")
    public Collection<LoginEvent> retrieveParticipants() {
        return participantRepository.getAllSessions().values();
    }

    @MessageMapping("/chat.public")
    public ChatMessage publicChat(@Payload ChatMessage chatMessage, Principal principal) {
        chatMessage.setTo("Public");
        chatMessage.setFrom(principal.getName());
        return chatMessage;
    }

    @MessageMapping("/chat.private.{username}")
    public void privateChat(@Payload ChatMessage chatMessage, @DestinationVariable("username") String username, Principal principal) {
        chatMessage.setTo(username);
        chatMessage.setFrom(principal.getName());
        String message = chatMessage.getMessage();
        String editedMessage = "[private] " + message;
        chatMessage.setMessage(editedMessage);
        simpMessagingTemplate.convertAndSend("/user/" + username + "/exchange/amq.direct/chat.private", chatMessage);
    }
}
