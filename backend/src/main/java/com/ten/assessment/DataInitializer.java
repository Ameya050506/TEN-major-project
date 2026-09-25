package com.ten.assessment;

import com.ten.assessment.entity.Option;
import com.ten.assessment.entity.Question;
import com.ten.assessment.entity.Test;
import com.ten.assessment.repository.QuestionRepository;
import com.ten.assessment.repository.TestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final QuestionRepository questionRepository;
    private final TestRepository testRepository;

    public DataInitializer(
            QuestionRepository questionRepository,
            TestRepository testRepository) {
        this.questionRepository = questionRepository;
        this.testRepository = testRepository;
    }

    @Override
    public void run(String... args) {

        if (questionRepository.count() > 0 || testRepository.count() > 0) {
            return;
        }

        // ---------------- QUESTIONS ----------------

        Question q101 = createQuestion(
                "q-101",
                "What will be the output of compiling and running the following Java snippet?",
                "public class Test {\n" +
                "    public static void main(String[] args) {\n" +
                "        String s1 = \"CodeJudge\";\n" +
                "        String s2 = new String(\"CodeJudge\");\n" +
                "        System.out.println((s1 == s2) + \" \" + s1.equals(s2));\n" +
                "    }\n" +
                "}",
                "Java", "Easy", 4, 1, "MCQ",
                "q-101-opt-2",
                "s1 is stored in the String Constant Pool, whereas s2 creates a new object in the Heap.",
                List.of(
                        option("q-101", "1", "true true"),
                        option("q-101", "2", "false true"),
                        option("q-101", "3", "false false"),
                        option("q-101", "4", "Compilation Error")
                )
        );

        Question q102 = createQuestion(
                "q-102",
                "Which SQL clause is strictly used to filter records after aggregation has been calculated by a GROUP BY clause?",
                "SELECT department_id, AVG(salary) as avg_sal\n" +
                "FROM employees\n" +
                "GROUP BY department_id\n" +
                "____ avg_sal > 75000;",
                "SQL", "Easy", 4, 1, "MCQ",
                "q-102-opt-2",
                "The HAVING clause is used to filter grouped records after aggregate calculations.",
                List.of(
                        option("q-102", "1", "WHERE"),
                        option("q-102", "2", "HAVING"),
                        option("q-102", "3", "ORDER BY"),
                        option("q-102", "4", "FILTER")
                )
        );

        Question q103 = createQuestion(
                "q-103",
                "Which SOLID principle asserts that high-level modules should not depend on low-level modules, but both should depend on abstractions?",
                null,
                "OOP", "Medium", 4, 1, "MCQ",
                "q-103-opt-4",
                "Dependency Inversion Principle states that high-level and low-level modules should depend on abstractions.",
                List.of(
                        option("q-103", "1", "Single Responsibility Principle"),
                        option("q-103", "2", "Open/Closed Principle"),
                        option("q-103", "3", "Interface Segregation Principle"),
                        option("q-103", "4", "Dependency Inversion Principle")
                )
        );

        Question q104 = createQuestion(
                "q-104",
                "In MySQL InnoDB, what type of lock is placed during a standard SELECT ... FOR UPDATE statement?",
                "START TRANSACTION;\n" +
                "SELECT * FROM accounts WHERE account_id = 42 FOR UPDATE;",
                "DBMS", "Hard", 4, 1, "MCQ",
                "q-104-opt-2",
                "FOR UPDATE sets an exclusive lock on the rows read until the transaction commits or rolls back.",
                List.of(
                        option("q-104", "1", "Shared Read Lock"),
                        option("q-104", "2", "Exclusive Next-Key / Record Lock"),
                        option("q-104", "3", "Table Metadata Lock"),
                        option("q-104", "4", "Intent Shared Lock")
                )
        );

        Question q105 = createQuestion(
                "q-105",
                "What is the worst-case time complexity of searching for a key in a Balanced Red-Black Binary Search Tree with N nodes?",
                null,
                "Data Structures", "Medium", 4, 1, "MCQ",
                "q-105-opt-2",
                "A Red-Black tree guarantees logarithmic height, so search takes O(log N) time.",
                List.of(
                        option("q-105", "1", "O(1)"),
                        option("q-105", "2", "O(log N)"),
                        option("q-105", "3", "O(N)"),
                        option("q-105", "4", "O(N log N)")
                )
        );

        Question q106 = createQuestion(
                "q-106",
                "A train running at 72 km/h crosses a 260m long platform in 23 seconds. What is the length of the train?",
                null,
                "Aptitude", "Medium", 4, 1, "MCQ",
                "q-106-opt-1",
                "72 km/h = 20 m/s. Total distance = 20 × 23 = 460m. Train length = 460 - 260 = 200m.",
                List.of(
                        option("q-106", "1", "200 meters"),
                        option("q-106", "2", "220 meters"),
                        option("q-106", "3", "240 meters"),
                        option("q-106", "4", "180 meters")
                )
        );

        questionRepository.saveAll(List.of(q101, q102, q103, q104, q105, q106));

        // ---------------- TESTS ----------------

        Test t1 = createTest(
                "test-java-01",
                "Java Full-Stack & Core OOP Assessment",
                "Java", "Medium",
                "Evaluates comprehensive understanding of Java memory management, String pool semantics, Collections framework, and SOLID design patterns.",
                30, 24, 16, true, true, true, 142,
                LocalDate.of(2026, 8, 15),
                List.of(q101, q102, q103, q104, q105, q106)
        );

        Test t2 = createTest(
                "test-sql-02",
                "Relational DBMS & Advanced SQL Test",
                "SQL", "Hard",
                "Assesses query optimization, indexing strategies, transaction isolation levels (ACID), and group aggregation rules.",
                25, 20, 14, true, false, true, 98,
                LocalDate.of(2026, 8, 20),
                List.of(q102, q104)
        );

        Test t3 = createTest(
                "test-dsa-03",
                "Data Structures & Algorithmic Analysis",
                "Data Structures", "Hard",
                "Tests knowledge of tree traversals, asymptotic runtime analysis, graph representations, and dynamic programming foundations.",
                45, 40, 28, false, true, true, 215,
                LocalDate.of(2026, 8, 28),
                List.of(q105)
        );

        Test t4 = createTest(
                "test-apt-04",
                "Logical Reasoning & Quantitative Aptitude",
                "Aptitude", "Easy",
                "Standard campus recruitment screening covering ratios, speed-distance-time, data interpretation, and pattern matching.",
                20, 16, 10, true, true, true, 340,
                LocalDate.of(2026, 9, 1),
                List.of(q106)
        );

        testRepository.saveAll(List.of(t1, t2, t3, t4));

        System.out.println("======================================");
        System.out.println("Initial assessment data inserted!");
        System.out.println("Questions: 6");
        System.out.println("Tests: 4");
        System.out.println("======================================");
    }

    private Question createQuestion(
            String id,
            String text,
            String codeSnippet,
            String category,
            String difficulty,
            int marks,
            int negativeMarks,
            String type,
            String correctOptionId,
            String explanation,
            List<Option> options) {

        Question q = new Question();

        q.setId(id);
        q.setText(text);
        q.setCodeSnippet(codeSnippet);
        q.setCategory(category);
        q.setDifficulty(difficulty);
        q.setMarks(marks);
        q.setNegativeMarks(negativeMarks);
        q.setType(type);
        q.setCorrectOptionId(correctOptionId);
        q.setExplanation(explanation);

        for (Option option : options) {
            option.setQuestion(q);
        }

        q.setOptions(options);

        return q;
    }

    private Option option(String questionId, String suffix, String text) {
        Option option = new Option();
        option.setId(questionId + "-opt-" + suffix);
        option.setText(text);
        return option;
    }

    private Test createTest(
            String id,
            String title,
            String category,
            String difficulty,
            String description,
            int duration,
            int totalMarks,
            int passingScore,
            boolean negativeMarking,
            boolean randomizeQuestions,
            boolean showResults,
            int totalAttempts,
            LocalDate createdAt,
            List<Question> questions) {

        Test test = new Test();

        test.setId(id);
        test.setTitle(title);
        test.setCategory(category);
        test.setDifficulty(difficulty);
        test.setDescription(description);
        test.setDurationMinutes(duration);
        test.setTotalMarks(totalMarks);
        test.setPassingScore(passingScore);
        test.setNegativeMarking(negativeMarking);
        test.setRandomizeQuestions(randomizeQuestions);
        test.setShowResultsImmediately(showResults);
        test.setStatus("Active");
        test.setTotalAttempts(totalAttempts);
        test.setCreatedAt(createdAt);
        test.setQuestions(questions);

        return test;
    }
}