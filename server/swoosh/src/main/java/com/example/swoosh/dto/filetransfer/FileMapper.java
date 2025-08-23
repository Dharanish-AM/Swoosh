package com.example.swoosh.dto.filetransfer;

import com.example.swoosh.dto.room.RoomMapper;
import com.example.swoosh.model.File;

public class FileMapper {
    public static FileResponseDTO toResponseDTO(File fileTransfer) {
        if (fileTransfer == null) {
            return null;
        }

        return new FileResponseDTO(
                fileTransfer.getId(),
                fileTransfer.getFileName(),
                fileTransfer.getFileSize(),
                fileTransfer.getFilePath(),
                fileTransfer.getSentAt(),
                fileTransfer.getStatus(),
                RoomMapper.toSummaryDTO(fileTransfer.getRoom())
                
        );
    }

    public static File toEntity(FileRequestDTO requestDTO) {
        if (requestDTO == null) {
            return null;
        }
        File fileTransfer = new File();
        fileTransfer.setFileName(requestDTO.getFileName());
        fileTransfer.setFileSize(requestDTO.getFileSize());
        fileTransfer.setSentAt(requestDTO.getSentAt());
        fileTransfer.setStatus(requestDTO.getStatus());
        return fileTransfer;
    }
}
