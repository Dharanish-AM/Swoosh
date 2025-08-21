package com.example.swoosh.dto.user;

import com.example.swoosh.model.User;

public class UserMapper {

    public static User toEntity(UserRequestDTO dto) {
        User user = new User();
        user.setHashPassword(dto.getPassword()); 
        user.setRegisteredAt(java.time.LocalDateTime.now());
        return user;
    }

public static UserResponseDTO toResponseDTO(User user) {
    return new UserResponseDTO(
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getRegisteredAt()
    );
}
}