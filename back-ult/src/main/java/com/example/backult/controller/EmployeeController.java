package com.example.backult.controller;

import com.example.backult.config.JwtService;
import com.example.backult.entity.*;
import com.example.backult.repo.TaskRepo;

import com.example.backult.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeeController {
    private final TaskRepo taskRepo;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @GetMapping("/")
    public ResponseEntity gg () {
        return ResponseEntity.ok("Welcome");
    }

    @PostMapping("/task")
    public ResponseEntity task(@RequestHeader("Authorization") String header, @RequestBody Task task) {
        String username = getUsername(header);
        if (userRepository.findByName(username).isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        double x = Double.parseDouble(task.getX());
        double y = Double.parseDouble(task.getY());
        double r = Double.parseDouble(task.getR());
        String ans = checkArea(x, y, r);
        ResponseTask responseTask = new ResponseTask(task.getX(), task.getY(), task.getR(), ans);
        TaskBD tsBd = new TaskBD(task.getX(), task.getY(), task.getR(), ans, username);
        taskRepo.save(tsBd);
        return ResponseEntity.ok(responseTask);
    }
    @GetMapping("/getTask")
    public ResponseEntity<String> getShots(
            @RequestHeader("Authorization") String header
    ) throws JsonProcessingException {
        String username = getUsername(header);
        if (userRepository.findByName(username).isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        List<TaskBD> TsBd = taskRepo.findAllByName(username);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(TsBd);
        return ResponseEntity.ok(json);
    }
    @DeleteMapping()
    @Transactional
    public ResponseEntity<?> clearShots(
            @RequestHeader("Authorization") String header
    ) {
        String username = getUsername(header);
        if (userRepository.findByName(username).isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        taskRepo.deleteTaskBDByName(username);
        return ResponseEntity.noContent().build();

    }

    public String checkArea(double x,double y,double r) {
        if ((x <= 0 && y >= 0 && y <= r && x >= -r) ||
                ((x * x + y * y <= r * r) && x <= 0 && y <= 0) ||
                ((x - r / 2 <= y) && x >= 0 && y <= 0)) {
            return "Попадание";
        } else {
            return "Промах";
        }
    }
    private String getUsername(String header) {
        String jwt = header.substring(7);
        String username = jwtService.extractUsername(jwt);
        return username;
    }

}
