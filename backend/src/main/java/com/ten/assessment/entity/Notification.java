package com.ten.assessment.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @Column(name = "id", length = 80)
    private String id;

    @Column(nullable = false)
    private String userId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDate date;
    private Boolean isRead;
    private String type;

    public Notification() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean read) { isRead = read; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
