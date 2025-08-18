package com.example.swoosh.controller;

import com.example.swoosh.service.RoomService;
import com.example.swoosh.dto.RoomRequestDTO;
import com.example.swoosh.dto.RoomResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public RoomResponseDTO createRoom(@RequestBody RoomRequestDTO roomRequestDTO) {
        return roomService.createRoom(roomRequestDTO);
    }

    @GetMapping("/{id}")
    public RoomResponseDTO getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    @GetMapping
    public List<RoomResponseDTO> getAllRooms() {
        return roomService.getAllRooms();
    }
}
