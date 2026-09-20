package com.ten.assessment.repository;

import com.ten.assessment.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, String> {
    List<Question> findByIdIn(Collection<String> ids);
}
