package com.websocket.demo;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class RandomUserHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        List<String> usernames = Arrays.asList("Spider-Man", "Captain-Marvel", "Hulk", "Thor", "Iron-Man", "Luke-Cage", "Black-Widow", "Daredevil");
        return new UsernamePasswordAuthenticationToken(usernames.get(new Random().nextInt(usernames.size())), null);
    }

}
