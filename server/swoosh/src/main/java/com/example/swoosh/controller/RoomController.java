package com.example.swoosh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.swoosh.dto.room.RoomResponseDTO;
import com.example.swoosh.service.RoomService;

@RestController
@RequestMapping("/api/room")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping("/{id}")
    public RoomResponseDTO getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    @PostMapping
    public RoomResponseDTO createRoom(@RequestParam Long userId) {
        return roomService.createRoom(userId);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteRoom(@RequestParam Long userId, @RequestParam Long roomId) {
        boolean res = roomService.deleteRoom(userId, roomId);
        if (res) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
