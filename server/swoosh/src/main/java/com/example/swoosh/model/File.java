package com.example.swoosh.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@SuppressWarnings("unused")
@Table(name="files")
@Data
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;
    private long fileSize;
    private LocalDateTime sentAt;

    @Column(nullable = false)
    private FileStatus status;

    private String fileType;
    private String filePath;

    // relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    public static enum FileStatus {
        FAILED,
        CANCELED,
        PENDING,
        IN_PROGRESS,
        COMPLETED
    }
}