package com.example.swoosh.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.swoosh.exception.EmailAlreadyExistsException;
import com.example.swoosh.model.User;
import com.example.swoosh.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        System.out.println("name: " + user.getName() +
                ", email: " + user.getEmail() +
                ", password: " + user.getPassword());
        String email = user.getEmail();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        String password = user.getPassword();
        String encodedPassword = new BCryptPasswordEncoder().encode(password);
        user.setHashPassword(encodedPassword);
        user.setRegisteredAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User doesn't exist"));
        user.setHashPassword(null);
        return user;
    }
}
