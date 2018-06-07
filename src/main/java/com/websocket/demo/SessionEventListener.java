package com.websocket.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.broker.BrokerAvailabilityEvent;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

public class SessionEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatRepository chatRepository;

    @EventListener
    private void handleSessionConnected(SessionConnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String username = headers.getUser().getName();
        System.out.println(username + " just connected");
        String sessionId = headers.getSessionId();
        LoginEvent loginEvent = new LoginEvent(headers.getUser().getName());
        chatRepository.addSession(sessionId, loginEvent);
        messagingTemplate.convertAndSend("/topic/chat.login", loginEvent);
    }

    @EventListener
    private void handleSessionConnected(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String username = headers.getUser().getName();
        System.out.println(username + " just DISconnected");
        String sessionId = headers.getSessionId();
        chatRepository.removeParticipant(sessionId);
        LogoutEvent logoutEvent = new LogoutEvent(username);
        messagingTemplate.convertAndSend("/topic/chat.logout", logoutEvent);
    }


    @EventListener
    private void brokerAvailabilityEvent(BrokerAvailabilityEvent event) {
        if(event.isBrokerAvailable()) {
            System.out.println("Broker is available");
        } else {
            System.out.println("Broker is NOT available");
        }
    }

}
