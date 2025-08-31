package com.example.swoosh.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.swoosh.dto.room.RoomMapper;
import com.example.swoosh.dto.room.RoomRequestDTO;
import com.example.swoosh.dto.room.RoomResponseDTO;
import com.example.swoosh.exception.ResourceNotFoundException;
import com.example.swoosh.model.File;
import com.example.swoosh.model.Room;
import com.example.swoosh.model.User;
import com.example.swoosh.repository.FileRepository;
import com.example.swoosh.repository.RoomRepository;
import com.example.swoosh.repository.UserRepository;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileRepository fileRepository;

    public RoomResponseDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return RoomMapper.toResponseDTO(room);
    }

    public RoomResponseDTO createRoom(RoomRequestDTO request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Room existingRoom = roomRepository.findBySenderIdAndStatus(request.getUserId(), Room.RoomStatus.ACTIVE);
        if (existingRoom != null) {
            return RoomMapper.toResponseDTO(existingRoom);
        }

        String roomCode = UUID.randomUUID().toString().substring(0, 6);

        LocalDateTime createdAt = LocalDateTime.now();

        LocalDateTime expiresAt = createdAt.plusHours(1);

        Room room = new Room();
        room.setRoomCode(roomCode);
        room.setCreatedAt(createdAt);
        room.setExpiresAt(expiresAt);
        room.setSender(user); // owning side
        room.setFiles(new ArrayList<>());
        room.setRoomName(request.getRoomName());
        room.setRoomDescription(request.getRoomDescription());
        room.setMaxReceivers(request.getMaxReceivers());

        Room savedRoom = roomRepository.save(room);
        return RoomMapper.toResponseDTO(savedRoom);
    }

    public RoomResponseDTO joinRoom(Long userId, String roomCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (roomCode == null) {
            throw new IllegalArgumentException("Room code must not be null");
        }

        Room room = roomRepository.findByRoomCode(roomCode);

        if (room == null) {
            throw new ResourceNotFoundException("Room not found with code: " + roomCode);
        }

        if (room.getStatus() != Room.RoomStatus.ACTIVE) {
            throw new IllegalArgumentException("Room is not active");
        }
        Integer maxReceivers = room.getMaxReceivers();
        if (room.getReceivers().size() >= maxReceivers) {
            throw new IllegalArgumentException("Room is full");
        }
        if (room.getReceivers().contains(user)) {
            throw new IllegalArgumentException("User already joined this room");
        } else {
            room.getReceivers().add(user);
            roomRepository.save(room);
            return RoomMapper.toResponseDTO(room);
        }
    }

    public boolean deleteRoom(Long userId, Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));
        if (!room.getSender().getId().equals(userId)) {
            throw new IllegalArgumentException("User is not the owner of the room");
        }
        List<File> files = room.getFiles();
        java.nio.file.Path parentFolder = null;
        if (!files.isEmpty()) {
            String firstFilePath = files.get(0).getFilePath();
            java.nio.file.Path filePathObj = Paths.get(firstFilePath);
            parentFolder = filePathObj.getParent();
        }
        for (File file : files) {
            String filePath = file.getFilePath();
            try {
                Files.deleteIfExists(Paths.get(filePath));
            } catch (IOException | SecurityException e) {
                throw new RuntimeException("Error deleting file: " + filePath, e);
            }
            fileRepository.delete(file);
        }
        if (parentFolder != null) {
            try {
                Files.deleteIfExists(parentFolder);
            } catch (IOException | SecurityException e) {
                throw new RuntimeException("Error deleting parent folder: " + parentFolder, e);
            }
        }
        roomRepository.delete(room);
        return true;
    }

}
