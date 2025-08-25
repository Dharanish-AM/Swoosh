package com.example.swoosh.dto.room;

import java.util.List;

import com.example.swoosh.dto.file.FileSummaryDTO;
import com.example.swoosh.model.File;
import com.example.swoosh.model.Room;

public class RoomMapper {
        public static RoomResponseDTO toResponseDTO(Room room) {
                List<FileSummaryDTO> fileTransfers = room.getTransfers().stream()
                                .map(transfer -> new FileSummaryDTO(
                                                transfer.getId(),
                                                transfer.getFileName(),
                                                transfer.getFileSize(),
                                                transfer.getFilePath(),
                                                transfer.getSentAt(),
                                                transfer.getStatus()))
                                .toList();

                UserSummaryDTO userSummary = new UserSummaryDTO(
                                room.getUser().getId(),
                                room.getUser().getName(),
                                room.getUser().getEmail());

                return new RoomResponseDTO(
                                room.getId(),
                                room.getRoomCode(),
                                room.getCreatedAt(),
                                room.getExpiresAt(),
                                userSummary,
                                room.getStatus(),
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

        public static RoomSummaryDTO toSummaryDTO(Room room) {
                if (room == null) {
                        return null;
                }

                List<File> files = room.getTransfers().stream().toList();
                List<FileSummaryDTO> fileSummaries = files.stream()
                                .map(file -> new FileSummaryDTO(
                                                file.getId(),
                                                file.getFileName(),
                                                file.getFileSize(),
                                                file.getFilePath(),
                                                file.getSentAt(),
                                                file.getStatus()))
                                .toList();

                return new RoomSummaryDTO(
                                room.getId(),
                                room.getRoomCode(),
                                room.getCreatedAt(),
                                room.getExpiresAt(),
                                room.getStatus(),
                                fileSummaries
                                );
        }
}
