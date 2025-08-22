package com.example.swoosh.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.swoosh.dto.room.RoomMapper;
import com.example.swoosh.dto.room.RoomResponseDTO;
import com.example.swoosh.exception.ResourceNotFoundException;
import com.example.swoosh.model.Room;
import com.example.swoosh.model.User;
import com.example.swoosh.repository.RoomRepository;
import com.example.swoosh.repository.UserRepository;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    public RoomResponseDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return RoomMapper.toResponseDTO(room);
    }

    public RoomResponseDTO createRoom(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String roomCode = UUID.randomUUID().toString().substring(0, 6);

        LocalDateTime createdAt = LocalDateTime.now();

        LocalDateTime expiresAt = createdAt.plusHours(2);

        Room room = new Room();
        room.setRoomCode(roomCode);
        room.setCreatedAt(createdAt);
        room.setExpiresAt(expiresAt);
        room.setUser(user); // owning side
        room.setTransfers(new ArrayList<>());

        Room savedRoom = roomRepository.save(room); 
        return RoomMapper.toResponseDTO(savedRoom);
    }

    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        roomRepository.delete(room);
    }
}