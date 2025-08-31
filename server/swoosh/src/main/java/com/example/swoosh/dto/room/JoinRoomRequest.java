package com.example.swoosh.dto.room;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JoinRoomRequest {
    private Long userId;
    private String roomCode;

}
