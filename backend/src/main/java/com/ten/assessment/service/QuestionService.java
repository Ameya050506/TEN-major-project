package com.ten.assessment.service;

import com.ten.assessment.entity.Option;
import com.ten.assessment.entity.Question;
import com.ten.assessment.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {
    private final QuestionRepository repository;

    public QuestionService(QuestionRepository repository) {
        this.repository = repository;
    }

    public List<Question> getAllQuestions() {
        return repository.findAll();
    }

    public List<Question> getQuestionsByIds(List<String> ids) {
        return repository.findByIdIn(ids);
    }

    public Question createQuestion(Question question) {
        if (question.getId() == null || question.getId().isBlank()) {
            question.setId("q-" + System.currentTimeMillis());
        }
        prepareOptions(question);
        return repository.save(question);
    }

    public Question updateQuestion(String id, Question updated) {
        Question existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        existing.setText(updated.getText());
        existing.setCodeSnippet(updated.getCodeSnippet());
        existing.setCategory(updated.getCategory());
        existing.setDifficulty(updated.getDifficulty());
        existing.setMarks(updated.getMarks());
        existing.setNegativeMarks(updated.getNegativeMarks());
        existing.setType(updated.getType());
        existing.setCorrectOptionId(updated.getCorrectOptionId());
        existing.setExplanation(updated.getExplanation());

        existing.getOptions().clear();
        if (updated.getOptions() != null) {
            for (Option option : updated.getOptions()) {
                option.setQuestion(existing);
                existing.getOptions().add(option);
            }
        }

        return repository.save(existing);
    }

    public void deleteQuestion(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Question not found");
        }
        repository.deleteById(id);
    }

    private void prepareOptions(Question question) {
        if (question.getOptions() != null) {
            for (Option option : question.getOptions()) {
                if (option.getId() == null || option.getId().isBlank()) {
                    option.setId("opt-" + System.nanoTime());
                }
                option.setQuestion(question);
            }
        }
    }
}
