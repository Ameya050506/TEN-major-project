package com.ten.assessment.controller;

import com.ten.assessment.entity.Candidate;
import com.ten.assessment.service.CandidateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {
    private final CandidateService service;

    public CandidateController(CandidateService service) { this.service = service; }

    @GetMapping
    public List<Candidate> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Candidate getById(@PathVariable String id) { return service.getById(id); }

    @PostMapping
    public ResponseEntity<Candidate> create(@RequestBody Candidate candidate) {
        return ResponseEntity.ok(service.create(candidate));
    }

    @PutMapping("/{id}")
    public Candidate update(@PathVariable String id, @RequestBody Candidate candidate) {
        return service.update(id, candidate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
