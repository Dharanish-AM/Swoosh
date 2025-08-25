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

import com.example.swoosh.dto.file.FileRequestDTO;
import com.example.swoosh.dto.file.FileResponseDTO;
import com.example.swoosh.dto.room.RoomMapper;
import com.example.swoosh.model.File;
import com.example.swoosh.model.Room;
import com.example.swoosh.repository.FileRepository;
import com.example.swoosh.repository.RoomRepository;

@Service
public class FileService {
    @Autowired
    private FileRepository fileTransferRepository;

    @Autowired
    private RoomRepository roomRepository;

    public FileResponseDTO getFileTransferById(Long id) {
        return null;
    }

    public FileResponseDTO sendFile(FileRequestDTO fileTransferDTO, Long userId, Long roomId) {

        MultipartFile multipartFile = fileTransferDTO.getFile();
        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("File must not be null or empty");
        }
        Long roomId = fileTransferDTO.getRoom().getId();
        String uploadDir = "uploads/" + roomId.toString();
        Path uploadPath = Paths.get(uploadDir);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String originalFilename = multipartFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(originalFilename);
            Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));

            File fileEntity = new File();
            fileEntity.setFileName(originalFilename);
            fileEntity.setFileSize(multipartFile.getSize());
            fileEntity.setSentAt(LocalDateTime.now());
            fileEntity.setStatus(File.FileStatus.COMPLETED);
            fileEntity.setFilePath(filePath.toString());
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

    public void deleteFileTransfer(Long id) {
        fileTransferRepository.deleteById(id);
    }

}
