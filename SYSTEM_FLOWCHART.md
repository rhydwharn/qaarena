# ISTQB Practice Q&A Platform - System Flowcharts

## Table of Contents
1. [Overall System Architecture](#1-overall-system-architecture)
2. [User Authentication Flow](#2-user-authentication-flow)
3. [Quiz Taking Flow](#3-quiz-taking-flow)
4. [Question Management Flow](#4-question-management-flow)
5. [Progress Tracking Flow](#5-progress-tracking-flow)
6. [Admin Dashboard Flow](#6-admin-dashboard-flow)
7. [Achievement System Flow](#7-achievement-system-flow)

---

## 1. Overall System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>SPA]
    end
    
    subgraph "API Layer"
        B[Express.js Server]
        C[JWT Auth Middleware]
        D[Rate Limiter]
        E[Validation Middleware]
    end
    
    subgraph "Business Logic Layer"
        F[Auth Controller]
        G[Question Controller]
        H[Quiz Controller]
        I[Progress Controller]
        J[Leaderboard Controller]
        K[Achievement Controller]
        L[Admin Controller]
    end
    
    subgraph "Data Layer"
        M[(MongoDB)]
        N[User Model]
        O[Question Model]
        P[Quiz Model]
        Q[Progress Model]
        R[Achievement Model]
    end
    
    A -->|HTTP/HTTPS| B
    B --> C
    B --> D
    B --> E
    C --> F
    C --> G
    C --> H
    C --> I
    C --> J
    C --> K
    C --> L
    F --> N
    G --> O
    H --> P
    I --> Q
    J --> N
    K --> R
    L --> N
    L --> O
    L --> R
    N --> M
    O --> M
    P --> M
    Q --> M
    R --> M
```

---

## 2. User Authentication Flow

### 2.1 Registration Flow

```mermaid
flowchart TD
    Start([User Visits Platform]) --> A[Click Register]
    A --> B[Enter Details:<br/>Username, Email, Password,<br/>Profile Info]
    B --> C{Validate Input}
    C -->|Invalid| D[Show Validation Errors]
    D --> B
    C -->|Valid| E[Send POST /api/auth/register]
    E --> F{Check Email/Username<br/>Exists?}
    F -->|Yes| G[Return Error:<br/>Already Exists]
    G --> D
    F -->|No| H[Hash Password<br/>bcrypt]
    H --> I[Create User Record]
    I --> J[Create Progress Record]
    J --> K[Generate JWT Token]
    K --> L[Return Token + User Data]
    L --> M[Store Token in<br/>Local Storage]
    M --> N[Redirect to Dashboard]
    N --> End([User Logged In])
```

### 2.2 Login Flow

```mermaid
flowchart TD
    Start([User Visits Platform]) --> A[Click Login]
    A --> B[Enter Email & Password]
    B --> C{Validate Input}
    C -->|Invalid| D[Show Validation Errors]
    D --> B
    C -->|Valid| E[Send POST /api/auth/login]
    E --> F{User Exists?}
    F -->|No| G[Return Error:<br/>Invalid Credentials]
    G --> D
    F -->|Yes| H{Password Correct?}
    H -->|No| G
    H -->|Yes| I{User Active?}
    I -->|No| J[Return Error:<br/>Account Deactivated]
    J --> D
    I -->|Yes| K[Update Last Login]
    K --> L[Generate JWT Token]
    L --> M[Return Token + User Data]
    M --> N[Store Token in<br/>Local Storage]
    N --> O[Redirect to Dashboard]
    O --> End([User Logged In])
```

---

## 3. Quiz Taking Flow

### 3.1 Complete Quiz Flow

```mermaid
flowchart TD
    Start([User Dashboard]) --> A[Click Start Quiz]
    A --> B[Select Quiz Settings:<br/>Mode, Category, Difficulty,<br/>Number of Questions]
    B --> C[Send POST /api/quiz/start]
    C --> D{Questions<br/>Available?}
    D -->|No| E[Show Error:<br/>No Questions Found]
    E --> A
    D -->|Yes| F[Randomly Select Questions]
    F --> G[Create Quiz Session<br/>Status: in-progress]
    G --> H[Return Quiz with Questions]
    H --> I[Display First Question]
    
    I --> J[User Selects Answer]
    J --> K[Send POST /api/quiz/answer<br/>quizId, questionId, answer]
    K --> L[Validate Answer]
    L --> M{Answer Correct?}
    M -->|Yes| N[Mark as Correct]
    M -->|No| O[Mark as Incorrect]
    N --> P[Update Quiz Record]
    O --> P
    P --> Q[Return Feedback]
    Q --> R{More Questions?}
    R -->|Yes| I
    R -->|No| S[User Clicks Complete]
    
    S --> T[Send POST /api/quiz/:id/complete]
    T --> U[Calculate Final Score:<br/>Correct/Incorrect/Unanswered]
    U --> V[Update Quiz Status:<br/>completed]
    V --> W[Update User Statistics:<br/>totalQuizzes, correctAnswers,<br/>averageScore]
    W --> X[Update Progress Tracking:<br/>Category Progress,<br/>Recent Activity]
    X --> Y[Update Question Statistics]
    Y --> Z[Check for New Achievements]
    Z --> AA[Return Quiz Results]
    AA --> AB[Display Results Page:<br/>Score, Time, Breakdown]
    AB --> End([Quiz Completed])
```

---

## 4. Question Management Flow

### 4.1 Question Creation Flow

```mermaid
flowchart TD
    Start([Admin Dashboard]) --> A[Click Create Question]
    A --> B[Fill Question Form:<br/>Text, Type, Options,<br/>Category, Difficulty]
    B --> C{Validate Input}
    C -->|Invalid| D[Show Validation Errors]
    D --> B
    C -->|Valid| E[Send POST /api/questions]
    E --> F{User Role<br/>Admin/Moderator?}
    F -->|No| G[Return Error:<br/>Unauthorized]
    G --> D
    F -->|Yes| H[Create Question Record]
    H --> I[Return Question Data]
    I --> J[Show Success Message]
    J --> End([Question Created])
```

### 4.2 Question Flagging Flow

```mermaid
flowchart TD
    Start([User Taking Quiz]) --> A[User Finds Issue]
    A --> B[Click Flag Question]
    B --> C[Enter Flag Reason]
    C --> D[Send POST /api/questions/:id/flag]
    D --> E[Add Flag to Question]
    E --> F{Multiple Flags?}
    F -->|Yes| G[Change Status to 'flagged']
    F -->|No| H[Keep Current Status]
    G --> I[Notify Admins]
    H --> I
    I --> J[Return Success]
    J --> End([Question Flagged])
```

---

## 5. Progress Tracking Flow

### 5.1 Progress Update Flow

```mermaid
flowchart TD
    Start([Quiz Completed]) --> A[Get User Progress Record]
    A --> B{Progress<br/>Exists?}
    B -->|No| C[Create New Progress Record]
    B -->|Yes| D[Load Existing Progress]
    C --> D
    
    D --> E{Quiz Has<br/>Category?}
    E -->|Yes| F{Category<br/>Exists in Progress?}
    F -->|Yes| G[Update Category Stats]
    F -->|No| H[Add New Category Entry]
    H --> G
    E -->|No| I[Skip Category Update]
    
    G --> J[Add to Recent Activity]
    I --> J
    J --> K[Update Total Time Spent]
    K --> L[Update Study Streak]
    L --> M[Calculate Weak/Strong Areas]
    M --> N[Save Progress Record]
    N --> End([Progress Updated])
```

### 5.2 Study Streak Calculation

```mermaid
flowchart TD
    Start([User Completes Quiz]) --> A[Get Current Date]
    A --> B{Last Study<br/>Date Exists?}
    B -->|No| C[Set Current Streak = 1]
    B -->|Yes| D[Calculate Days Difference]
    D --> E{Days Diff = 0?}
    E -->|Yes| F[Already Studied Today]
    E -->|No| G{Days Diff = 1?}
    G -->|Yes| H[Increment Current Streak]
    H --> I{Current > Longest?}
    I -->|Yes| J[Update Longest Streak]
    I -->|No| K[Keep Longest Streak]
    J --> L[Update Last Study Date]
    K --> L
    G -->|No| M[Reset Current Streak = 1]
    M --> L
    C --> N[Save Progress]
    L --> N
    F --> N
    N --> End([Streak Updated])
```

---

## 6. Admin Dashboard Flow

### 6.1 User Management Flow

```mermaid
flowchart TD
    Start([Admin Dashboard]) --> A[Click User Management]
    A --> B[Load Users List]
    B --> C[Display Users Table]
    C --> D{Admin Action?}
    
    D -->|Change Role| E[Select New Role]
    E --> F{Changing<br/>Own Role?}
    F -->|Yes| G[Show Error]
    F -->|No| H[Update User Role]
    H --> I[Show Success]
    I --> B
    
    D -->|Deactivate User| K{Deactivating<br/>Self?}
    K -->|Yes| L[Show Error]
    K -->|No| M[Confirm Action]
    M --> N{Confirmed?}
    N -->|No| C
    N -->|Yes| O[Deactivate User]
    O --> P[Show Success]
    P --> B
    
    D -->|Exit| End([Admin Dashboard])
    G --> C
    L --> C
```

### 6.2 Question Review Flow

```mermaid
flowchart TD
    Start([Admin Dashboard]) --> A[Click Flagged Questions]
    A --> B[Load Flagged Questions]
    B --> C[Display Questions List]
    C --> D{Select Question}
    D --> E[View Question Details]
    E --> F{Admin Decision?}
    
    F -->|Approve| G[Clear Flags]
    G --> H[Set Status = published]
    H --> I[Show Success]
    
    F -->|Archive| K[Clear Flags]
    K --> L[Set Status = archived]
    L --> M[Show Success]
    
    F -->|Edit| N[Open Edit Form]
    N --> O[Make Changes]
    O --> G
    
    I --> B
    M --> B
    
    C --> End([Exit Review])
```

---

## 7. Achievement System Flow

```mermaid
flowchart TD
    Start([Quiz Completed]) --> A[Trigger Achievement Check]
    A --> B[Load All Active Achievements]
    B --> C[Load User Achievements]
    C --> D[For Each Achievement]
    D --> E{Already<br/>Unlocked?}
    E -->|Yes| F[Skip Achievement]
    E -->|No| G{Check Criteria}
    
    G --> H{Criteria<br/>Met?}
    H -->|Yes| I[Unlock Achievement]
    H -->|No| J[Next Achievement]
    
    I --> K[Add to User Achievements]
    K --> L[Add to New List]
    L --> J
    
    F --> J
    J --> M{More<br/>Achievements?}
    M -->|Yes| D
    M -->|No| N{New Achievements?}
    N -->|Yes| O[Save User Record]
    O --> P[Show Notification]
    N -->|No| Q[Return Empty]
    P --> End([Achievements Checked])
    Q --> End
```

---

## 8. Error Handling Flow

```mermaid
flowchart TD
    Start([API Request]) --> A{Request Valid?}
    A -->|No| B[Return 400 Bad Request]
    A -->|Yes| C{Auth Required?}
    C -->|Yes| D{Valid JWT?}
    D -->|No| E[Return 401 Unauthorized]
    D -->|Yes| F{User Active?}
    F -->|No| G[Return 401 Deactivated]
    F -->|Yes| H{Authorization OK?}
    H -->|No| I[Return 403 Forbidden]
    H -->|Yes| J[Process Request]
    C -->|No| J
    
    J --> K{Success?}
    K -->|Yes| L[Return 200/201]
    K -->|No| M{Error Type?}
    M -->|Not Found| N[Return 404]
    M -->|Server Error| O[Return 500]
    M -->|Business Logic| P[Return 400]
    
    B --> End([Response Sent])
    E --> End
    G --> End
    I --> End
    L --> End
    N --> End
    O --> End
    P --> End
```

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2024  
**Created for**: ISTQB Practice Q&A Platform