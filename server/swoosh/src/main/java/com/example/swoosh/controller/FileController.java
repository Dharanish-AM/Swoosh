package com.example.swoosh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.swoosh.dto.file.FileRequestDTO;
import com.example.swoosh.dto.file.FileResponseDTO;
import com.example.swoosh.service.FileService;

@RestController
@RequestMapping("/api/file")
public class FileController {
    @Autowired
    private FileService fileTransferService;

    public FileResponseDTO getFileTransferById(Long id) {
        return fileTransferService.getFileTransferById(id);
    }

    public FileResponseDTO sendFile(FileRequestDTO fileTransferDTO) {
        return fileTransferService.sendFile(fileTransferDTO);
    }

    public void deleteFile(Long id) {
        fileTransferService.deleteFileTransfer(id);
    }
}
