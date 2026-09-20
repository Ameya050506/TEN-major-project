package com.ten.assessment.service;

import com.ten.assessment.entity.Question;
import com.ten.assessment.entity.Test;
import com.ten.assessment.repository.QuestionRepository;
import com.ten.assessment.repository.TestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TestService {
    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;

    public TestService(TestRepository testRepository, QuestionRepository questionRepository) {
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
    }

    public List<Test> getAllTests() {
        return testRepository.findAll();
    }

    public Test getTestById(String id) {
        return testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
    }

    public Test createTest(Test test) {
        if (test.getId() == null || test.getId().isBlank()) {
            test.setId("test-" + System.currentTimeMillis());
        }
        if (test.getTotalAttempts() == null) test.setTotalAttempts(0);
        if (test.getCreatedAt() == null) test.setCreatedAt(LocalDate.now());
        if (test.getStatus() == null) test.setStatus("Active");
        return testRepository.save(test);
    }

    public Test updateTest(String id, Test updated) {
        Test existing = getTestById(id);

        existing.setTitle(updated.getTitle());
        existing.setCategory(updated.getCategory());
        existing.setDifficulty(updated.getDifficulty());
        existing.setDescription(updated.getDescription());
        existing.setDurationMinutes(updated.getDurationMinutes());
        existing.setTotalMarks(updated.getTotalMarks());
        existing.setPassingScore(updated.getPassingScore());
        existing.setNegativeMarking(updated.getNegativeMarking());
        existing.setRandomizeQuestions(updated.getRandomizeQuestions());
        existing.setShowResultsImmediately(updated.getShowResultsImmediately());
        existing.setStatus(updated.getStatus());

        return testRepository.save(existing);
    }

    public void deleteTest(String id) {
        if (!testRepository.existsById(id)) {
            throw new RuntimeException("Assessment not found");
        }
        testRepository.deleteById(id);
    }

    public Test attachQuestions(String testId, List<String> questionIds) {
        Test test = getTestById(testId);
        List<Question> questions = questionRepository.findByIdIn(questionIds);
        if (questions.size() != questionIds.size()) {
            throw new RuntimeException("One or more questions were not found");
        }
        test.setQuestions(questions);
        return testRepository.save(test);
    }
}
