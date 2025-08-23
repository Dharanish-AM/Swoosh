package com.example.swoosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.swoosh.model.File;

public interface FileRepository extends JpaRepository<File, Long> {
}