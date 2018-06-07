package com.websocket.demo;

import java.time.Instant;

public class LogoutEvent {

    private String username;
    private Instant logoutDate;

    public LogoutEvent(String username) {
        this.username = username;
        this.logoutDate = Instant.now();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Instant getLogoutDate() {
        return logoutDate;
    }

    public void setLogoutDate(Instant logoutDate) {
        this.logoutDate = logoutDate;
    }
}
