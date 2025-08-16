package com.example.swoosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.swoosh.model.FileTransfer;

public interface FileTransferRepository extends JpaRepository<FileTransfer, Long> {
}