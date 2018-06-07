package com.websocket.demo;

import java.time.Instant;

public class LoginEvent {

    private String username;
    private Instant loginDate;

    public LoginEvent(String username) {
        this.username = username;
        this.loginDate = Instant.now();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Instant getLoginDate() {
        return loginDate;
    }

    public void setLoginDate(Instant loginDate) {
        this.loginDate = loginDate;
    }
}
