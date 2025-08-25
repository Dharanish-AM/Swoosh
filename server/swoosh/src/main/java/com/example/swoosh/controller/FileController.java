package com.example.swoosh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.swoosh.dto.file.FileRequestDTO;
import com.example.swoosh.dto.file.FileResponseDTO;
import com.example.swoosh.service.FileService;


@RestController
@RequestMapping("/api/file")
public class FileController {
    @Autowired
    private FileService fileTransferService;

    @GetMapping
    public FileResponseDTO getFileTransferById(@RequestParam Long senderId,@RequestParam Long roomId, @RequestParam Long fileId) {
        return fileTransferService.getFileTransferById(senderId, roomId, fileId);
    }

    @PostMapping
    public FileResponseDTO sendFile(FileRequestDTO fileTransferDTO, @RequestParam Long senderId, @RequestParam Long roomId) {
        return fileTransferService.sendFile(fileTransferDTO, senderId, roomId);
    }

    @GetMapping("/serve")
    public ResponseEntity<Resource> serveFile(
            @RequestParam Long senderId,
            @RequestParam Long roomId,
            @RequestParam Long fileId) {

        return fileTransferService.serveFile(senderId, roomId, fileId);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteFile(@RequestParam Long senderId, @RequestParam Long roomId, @RequestParam Long fileId) {
        try {
            boolean deleted = fileTransferService.deleteFileTransfer(senderId, roomId, fileId);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
