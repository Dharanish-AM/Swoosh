package com.example.swoosh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SwooshApplication {

	public static void main(String[] args) {
		SpringApplication.run(SwooshApplication.class, args);
	}

}
