package com.example.swoosh.dto.filetransfer;

import java.time.LocalDateTime;

import com.example.swoosh.dto.room.RoomSummaryDTO;

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
    private String status;
    private RoomSummaryDTO room;
}
 