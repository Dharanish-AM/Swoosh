package com.example.swoosh.DTO;

import java.time.LocalDateTime;

@SuppressWarnings("unused")
public class UserResponseDTO {
    private final Long id;
    private final String name;
    private final String email;
    private final LocalDateTime registeredAt;

    public UserResponseDTO(Long id, String name, String email, LocalDateTime registeredAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.registeredAt = registeredAt;
    }

}
