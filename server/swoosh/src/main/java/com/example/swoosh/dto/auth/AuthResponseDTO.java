package com.example.swoosh.dto.auth;

import com.example.swoosh.dto.user.UserResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private UserResponseDTO user;
    private String token;
}
