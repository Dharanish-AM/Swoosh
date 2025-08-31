package com.example.swoosh.dto.room;

import java.time.LocalDateTime;
import java.util.List;

import com.example.swoosh.dto.file.FileSummaryDTO;
import com.example.swoosh.dto.user.UserSummaryDTO;
import com.example.swoosh.model.Room;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomResponseDTO {
    private Long id;
    private String roomName;
    private String roomDescription;
    private Integer maxReceivers;
    private final String roomCode;
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private final UserSummaryDTO sender;
    private final List<UserSummaryDTO> receivers;
    private final Room.RoomStatus status;
    private final List<FileSummaryDTO> files;
}

