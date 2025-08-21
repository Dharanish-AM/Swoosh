package com.example.swoosh.dto.user;

import com.example.swoosh.model.User;

public class UserMapper {

    public static User toEntity(UserRequestDTO userDto) {
        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setHashPassword(userDto.getPassword());

        return user;
    }

    public static UserResponseDTO toResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRooms(),
                user.getRegisteredAt()

        );
    }
}