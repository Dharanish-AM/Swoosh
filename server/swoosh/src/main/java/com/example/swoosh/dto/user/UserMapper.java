package com.example.swoosh.dto.user;

import java.util.List;
import java.util.stream.Collectors;

import com.example.swoosh.dto.file.FileSummaryDTO;
import com.example.swoosh.dto.room.RoomSummaryDTO;
import com.example.swoosh.model.User;

public class UserMapper {

        public static User toEntity(UserRequestDTO userDto) {
                User user = new User();
                user.setName(userDto.getName());
                user.setEmail(userDto.getEmail());
                user.setPassword(userDto.getPassword());

                return user;
        }

        public static UserResponseDTO toResponseDTO(User user) {
                List<RoomSummaryDTO> createdRooms = user.getCreatedRooms().stream()
                                .map(roomEach -> {
                                        List<FileSummaryDTO> fileSummaries = roomEach.getFiles().stream()
                                                        .map(file -> new FileSummaryDTO(
                                                                        file.getId(),
                                                                        file.getFileName(),
                                                                        file.getFileSize(),
                                                                        file.getFilePath(),
                                                                        file.getFileType(),
                                                                        file.getSentAt(),
                                                                        file.getStatus()))
                                                        .toList();
                                        List<UserSummaryDTO> receivers = roomEach.getReceivers().stream()
                                                        .map(userCurrent -> new UserSummaryDTO(
                                                                        userCurrent.getId(),
                                                                        userCurrent.getName(),
                                                                        userCurrent.getEmail()))
                                                        .toList();

                                        return new RoomSummaryDTO(
                                                        roomEach.getId(),
                                                        roomEach.getRoomName(),
                                                        roomEach.getRoomDescription(),
                                                        roomEach.getMaxReceivers(),
                                                        roomEach.getRoomCode(),
                                                        new UserSummaryDTO(
                                                                        roomEach.getSender().getId(),
                                                                        roomEach.getSender().getName(),
                                                                        roomEach.getSender().getEmail()),
                                                        receivers,
                                                        roomEach.getCreatedAt(),
                                                        roomEach.getExpiresAt(),
                                                        roomEach.getStatus(),
                                                        fileSummaries);
                                })
                                .collect(Collectors.toList());

                List<RoomSummaryDTO> joinedRooms = user.getJoinedRooms().stream()
                                .map(roomEach -> {
                                        List<FileSummaryDTO> fileSummaries = roomEach.getFiles().stream()
                                                        .map(file -> new FileSummaryDTO(
                                                                        file.getId(),
                                                                        file.getFileName(),
                                                                        file.getFileSize(),
                                                                        file.getFilePath(),
                                                                        file.getFileType(),
                                                                        file.getSentAt(),
                                                                        file.getStatus()))
                                                        .toList();

                                        List<UserSummaryDTO> receivers = roomEach.getReceivers().stream()
                                                        .map(userCurrent -> new UserSummaryDTO(
                                                                        userCurrent.getId(),
                                                                        userCurrent.getName(),
                                                                        userCurrent.getEmail()))
                                                        .toList();

                                        return new RoomSummaryDTO(
                                                        roomEach.getId(),
                                                        roomEach.getRoomName(),
                                                        roomEach.getRoomDescription(),
                                                        roomEach.getMaxReceivers(),
                                                        roomEach.getRoomCode(),
                                                        new UserSummaryDTO(
                                                                        roomEach.getSender().getId(),
                                                                        roomEach.getSender().getName(),
                                                                        roomEach.getSender().getEmail()),
                                                        receivers,
                                                        roomEach.getCreatedAt(),
                                                        roomEach.getExpiresAt(),
                                                        roomEach.getStatus(),
                                                        fileSummaries);
                                })
                                .collect(Collectors.toList());

                return new UserResponseDTO(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                createdRooms,
                                joinedRooms,
                                user.getRegisteredAt());
        }
}