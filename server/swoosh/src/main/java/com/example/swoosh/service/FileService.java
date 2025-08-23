package com.example.swoosh.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.swoosh.dto.filetransfer.FileRequestDTO;
import com.example.swoosh.dto.filetransfer.FileResponseDTO;
import com.example.swoosh.dto.room.RoomMapper;
import com.example.swoosh.dto.room.RoomSummaryDTO;
import com.example.swoosh.model.File;
import com.example.swoosh.model.Room;
import com.example.swoosh.repository.FileRepository;

@Service
public class FileService {
    @Autowired
    private FileRepository fileTransferRepository;

    public FileResponseDTO getFileTransferById(Long id) {
        return null;
    }

    public FileResponseDTO createFileTransfer(FileRequestDTO fileTransferDTO) {
        MultipartFile multipartFile = fileTransferDTO.getFile();
        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("File must not be null or empty");
        }
        String roomId = String.valueOf(fileTransferDTO.getRoom().getId());
        String uploadDir = "uploads/" + roomId;
        Path uploadPath = Paths.get(uploadDir);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String originalFilename = multipartFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(originalFilename);
            Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            File fileEntity = new File();
            fileEntity.setFileName(originalFilename);
            fileEntity.setFileSize(multipartFile.getSize());
            fileEntity.setSentAt(LocalDateTime.now());
            fileEntity.setStatus("SENT");
            fileEntity.setFilePath(filePath.toString());
            Room room = RoomMapper.toEntity(fileTransferDTO.getRoom());
            fileEntity.setRoom(room);

            File savedFile = fileTransferRepository.save(fileEntity);

            FileResponseDTO responseDTO = new FileResponseDTO(
                    savedFile.getId(),
                    savedFile.getFileName(),
                    savedFile.getFileSize(),
                    savedFile.getFilePath(),
                    savedFile.getSentAt(),
                    savedFile.getStatus(),
                    RoomMapper.toSummaryDTO(savedFile.getRoom()));
            return responseDTO;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage(), e);
        }
    }
}
