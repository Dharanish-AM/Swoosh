package com.example.swoosh.cron;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.swoosh.model.Room;
import com.example.swoosh.repository.RoomRepository;

@Component
public class CronJobService {

    private final RoomRepository roomRepository;

    public CronJobService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Scheduled(fixedRate = 60000)
    public void checkAndExpireRooms() {
        LocalDateTime now = LocalDateTime.now();

        List<Room> activeRooms = roomRepository.findByStatus(Room.RoomStatus.ACTIVE);
        System.out.println("Active rooms: " + activeRooms.stream()
                .map(Room::getId)
                .toList());

        for (Room room : activeRooms) {
            if (room.getExpiresAt() != null && now.isAfter(room.getExpiresAt())) {
                room.setStatus(Room.RoomStatus.EXPIRED);
            }
        }

        roomRepository.saveAll(activeRooms);
    }
}