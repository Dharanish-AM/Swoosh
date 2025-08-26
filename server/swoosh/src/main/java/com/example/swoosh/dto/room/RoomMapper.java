package com.example.swoosh.dto.room;

import java.util.List;

import com.example.swoosh.dto.file.FileSummaryDTO;
import com.example.swoosh.model.File;
import com.example.swoosh.model.Room;

public class RoomMapper {
        public static RoomResponseDTO toResponseDTO(Room room) {
                List<FileSummaryDTO> fileTransfers = room.getFiles().stream()
                                .map(transfer -> new FileSummaryDTO(
                                                transfer.getId(),
                                                transfer.getFileName(),
                                                transfer.getFileSize(),
                                                transfer.getFilePath(),
                                                transfer.getFileType(),
                                                transfer.getSentAt(),
                                                transfer.getStatus()))
                                .toList();

                UserSummaryDTO sender = new UserSummaryDTO(
                                room.getSender().getId(),
                                room.getSender().getName(),
                                room.getSender().getEmail());
                                
                List<UserSummaryDTO> receivers = room.getReceivers().stream()
                                .map(user -> new UserSummaryDTO(
                                        user.getId(),
                                        user.getName(),
                                        user.getEmail()))
                                .toList();

                return new RoomResponseDTO(
                                room.getId(),
                                room.getRoomCode(),
                                room.getCreatedAt(),
                                room.getExpiresAt(),
                                sender,
                                receivers,
                                room.getStatus(),
                                fileTransfers);
        }

        public static Room toEntity(RoomRequestDTO roomRequestDTO) {
                Room room = new Room();
                room.setRoomCode(roomRequestDTO.getRoomCode());
                room.setSender(roomRequestDTO.getSender());
                room.setCreatedAt(roomRequestDTO.getCreatedAt());
                room.setExpiresAt(roomRequestDTO.getExpiresAt());
                room.setFiles(roomRequestDTO.getFiles());
                return room;
        }

        public static RoomSummaryDTO toSummaryDTO(Room room) {
                if (room == null) {
                        return null;
                }

                List<File> files = room.getFiles().stream().toList();
                List<FileSummaryDTO> fileSummaries = files.stream()
                                .map(file -> new FileSummaryDTO(
                                                file.getId(),
                                                file.getFileName(),
                                                file.getFileSize(),
                                                file.getFilePath(),
                                                file.getFileType(),
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
