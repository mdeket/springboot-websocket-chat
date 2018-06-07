package com.websocket.demo;

import com.websocket.demo.domain.LoginEvent;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatRepository {

    private Map<String, LoginEvent> activeSessions = new ConcurrentHashMap<>();

    public void addSession(String sessionId, LoginEvent loginEvent) {
        activeSessions.put(sessionId, loginEvent);
    }

    public LoginEvent getParticipant(String sessionId) {
        return activeSessions.get(sessionId);
    }

    public void removeParticipant(String sessionId) {
        activeSessions.remove(sessionId);
    }

    public Map<String, LoginEvent> getAllSessions() {
        return activeSessions;
    }

}
