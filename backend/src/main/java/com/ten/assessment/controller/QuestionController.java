package com.ten.assessment.controller;

import com.ten.assessment.entity.Question;
import com.ten.assessment.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {
    private final QuestionService service;

    public QuestionController(QuestionService service) { this.service = service; }

    @GetMapping
    public List<Question> getAll(@RequestParam(required = false) String ids) {
        if (ids == null || ids.isBlank()) return service.getAllQuestions();
        return service.getQuestionsByIds(Arrays.asList(ids.split(",")));
    }

    @PostMapping
    public ResponseEntity<Question> create(@RequestBody Question question) {
        return ResponseEntity.ok(service.createQuestion(question));
    }

    @PutMapping("/{id}")
    public Question update(@PathVariable String id, @RequestBody Question question) {
        return service.updateQuestion(id, question);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
