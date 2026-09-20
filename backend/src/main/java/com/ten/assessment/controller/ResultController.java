package com.ten.assessment.controller;

import com.ten.assessment.dto.SubmitResultRequest;
import com.ten.assessment.entity.Result;
import com.ten.assessment.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {
    private final ResultService service;

    public ResultController(ResultService service) { this.service = service; }

    @GetMapping
    public List<Result> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Result getById(@PathVariable String id) { return service.getById(id); }

    @GetMapping("/candidate/{candidateId}")
    public List<Result> byCandidate(@PathVariable String candidateId) {
        return service.getByCandidate(candidateId);
    }

    @GetMapping("/test/{testId}")
    public List<Result> byTest(@PathVariable String testId) {
        return service.getByTest(testId);
    }

    @PostMapping("/submit")
    public ResponseEntity<Result> submit(@RequestBody SubmitResultRequest request) {
        return ResponseEntity.ok(service.submit(request));
    }
}
