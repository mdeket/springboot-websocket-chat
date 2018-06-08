package com.websocket.demo.configuration;

import com.websocket.demo.SessionEventListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatConfiguration {
    @Bean
    public SessionEventListener presenceEventListener() {
        SessionEventListener presence = new SessionEventListener();
//        presence.setLoginDestination(chatProperties.getDestinations().getLogin());
//        presence.setLogoutDestination(chatProperties.getDestinations().getLogout());
        return presence;
    }
}
