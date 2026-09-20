package com.ten.assessment.controller;

import com.ten.assessment.entity.Test;
import com.ten.assessment.service.TestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "*")
public class TestController {
    private final TestService service;

    public TestController(TestService service) { this.service = service; }

    @GetMapping
    public List<Test> getAll() { return service.getAllTests(); }

    @GetMapping("/{id}")
    public Test getById(@PathVariable String id) { return service.getTestById(id); }

    @PostMapping
    public ResponseEntity<Test> create(@RequestBody Test test) {
        return ResponseEntity.ok(service.createTest(test));
    }

    @PutMapping("/{id}")
    public Test update(@PathVariable String id, @RequestBody Test test) {
        return service.updateTest(id, test);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteTest(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/questions")
    public Test attachQuestions(@PathVariable String id, @RequestBody List<String> questionIds) {
        return service.attachQuestions(id, questionIds);
    }
}
