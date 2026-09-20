package com.ten.assessment.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "candidates")
public class Candidate {
    @Id
    @Column(name = "id", length = 80)
    private String id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String role;
    private String organization;
    private String designation;
    private String phone;
    private String status;
    private Integer testsCompleted;
    private Double avgScore;
    private LocalDate registeredAt;

    public Candidate() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getTestsCompleted() { return testsCompleted; }
    public void setTestsCompleted(Integer testsCompleted) { this.testsCompleted = testsCompleted; }
    public Double getAvgScore() { return avgScore; }
    public void setAvgScore(Double avgScore) { this.avgScore = avgScore; }
    public LocalDate getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDate registeredAt) { this.registeredAt = registeredAt; }
}
