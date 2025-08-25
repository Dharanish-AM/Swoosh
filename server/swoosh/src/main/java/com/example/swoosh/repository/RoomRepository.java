package com.example.swoosh.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.swoosh.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomCode(String roomCode);

    List<Room> findByStatus(Room.RoomStatus status);

    Room findBySenderIdAndStatus(Long senderId, Room.RoomStatus status);
}