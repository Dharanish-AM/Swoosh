package com.example.swoosh.dto.room;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.swoosh.model.File;
import com.example.swoosh.model.Room;
import com.example.swoosh.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomRequestDTO {
    private Long id;
    private String roomCode;
    private User sender;
    private LocalDateTime createdAt;
    private final Room.RoomStatus status;
    private LocalDateTime expiresAt;
    private List<File> files = new ArrayList<>();

}
