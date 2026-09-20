package com.ten.assessment.service;

import com.ten.assessment.entity.Candidate;
import com.ten.assessment.repository.CandidateRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CandidateService {
    private final CandidateRepository repository;

    public CandidateService(CandidateRepository repository) {
        this.repository = repository;
    }

    public List<Candidate> getAll() {
        return repository.findAll();
    }

    public Candidate getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
    }

    public Candidate create(Candidate candidate) {
        if (candidate.getId() == null || candidate.getId().isBlank()) {
            candidate.setId("cand-" + System.currentTimeMillis());
        }
        if (candidate.getRegisteredAt() == null) candidate.setRegisteredAt(LocalDate.now());
        if (candidate.getStatus() == null) candidate.setStatus("Active");
        if (candidate.getTestsCompleted() == null) candidate.setTestsCompleted(0);
        if (candidate.getAvgScore() == null) candidate.setAvgScore(0.0);
        return repository.save(candidate);
    }

    public Candidate update(String id, Candidate updated) {
        Candidate existing = getById(id);
        existing.setFullName(updated.getFullName());
        existing.setEmail(updated.getEmail());
        existing.setRole(updated.getRole());
        existing.setOrganization(updated.getOrganization());
        existing.setDesignation(updated.getDesignation());
        existing.setPhone(updated.getPhone());
        existing.setStatus(updated.getStatus());
        return repository.save(existing);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) throw new RuntimeException("Candidate not found");
        repository.deleteById(id);
    }
}
