package com.ten.assessment.dto;

import java.util.List;

public class SubmitResultRequest {
    private String candidateId;
    private String testId;
    private Integer timeTakenSeconds;
    private List<SubmitAnswerRequest> answers;

    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String candidateId) { this.candidateId = candidateId; }
    public String getTestId() { return testId; }
    public void setTestId(String testId) { this.testId = testId; }
    public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(Integer timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }
    public List<SubmitAnswerRequest> getAnswers() { return answers; }
    public void setAnswers(List<SubmitAnswerRequest> answers) { this.answers = answers; }
}
