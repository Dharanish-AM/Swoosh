package com.example.swoosh.dto.user;

import java.util.List;
import java.util.stream.Collectors;

import com.example.swoosh.dto.room.RoomSummaryDTO;
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
        List<RoomSummaryDTO> roomDTOs = user.getRooms().stream()
                .map(room -> (RoomSummaryDTO) new RoomSummaryDTO(
                        room.getId(),
                        room.getRoomCode(),
                        room.getCreatedAt(),
                        room.getExpiresAt(),
                        room.getStatus()))
                .collect(Collectors.toList());

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                roomDTOs,
                user.getRegisteredAt());
    }
}