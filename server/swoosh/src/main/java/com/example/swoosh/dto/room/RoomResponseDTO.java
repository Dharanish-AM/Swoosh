package com.example.swoosh.dto.room;

import java.time.LocalDateTime;
import java.util.List;

import com.example.swoosh.dto.file.FileSummaryDTO;
import com.example.swoosh.model.Room;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomResponseDTO {
    private Long id;
    private final String roomCode; 
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private final UserSummaryDTO user;
    private final Room.RoomStatus status;
    private final List<FileSummaryDTO> files;
}

@Data
@AllArgsConstructor
class UserSummaryDTO {
    private final Long id;
    private final String name;
    private final String email;
}