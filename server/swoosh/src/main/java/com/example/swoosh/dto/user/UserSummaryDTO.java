package com.example.swoosh.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSummaryDTO {
    private final Long id;
    private final String name;
    private final String email;
}