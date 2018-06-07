//package com.websocket.demo.configuration;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.config.annotation.EnableWebSocket;
//import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
//import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.concurrent.CopyOnWriteArrayList;
//
//@Configuration
//@EnableWebSocket
//public class WebSocketConfig implements WebSocketConfigurer {
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry webSocketHandlerRegistry) {
//        webSocketHandlerRegistry.addHandler(new QuestionHandler(), "/questions").withSockJS();
//    }
//
//    class QuestionHandler extends TextWebSocketHandler {
//
//        private List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
//
//        @Override
//        public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//            super.afterConnectionEstablished(session);
//        }
//
//        @Override
//        protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//            for(WebSocketSession s : sessions) {
//                try {
//                    s.sendMessage(message);
//                } catch(IOException ioe) {
//                    System.out.println("Burn");
//                }
//            }
//
//        }
//
//        @Override
//        public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
//            super.handleMessage(session, message);
//        }
//    }
//}
