package com.example.swoosh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.swoosh.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(Room.RoomStatus status);

    Room findBySenderIdAndStatus(Long senderId, Room.RoomStatus status);

    Room findByRoomCode(String roomCode);
}