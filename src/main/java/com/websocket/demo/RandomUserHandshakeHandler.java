package com.websocket.demo;

import com.websocket.demo.domain.LoginEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

public class RandomUserHandshakeHandler extends DefaultHandshakeHandler {

    private ChatRepository chatRepository;

    public RandomUserHandshakeHandler(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        List<String> usernames = Arrays.asList("Spider-Man", "Captain-Marvel", "Hulk", "Thor", "Iron-Man", "Luke-Cage", "Black-Widow", "Daredevil");
        List<String> usedUsernames = chatRepository.getAllSessions().values().stream().map(LoginEvent::getUsername).collect(Collectors.toList());
        List<String> unusedUsernames = usernames.stream().filter(username -> !usedUsernames.contains(username)).collect(Collectors.toList());
        String newUserName;
        if(unusedUsernames.size() == 0) {
            newUserName = UUID.randomUUID().toString();
        } else {
            newUserName = unusedUsernames.get(new Random().nextInt(unusedUsernames.size()));
        }
        return new UsernamePasswordAuthenticationToken(newUserName, null);
    }

}
