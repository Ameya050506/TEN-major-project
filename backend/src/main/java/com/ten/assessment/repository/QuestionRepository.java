package com.ten.assessment.repository;

import com.ten.assessment.entity.Question;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, String> {
    @EntityGraph(attributePaths = { "options" })
    List<Question> findByIdIn(Collection<String> ids);

    @EntityGraph(attributePaths = { "options" })
    @Override
    List<Question> findAll();

    @EntityGraph(attributePaths = { "options" })
    @Override
    Optional<Question> findById(String id);
}
