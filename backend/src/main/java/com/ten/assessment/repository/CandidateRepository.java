package com.ten.assessment.repository;

import com.ten.assessment.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, String> {
    Optional<Candidate> findByEmail(String email);
}
