package com.example.swoosh.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password; // hashed password
    private LocalDateTime registeredAt;

    // Rooms created by this user
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Room> createdRooms = new ArrayList<>();

    // Rooms this user has joined
    @ManyToMany(mappedBy = "receivers", fetch = FetchType.LAZY)
    private List<Room> joinedRooms = new ArrayList<>();

    // Helper methods
    public void addCreatedRoom(Room room) {
        this.createdRooms.add(room);
        room.setSender(this);
    }

    public void joinRoom(Room room) {
        this.joinedRooms.add(room);
        room.getReceivers().add(this);
    }
}