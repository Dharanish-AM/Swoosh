package com.example.swoosh.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.swoosh.dto.user.UserMapper;
import com.example.swoosh.dto.user.UserRequestDTO;
import com.example.swoosh.dto.user.UserResponseDTO;
import com.example.swoosh.exception.EmailAlreadyExistsException;
import com.example.swoosh.model.User;
import com.example.swoosh.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserResponseDTO createUser(UserRequestDTO user) {
        User newUser = UserMapper.toEntity(user);
        System.out.println("name: " + newUser.getName() +
                ", email: " + newUser.getEmail() +
                ", password: " + newUser.getPassword());
        String email = newUser.getEmail();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        String password = newUser.getPassword();
        String encodedPassword = new BCryptPasswordEncoder().encode(password);
        newUser.setHashPassword(encodedPassword);
        newUser.setRegisteredAt(LocalDateTime.now());
        userRepository.save(newUser);
        UserResponseDTO response = UserMapper.toResponseDTO(newUser);
        return response;
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User doesn't exist"));

        UserResponseDTO response = UserMapper.toResponseDTO(user);
        return response;
    }
}
