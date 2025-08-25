package com.example.swoosh.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.swoosh.dto.file.FileRequestDTO;
import com.example.swoosh.dto.file.FileResponseDTO;
import com.example.swoosh.model.File;
import com.example.swoosh.model.Room;
import com.example.swoosh.model.User;
import com.example.swoosh.repository.FileRepository;
import com.example.swoosh.repository.RoomRepository;
import com.example.swoosh.repository.UserRepository;

@Service
public class FileService {
    @Autowired
    private FileRepository fileTransferRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    public FileResponseDTO getFileTransferById(Long senderId, Long roomId, Long fileId) {
        if (senderId == null || roomId == null || fileId == null) {
            throw new IllegalArgumentException("User ID, Room ID, and File ID must not be null");
        }
        return fileTransferRepository.findById(fileId)
                .map(file -> {
                    if (!file.getRoom().getId().equals(roomId)) {
                        throw new IllegalArgumentException("File does not belong to the specified room");
                    }
                    return new FileResponseDTO(
                            file.getId(),
                            file.getFileName(),
                            file.getFileSize(),
                            file.getFilePath(),
                            file.getFileType(),
                            file.getSentAt(),
                            file.getStatus(),
                            file.getRoom().getId());
                })
                .orElseThrow(() -> new IllegalArgumentException("Invalid file ID or File not found"));
    }

    @SuppressWarnings("unused")
    public FileResponseDTO sendFile(FileRequestDTO fileTransferDTO, Long senderId, Long roomId) {
        if (senderId == null || roomId == null) {
            throw new IllegalArgumentException("Sender ID and Room ID must not be null");
        }

        User user = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID or User not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID or Room not found"));

        MultipartFile multipartFile = fileTransferDTO.getFile();
        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("File must not be null or empty");
        }
        String uploadDir = "uploads/" + "user" + senderId.toString() + "/" + "room" + roomId.toString();
        Path uploadPath = Paths.get(uploadDir);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String originalFilename = multipartFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(originalFilename);
            Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Room current_room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid room ID or Room not found"));

            if (current_room.getStatus() == Room.RoomStatus.EXPIRED
                    || current_room.getExpiresAt().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Room is no longer active");
            }

            File fileEntity = new File();
            fileEntity.setFileName(originalFilename);
            fileEntity.setFileSize(multipartFile.getSize());
            fileEntity.setSentAt(LocalDateTime.now());
            fileEntity.setStatus(File.FileStatus.COMPLETED);
            fileEntity.setFilePath(filePath.toString());
            fileEntity.setFileType(multipartFile.getContentType());
            fileEntity.setRoom(room);

            File savedFile = fileTransferRepository.save(fileEntity);

            FileResponseDTO responseDTO = new FileResponseDTO(
                    savedFile.getId(),
                    savedFile.getFileName(),
                    savedFile.getFileSize(),
                    savedFile.getFilePath(),
                    savedFile.getFileType(),
                    savedFile.getSentAt(),
                    savedFile.getStatus(),
                    savedFile.getRoom().getId());
            return responseDTO;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage(), e);
        }
    }

    public ResponseEntity<Resource> serveFile(Long senderId, Long roomId, Long fileId) {
        try {
            File file = fileTransferRepository.findById(fileId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid file ID or File not found"));
            String fileName = file.getFileName();
            Path filePath = Paths.get("uploads/" + "user" + senderId + "/" + "room" + roomId).resolve(file.getFileName());
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(filePath);

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (IOException e) {
            throw new RuntimeException("Could not serve file: " + e.getMessage(), e);
        }
    }

    public boolean deleteFileTransfer(Long userId, Long roomId, Long fileId) {
        if (userId == null || roomId == null || fileId == null) {
            throw new IllegalArgumentException("User ID, Room ID, and File ID must not be null");
        }
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID or Room not found"));

        if (!room.getSender().getId().equals(userId)) {
            throw new IllegalArgumentException("User is not the owner of the room");
        }

        File file = fileTransferRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid file ID or File not found"));

        Path path = Paths.get(file.getFilePath()).toAbsolutePath();
        System.out.println("Deleting file at: " + path);
        System.out.println("File exists: " + Files.exists(path));

        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + e.getMessage(), e);
        }

        fileTransferRepository.delete(file);
        return true;
    }

}
