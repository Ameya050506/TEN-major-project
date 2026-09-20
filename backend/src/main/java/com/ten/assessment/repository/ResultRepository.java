package com.ten.assessment.repository;

import com.ten.assessment.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResultRepository extends JpaRepository<Result, String> {
    List<Result> findByCandidateId(String candidateId);
    List<Result> findByTestId(String testId);
}
