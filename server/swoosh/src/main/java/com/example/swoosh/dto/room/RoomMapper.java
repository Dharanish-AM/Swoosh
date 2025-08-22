package com.example.swoosh.dto.room;

import java.util.List;

import com.example.swoosh.model.Room;

public class RoomMapper {
    public static RoomResponseDTO toResponseDTO(Room room) {
        List<FileTransferSummaryDTO> fileTransfers = room.getTransfers().stream()
                .map(transfer -> new FileTransferSummaryDTO(
                        transfer.getId(),
                        transfer.getFileName(),
                        transfer.getFileSize(),
                        transfer.getSentAt(),
                        transfer.getStatus()))
                .toList();

        return new RoomResponseDTO(
                room.getId(),
                room.getRoomCode(),
                room.getCreatedAt(),
                room.getExpiresAt(),
                room.getUser(),
                fileTransfers);
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
