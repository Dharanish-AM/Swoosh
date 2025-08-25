package com.example.swoosh.dto.file;

import java.time.LocalDateTime;

import com.example.swoosh.model.File;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileSummaryDTO {
    private Long id;
    private String fileName;
    private Long fileSize;
    private String filePath;
    private LocalDateTime sentAt;
    private File.FileStatus status;
}