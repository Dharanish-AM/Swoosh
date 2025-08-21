package com.example.swoosh.dto.room;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.swoosh.model.FileTransfer;
import com.example.swoosh.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomRequestDTO {
    private Long id;
    private String roomCode;
    private User user;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private List<FileTransfer> transfers = new ArrayList<>();

}
