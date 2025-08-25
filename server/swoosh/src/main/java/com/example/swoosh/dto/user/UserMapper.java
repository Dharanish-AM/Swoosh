package com.example.swoosh.dto.user;

import java.util.List;
import java.util.stream.Collectors;

import com.example.swoosh.dto.file.FileSummaryDTO;
import com.example.swoosh.dto.room.RoomSummaryDTO;
import com.example.swoosh.model.File;
import com.example.swoosh.model.Room;
import com.example.swoosh.model.User;

public class UserMapper {

    public static User toEntity(UserRequestDTO userDto) {
        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setHashPassword(userDto.getPassword());

        return user;
    }

    public static UserResponseDTO toResponseDTO(User user) {
        Room room = new Room();
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
        List<RoomSummaryDTO> roomDTOs = user.getRooms().stream()
                .map(roomEach -> (RoomSummaryDTO) new RoomSummaryDTO(
                        roomEach.getId(),
                        roomEach.getRoomCode(),
                        roomEach.getCreatedAt(),
                        roomEach.getExpiresAt(),
                        roomEach.getStatus(),
                        fileSummaries))
                .collect(Collectors.toList());

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                roomDTOs,
                user.getRegisteredAt());
    }
}