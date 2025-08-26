package com.example.swoosh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.swoosh.dto.auth.AuthRequestDTO;
import com.example.swoosh.dto.auth.AuthResponseDTO;
import com.example.swoosh.dto.user.UserRequestDTO;
import com.example.swoosh.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public void signup(@RequestBody UserRequestDTO user) {
        userService.signup(user);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody AuthRequestDTO request) {
        return userService.login(request);
    }
}
