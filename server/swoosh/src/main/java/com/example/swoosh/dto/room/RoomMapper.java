package com.example.swoosh.dto.room;

import java.util.List;

import com.example.swoosh.dto.room.RoomSummaryDTO;

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

                public static Room toEntity(RoomSummaryDTO roomRequestDTO) {
                        Room room = new Room();
                        room.setId(roomRequestDTO.getId());
                        room.setRoomCode(roomRequestDTO.getRoomCode());
                        room.setCreatedAt(roomRequestDTO.getCreatedAt());
                        room.setExpiresAt(roomRequestDTO.getExpiresAt());
                        room.setStatus(roomRequestDTO.getStatus());
                        return room;
                }

                public static RoomSummaryDTO toSummaryDTO(Room room) {
                        return new RoomSummaryDTO(
                                room.getId(),
                                room.getRoomCode(),
                                room.getCreatedAt(),
                                room.getExpiresAt(),
                                room.getStatus()
                        );
                }
        }
