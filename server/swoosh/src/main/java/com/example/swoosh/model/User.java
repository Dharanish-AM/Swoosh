package com.example.swoosh.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; 
    private String email;

    @Column(unique = true)
    private String deviceId; // Unique per device (UUID)

    private String publicKey; // For encryption
    private LocalDateTime registeredAt;

    @OneToMany(mappedBy = "sender")
    private List<FileTransfer> sentTransfers;

    @OneToMany(mappedBy = "receiver")
    private List<FileTransfer> receivedTransfers;
}