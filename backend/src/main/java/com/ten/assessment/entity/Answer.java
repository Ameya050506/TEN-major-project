package com.ten.assessment.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "answers")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "result_id", nullable = false)
    private Result result;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    private String selectedOptionId;

    public Answer() {}

    public Long getId() { return id; }
    public Result getResult() { return result; }
    public void setResult(Result result) { this.result = result; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
    public String getSelectedOptionId() { return selectedOptionId; }
    public void setSelectedOptionId(String selectedOptionId) { this.selectedOptionId = selectedOptionId; }
}
