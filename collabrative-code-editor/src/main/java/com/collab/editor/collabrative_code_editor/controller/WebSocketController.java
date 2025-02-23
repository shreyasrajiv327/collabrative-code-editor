package com.collab.editor.collabrative_code_editor.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/sendMessage") // Clients send messages here
    @SendTo("/topic/messages") // Broadcast messages to clients
    public String handleMessage(String message) {
        System.out.println("Received message: " + message);
        return "Server response: " + message;
    }
}