package com.example.swoosh.dto.room;

import java.time.LocalDateTime;

import com.example.swoosh.model.Room;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomSummaryDTO {
    private final Long id;
    private final String roomCode;
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private final Room.RoomStatus status;
}