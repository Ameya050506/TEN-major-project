package com.ten.assessment.repository;

import com.ten.assessment.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestRepository extends JpaRepository<Test, String> {}
