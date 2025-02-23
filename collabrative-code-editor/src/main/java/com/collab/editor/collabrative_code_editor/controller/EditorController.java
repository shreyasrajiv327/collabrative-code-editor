package com.collab.editor.collabrative_code_editor.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.collab.editor.collabrative_code_editor.model.UserMessage;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@Controller
public class EditorController {
    private final Set<String> activeUsers = new CopyOnWriteArraySet<>();
    private String currentCode = "// Start coding...";

    @MessageMapping("/code")  
    @SendTo("/topic/updates") 
    public String handleCodeUpdate(String code) {
        currentCode = code; 
        return code; 
    }

    @MessageMapping("/join")
    @SendTo("/topic/users")
    public Set<String> addUser(UserMessage userMessage) {
        activeUsers.add(userMessage.getName());
        return activeUsers;
    }

    @MessageMapping("/leave")
    @SendTo("/topic/users")
    public Set<String> removeUser(UserMessage userMessage) {
        activeUsers.remove(userMessage.getName());
        return activeUsers;
    }
}
