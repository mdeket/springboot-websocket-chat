package com.websocket.demo.domain;

import java.time.Instant;

public class ChatMessage {

    private String username;
    private String message;
    private Instant date;

    public ChatMessage() {
        this.date = Instant.now();
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "ChatMessage [user=" + username + ", message=" + message + "]";
    }

}