package com.example.swoosh.dto.user;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@SuppressWarnings("unused")
@AllArgsConstructor
@Data
public class UserResponseDTO {
    private final Long id;
    private final String name;
    private final String email;
    private final LocalDateTime registeredAt;
    

}
