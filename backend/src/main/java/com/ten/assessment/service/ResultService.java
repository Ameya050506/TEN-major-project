package com.ten.assessment.service;

import com.ten.assessment.dto.SubmitAnswerRequest;
import com.ten.assessment.dto.SubmitResultRequest;
import com.ten.assessment.entity.*;
import com.ten.assessment.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResultService {
    private final ResultRepository resultRepository;
    private final CandidateRepository candidateRepository;
    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;

    public ResultService(ResultRepository resultRepository,
                         CandidateRepository candidateRepository,
                         TestRepository testRepository,
                         QuestionRepository questionRepository) {
        this.resultRepository = resultRepository;
        this.candidateRepository = candidateRepository;
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
    }

    @Transactional
    public Result submit(SubmitResultRequest request) {
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Test test = testRepository.findById(request.getTestId())
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        Result result = new Result();
        result.setId("res-" + System.currentTimeMillis());
        result.setCandidate(candidate);
        result.setTest(test);
        result.setTotalMarks(test.getTotalMarks() == null ? 0 : test.getTotalMarks());
        result.setTimeTakenSeconds(request.getTimeTakenSeconds());
        result.setCompletedAt(LocalDateTime.now());

        int score = 0;

        if (request.getAnswers() != null) {
            for (SubmitAnswerRequest submitted : request.getAnswers()) {
                Question question = questionRepository.findById(submitted.getQuestionId())
                        .orElseThrow(() -> new RuntimeException("Question not found: " + submitted.getQuestionId()));

                Answer answer = new Answer();
                answer.setResult(result);
                answer.setQuestion(question);
                answer.setSelectedOptionId(submitted.getSelectedOptionId());
                result.getAnswers().add(answer);

                if (submitted.getSelectedOptionId() != null &&
                    submitted.getSelectedOptionId().equals(question.getCorrectOptionId())) {
                    score += question.getMarks() == null ? 0 : question.getMarks();
                } else if (submitted.getSelectedOptionId() != null &&
                           Boolean.TRUE.equals(test.getNegativeMarking())) {
                    score -= question.getNegativeMarks() == null ? 0 : question.getNegativeMarks();
                }
            }
        }

        result.setScore(score);

        double percentage = result.getTotalMarks() == 0
                ? 0.0
                : ((double) score / result.getTotalMarks()) * 100.0;

        result.setPercentage(Math.round(percentage * 100.0) / 100.0);
        result.setStatus(score >= (test.getPassingScore() == null ? 0 : test.getPassingScore())
                ? "PASSED" : "FAILED");

        Result saved = resultRepository.save(result);

        candidate.setTestsCompleted(
                (candidate.getTestsCompleted() == null ? 0 : candidate.getTestsCompleted()) + 1
        );
        candidateRepository.save(candidate);

        return saved;
    }

    public List<Result> getAll() {
        return resultRepository.findAll();
    }

    public Result getById(String id) {
        return resultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found"));
    }

    public List<Result> getByCandidate(String candidateId) {
        return resultRepository.findByCandidateId(candidateId);
    }

    public List<Result> getByTest(String testId) {
        return resultRepository.findByTestId(testId);
    }
}
