package com.example.swoosh.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.swoosh.dto.auth.AuthRequestDTO;
import com.example.swoosh.dto.auth.AuthResponseDTO;
import com.example.swoosh.dto.user.UserMapper;
import com.example.swoosh.dto.user.UserRequestDTO;
import com.example.swoosh.dto.user.UserResponseDTO;
import com.example.swoosh.exception.EmailAlreadyExistsException;
import com.example.swoosh.model.User;
import com.example.swoosh.repository.UserRepository;
import com.example.swoosh.security.JwtService;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    public AuthResponseDTO login(AuthRequestDTO loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // use auth manager
        Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        System.out.println("User logged in: " + userDetails);

        String token = jwtService.generateToken(userDetails);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setUser(UserMapper.toResponseDTO(
                userRepository.findByEmail(userDetails.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found"))));
        response.setToken(token);
        return response;
    }

    public void signup(UserRequestDTO user) {
        User newUser = UserMapper.toEntity(user);
        System.out.println("name: " + newUser.getName() +
                ", email: " + newUser.getEmail() +
                ", password: " + newUser.getPassword());
        String email = newUser.getEmail();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        String password = newUser.getPassword();
        String encodedPassword = passwordEncoder.encode(password);
        newUser.setHashPassword(encodedPassword);
        newUser.setRegisteredAt(LocalDateTime.now());
        userRepository.save(newUser);
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User doesn't exist"));

        UserResponseDTO response = UserMapper.toResponseDTO(user);
        return response;
    }
}
