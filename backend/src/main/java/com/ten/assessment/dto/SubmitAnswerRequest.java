package com.ten.assessment.dto;

public class SubmitAnswerRequest {
    private String questionId;
    private String selectedOptionId;

    public String getQuestionId() { return questionId; }
    public void setQuestionId(String questionId) { this.questionId = questionId; }
    public String getSelectedOptionId() { return selectedOptionId; }
    public void setSelectedOptionId(String selectedOptionId) { this.selectedOptionId = selectedOptionId; }
}
