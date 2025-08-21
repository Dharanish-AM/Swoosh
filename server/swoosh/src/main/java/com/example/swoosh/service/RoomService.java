package com.example.swoosh.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.swoosh.dto.room.RoomMapper;
import com.example.swoosh.dto.room.RoomRequestDTO;
import com.example.swoosh.dto.room.RoomResponseDTO;
import com.example.swoosh.exception.ResourceNotFoundException;
import com.example.swoosh.model.Room;
import com.example.swoosh.repository.RoomRepository;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public RoomResponseDTO getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }

    public RoomResponseDTO createRoom(RoomRequestDTO room) {
        RoomMapper savedRoom = RoomMapper.
        return new RoomResponseDTO(savedRoom);
    }

    public void deleteRoom(Long id) {
        Room room = getRoomById(id);
        roomRepository.delete(room);
    }
}