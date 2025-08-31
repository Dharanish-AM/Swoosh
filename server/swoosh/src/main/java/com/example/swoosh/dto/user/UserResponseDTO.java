package com.example.swoosh.dto.user;

import java.time.LocalDateTime;
import java.util.List;

import com.example.swoosh.dto.room.RoomSummaryDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@SuppressWarnings("unused")
@AllArgsConstructor
@Data
public class UserResponseDTO {
    private final Long id;
    private final String name;
    private final String email;
    private final List<RoomSummaryDTO> createdRooms;
    private final List<RoomSummaryDTO> joinedRooms;
    private final LocalDateTime registeredAt;
}


