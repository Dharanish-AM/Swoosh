package com.example.swoosh.dto.room;

import com.example.swoosh.model.Room;

public class RoomMapper {
    public static RoomResponseDTO toResponseDTO(Room room) {
        return new RoomResponseDTO(
                room.getId(),
                room.getRoomCode(),
                room.getCreatedAt(),
                room.getExpiresAt(),
                room.getUser(),
                room.getTransfers()
        );
    }

    public static Room toEntity(RoomRequestDTO roomRequestDTO) {
        Room room = new Room();
        room.setRoomCode(roomRequestDTO.getRoomCode());
        room.setUser(roomRequestDTO.getUser());
        room.setCreatedAt(roomRequestDTO.getCreatedAt());
        room.setExpiresAt(roomRequestDTO.getExpiresAt());
        room.setTransfers(roomRequestDTO.getTransfers());
        return room;
    }

}
