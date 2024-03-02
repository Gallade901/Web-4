package com.example.backult.auth;


import com.example.backult.repo.TaskRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthenticationController {
    private final AuthenticationService service;
    private final TaskRepo taskRepo;

    @Transactional
    @PostMapping("/save")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ){
        try {
            return ResponseEntity.ok(service.register(request));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", "This username is already taken"
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){

        return ResponseEntity.ok(service.authenticate(request));

    }

}
