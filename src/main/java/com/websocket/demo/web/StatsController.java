package com.websocket.demo.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.config.WebSocketMessageBrokerStats;

@RestController
public class StatsController {

    @Autowired
    private WebSocketMessageBrokerStats stats;

    @GetMapping("/stats")
    public @ResponseBody WebSocketMessageBrokerStats getStats() {
        return  stats;
    }

}
