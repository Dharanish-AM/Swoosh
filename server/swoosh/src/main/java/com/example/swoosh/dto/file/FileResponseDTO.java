package com.example.swoosh.dto.file;

import java.time.LocalDateTime;

import com.example.swoosh.dto.room.RoomSummaryDTO;
import com.example.swoosh.model.File;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileResponseDTO {
    private Long id;
    private String fileName;
    private Long fileSize;
    private String filePath;
    private LocalDateTime sentAt;
    private File.FileStatus status;
    private RoomSummaryDTO room;
}
 