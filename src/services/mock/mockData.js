export const INITIAL_QUESTIONS = [
  {
    id: "q-101",
    text: "What will be the output of compiling and running the following Java snippet?",
    codeSnippet: `public class Test {\n    public static void main(String[] args) {\n        String s1 = "CodeJudge";\n        String s2 = new String("CodeJudge");\n        System.out.println((s1 == s2) + " " + s1.equals(s2));\n    }\n}`,
    category: "Java",
    difficulty: "Easy",
    marks: 4,
    negativeMarks: 1,
    type: "MCQ",
    options: [
      { id: "opt-1", text: "true true" },
      { id: "opt-2", text: "false true" },
      { id: "opt-3", text: "false false" },
      { id: "opt-4", text: "Compilation Error" }
    ],
    correctOptionId: "opt-2",
    explanation: "s1 is stored in the String Constant Pool, whereas s2 creates a new object in the Heap. Hence s1 == s2 evaluates to false (reference equality), but s1.equals(s2) checks content equality, returning true."
  },
  {
    id: "q-102",
    text: "Which SQL clause is strictly used to filter records after aggregation has been calculated by a GROUP BY clause?",
    codeSnippet: `SELECT department_id, AVG(salary) as avg_sal\nFROM employees\nGROUP BY department_id\n____ avg_sal > 75000;`,
    category: "SQL",
    difficulty: "Easy",
    marks: 4,
    negativeMarks: 1,
    type: "MCQ",
    options: [
      { id: "opt-1", text: "WHERE" },
      { id: "opt-2", text: "HAVING" },
      { id: "opt-3", text: "ORDER BY" },
      { id: "opt-4", text: "FILTER" }
    ],
    correctOptionId: "opt-2",
    explanation: "The HAVING clause was added to SQL because the WHERE keyword cannot be used with aggregate functions such as AVG(), SUM(), or COUNT()."
  },
  {
    id: "q-103",
    text: "Which SOLID principle asserts that high-level modules should not depend on low-level modules, but both should depend on abstractions?",
    codeSnippet: null,
    category: "OOP",
    difficulty: "Medium",
    marks: 4,
    negativeMarks: 1,
    type: "MCQ",
    options: [
      { id: "opt-1", text: "Single Responsibility Principle" },
      { id: "opt-2", text: "Open/Closed Principle" },
      { id: "opt-3", text: "Interface Segregation Principle" },
      { id: "opt-4", text: "Dependency Inversion Principle" }
    ],
    correctOptionId: "opt-4",
    explanation: "Dependency Inversion Principle (DIP) states that abstractions should not depend on details; details (concrete implementations) should depend on abstractions."
  },
  {
    id: "q-104",
    text: "In MySQL InnoDB, what type of lock is placed during a standard SELECT ... FOR UPDATE statement?",
    codeSnippet: `START TRANSACTION;\nSELECT * FROM accounts WHERE account_id = 42 FOR UPDATE;`,
    category: "DBMS",
    difficulty: "Hard",
    marks: 4,
    negativeMarks: 1,
    type: "MCQ",
    options: [
      { id: "opt-1", text: "Shared Read Lock" },
      { id: "opt-2", text: "Exclusive Next-Key / Record Lock" },
      { id: "opt-3", text: "Table Metadata Lock" },
      { id: "opt-4", text: "Intent Shared Lock" }
    ],
    correctOptionId: "opt-2",
    explanation: "FOR UPDATE sets an exclusive lock on the rows read, preventing other transactions from updating or locking them until the current transaction commits or rolls back."
  },
  {
    id: "q-105",
    text: "What is the worst-case time complexity of searching for a key in a Balanced Red-Black Binary Search Tree with N nodes?",
    codeSnippet: null,
    category: "Data Structures",
    difficulty: "Medium",
    marks: 4,
    negativeMarks: 1,
    type: "MCQ",
    options: [
      { id: "opt-1", text: "O(1)" },
      { id: "opt-2", text: "O(log N)" },
      { id: "opt-3", text: "O(N)" },
      { id: "opt-4", text: "O(N log N)" }
    ],
    correctOptionId: "opt-2",
    explanation: "Because a Red-Black tree guarantees a height of at most 2 * log2(N + 1), search operations are guaranteed to complete in O(log N) time worst case."
  },
  {
    id: "q-106",
    text: "A train running at 72 km/h crosses a 260m long platform in 23 seconds. What is the length of the train?",
    codeSnippet: null,
    category: "Aptitude",
    difficulty: "Medium",
    marks: 4,
    negativeMarks: 1,
    type: "MCQ",
    options: [
      { id: "opt-1", text: "200 meters" },
      { id: "opt-2", text: "220 meters" },
      { id: "opt-3", text: "240 meters" },
      { id: "opt-4", text: "180 meters" }
    ],
    correctOptionId: "opt-1",
    explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Total distance = Speed * Time = 20 * 23 = 460 m. Train length = 460 - 260 = 200 meters."
  }
];

export const INITIAL_TESTS = [
  {
    id: "test-java-01",
    title: "Java Full-Stack & Core OOP Assessment",
    category: "Java",
    difficulty: "Medium",
    description: "Evaluates comprehensive understanding of Java memory management, String pool semantics, Collections framework, and SOLID design patterns.",
    durationMinutes: 30,
    totalMarks: 24,
    passingScore: 16,
    negativeMarking: true,
    randomizeQuestions: true,
    showResultsImmediately: true,
    status: "Active",
    questionIds: ["q-101", "q-102", "q-103", "q-104", "q-105", "q-106"],
    totalAttempts: 142,
    createdAt: "2026-08-15"
  },
  {
    id: "test-sql-02",
    title: "Relational DBMS & Advanced SQL Test",
    category: "SQL",
    difficulty: "Hard",
    description: "Assesses query optimization, indexing strategies, transaction isolation levels (ACID), and group aggregation rules.",
    durationMinutes: 25,
    totalMarks: 20,
    passingScore: 14,
    negativeMarking: true,
    randomizeQuestions: false,
    showResultsImmediately: true,
    status: "Active",
    questionIds: ["q-102", "q-104"],
    totalAttempts: 98,
    createdAt: "2026-08-20"
  },
  {
    id: "test-dsa-03",
    title: "Data Structures & Algorithmic Analysis",
    category: "Data Structures",
    difficulty: "Hard",
    description: "Tests knowledge of tree traversals, asymptotic runtime analysis, graph representations, and dynamic programming foundations.",
    durationMinutes: 45,
    totalMarks: 40,
    passingScore: 28,
    negativeMarking: false,
    randomizeQuestions: true,
    showResultsImmediately: true,
    status: "Active",
    questionIds: ["q-105"],
    totalAttempts: 215,
    createdAt: "2026-08-28"
  },
  {
    id: "test-apt-04",
    title: "Logical Reasoning & Quantitative Aptitude",
    category: "Aptitude",
    difficulty: "Easy",
    description: "Standard campus recruitment screening covering ratios, speed-distance-time, data interpretation, and pattern matching.",
    durationMinutes: 20,
    totalMarks: 16,
    passingScore: 10,
    negativeMarking: true,
    randomizeQuestions: true,
    showResultsImmediately: true,
    status: "Active",
    questionIds: ["q-106"],
    totalAttempts: 340,
    createdAt: "2026-09-01"
  }
];

export const INITIAL_CANDIDATES = [
  {
    id: "cand-001",
    fullName: "Ameya Inamdar",
    email: "ameya.inamdar@vesit.edu.in",
    role: "candidate",
    organization: "VESIT",
    designation: "Computer Engineering",
    phone: "+91 9820011223",
    status: "Active",
    testsCompleted: 3,
    avgScore: 84.5,
    registeredAt: "2026-08-10"
  },
  {
    id: "cand-002",
    fullName: "Rohan Sharma",
    email: "rohan.s@gmail.com",
    role: "candidate",
    organization: "IIT Bombay",
    designation: "Computer Science",
    phone: "+91 9811223344",
    status: "Active",
    testsCompleted: 4,
    avgScore: 92.0,
    registeredAt: "2026-08-12"
  },
  {
    id: "cand-003",
    fullName: "Pooja Verma",
    email: "p.verma@techcorp.io",
    role: "candidate",
    organization: "TechCorp Systems",
    designation: "Junior Software Engineer",
    phone: "+91 9723456789",
    status: "Active",
    testsCompleted: 2,
    avgScore: 78.0,
    registeredAt: "2026-08-14"
  }
];

export const INITIAL_RESULTS = [
  {
    id: "res-901",
    candidateId: "cand-001",
    candidateName: "Ameya Inamdar",
    candidateEmail: "ameya.inamdar@vesit.edu.in",
    testId: "test-java-01",
    testTitle: "Java Full-Stack & Core OOP Assessment",
    category: "Java",
    score: 20,
    totalMarks: 24,
    percentage: 83,
    status: "PASSED",
    timeTakenSeconds: 1140,
    completedAt: "2026-09-10",
    rank: 4,
    answers: {
      "q-101": "opt-2",
      "q-102": "opt-2",
      "q-103": "opt-4",
      "q-104": "opt-2",
      "q-105": "opt-2",
      "q-106": "opt-2"
    },
    categoryBreakdown: {
      Java: 100,
      SQL: 100,
      OOP: 100,
      DBMS: 100,
      "Data Structures": 100,
      Aptitude: 0
    }
  },
  {
    id: "res-902",
    candidateId: "cand-002",
    candidateName: "Rohan Sharma",
    candidateEmail: "rohan.s@gmail.com",
    testId: "test-java-01",
    testTitle: "Java Full-Stack & Core OOP Assessment",
    category: "Java",
    score: 24,
    totalMarks: 24,
    percentage: 100,
    status: "PASSED",
    timeTakenSeconds: 920,
    completedAt: "2026-09-12",
    rank: 1,
    answers: {
      "q-101": "opt-2",
      "q-102": "opt-2",
      "q-103": "opt-4",
      "q-104": "opt-2",
      "q-105": "opt-2",
      "q-106": "opt-1"
    },
    categoryBreakdown: {
      Java: 100,
      SQL: 100,
      OOP: 100,
      DBMS: 100,
      "Data Structures": 100,
      Aptitude: 100
    }
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    userId: "cand-001",
    title: "New Assessment Available",
    message: "Data Structures & Algorithmic Analysis has been published.",
    date: "2026-09-14",
    isRead: false,
    type: "info"
  },
  {
    id: "notif-2",
    userId: "cand-001",
    title: "Result Published",
    message: "Your score for Java Full-Stack Assessment is 83% (PASSED).",
    date: "2026-09-10",
    isRead: true,
    type: "success"
  }
];