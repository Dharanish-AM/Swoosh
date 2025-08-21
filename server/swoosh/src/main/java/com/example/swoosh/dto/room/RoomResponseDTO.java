package com.example.swoosh.dto.room;

import java.time.LocalDateTime;
import java.util.List;

import com.example.swoosh.model.FileTransfer;
import com.example.swoosh.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomResponseDTO {
    private Long id;
    private final String roomCode; // pairing code
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private final User user;
    private final List<FileTransfer> transfers;
}
