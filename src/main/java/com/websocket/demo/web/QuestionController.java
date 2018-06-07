package com.websocket.demo.web;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class QuestionController {

    @MessageMapping("/questions")
    public String processQuestion(String question, Principal principal) {
        return question.toUpperCase() + " by " + principal.getName();
    }

}
