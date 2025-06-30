// Interactive Quiz Application
class Quiz {
    constructor() {
        this.questions = [
            {
                question: "What does CSS stand for?",
                options: [
                    "Computer Style Sheets",
                    "Cascading Style Sheets",
                    "Creative Style Sheets",
                    "Colorful Style Sheets"
                ],
                correct: 1,
                explanation: "CSS stands for Cascading Style Sheets, which describes how HTML elements are displayed."
            },
            {
                question: "Which CSS property is used to make text bold?",
                options: [
                    "font-weight",
                    "text-weight",
                    "font-bold",
                    "text-bold"
                ],
                correct: 0,
                explanation: "The font-weight property is used to specify the weight (or boldness) of the font."
            },
            {
                question: "What is the correct way to create a function in JavaScript?",
                options: [
                    "function = myFunction() {}",
                    "function myFunction() {}",
                    "create myFunction() {}",
                    "def myFunction() {}"
                ],
                correct: 1,
                explanation: "Functions in JavaScript are declared using the 'function' keyword followed by the function name."
            },
            {
                question: "Which method is used to add an element to the end of an array in JavaScript?",
                options: [
                    "append()",
                    "add()",
                    "push()",
                    "insert()"
                ],
                correct: 2,
                explanation: "The push() method adds one or more elements to the end of an array and returns the new length."
            },
            {
                question: "What does API stand for?",
                options: [
                    "Application Programming Interface",
                    "Advanced Programming Interface",
                    "Application Process Interface",
                    "Automated Programming Interface"
                ],
                correct: 0,
                explanation: "API stands for Application Programming Interface, which allows different software applications to communicate."
            },
            {
                question: "Which CSS unit is relative to the viewport width?",
                options: [
                    "px",
                    "em",
                    "vw",
                    "rem"
                ],
                correct: 2,
                explanation: "vw (viewport width) is a CSS unit that represents a percentage of the viewport's width."
            },
            {
                question: "What is the purpose of media queries in CSS?",
                options: [
                    "To play media files",
                    "To create responsive designs",
                    "To query databases",
                    "To handle user input"
                ],
                correct: 1,
                explanation: "Media queries allow you to apply CSS styles based on device characteristics like screen size."
            },
            {
                question: "Which JavaScript method is used to fetch data from an API?",
                options: [
                    "get()",
                    "fetch()",
                    "request()",
                    "load()"
                ],
                correct: 1,
                explanation: "The fetch() method is the modern way to make HTTP requests and fetch data from APIs."
            }
        ];
        
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.quizStarted = false;
        this.quizCompleted = false;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.questionTitle = document.getElementById('question-title');
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.startBtn = document.getElementById('start-quiz-btn');
        this.nextBtn = document.getElementById('next-question-btn');
        this.restartBtn = document.getElementById('restart-quiz-btn');
        this.progressContainer = document.getElementById('quiz-progress');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.resultsContainer = document.getElementById('quiz-results');
        this.finalScore = document.getElementById('final-score');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
    }
    
    startQuiz() {
        this.quizStarted = true;
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.quizCompleted = false;
        
        this.startBtn.style.display = 'none';
        this.progressContainer.style.display = 'block';
        this.optionsContainer.style.display = 'block';
        this.resultsContainer.style.display = 'none';
        
        this.displayQuestion();
    }
    
    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        
        this.questionTitle.textContent = `Question ${this.currentQuestion + 1}`;
        this.questionText.textContent = question.question;
        
        this.optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(index, button));
            this.optionsContainer.appendChild(button);
        });
        
        this.updateProgress();
        this.selectedAnswer = null;
        this.nextBtn.style.display = 'none';
    }
    
    selectAnswer(answerIndex, buttonElement) {
        // Remove previous selections
        this.optionsContainer.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
        
        this.selectedAnswer = answerIndex;
        const question = this.questions[this.currentQuestion];
        
        // Show correct answer
        this.optionsContainer.querySelectorAll('.option').forEach((opt, index) => {
            if (index === question.correct) {
                opt.classList.add('correct');
            } else if (index === answerIndex && index !== question.correct) {
                opt.classList.add('incorrect');
            }
        });
        
        // Update score
        if (answerIndex === question.correct) {
            this.score++;
        }
        
        // Show explanation
        this.showExplanation(question.explanation);
        
        // Show next button
        this.nextBtn.style.display = 'inline-block';
        
        // Disable all options
        this.optionsContainer.querySelectorAll('.option').forEach(opt => {
            opt.disabled = true;
        });
    }
    
    showExplanation(explanation) {
        const existingExplanation = this.optionsContainer.querySelector('.explanation');
        if (existingExplanation) {
            existingExplanation.remove();
        }
        
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #764ba2;
            font-style: italic;
            color: #666;
        `;
        explanationDiv.innerHTML = `<strong>Explanation:</strong> ${explanation}`;
        this.optionsContainer.appendChild(explanationDiv);
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
    }
    
    showResults() {
        this.quizCompleted = true;
        
        this.optionsContainer.style.display = 'none';
        this.nextBtn.style.display = 'none';
        this.progressContainer.style.display = 'none';
        this.resultsContainer.style.display = 'block';
        this.restartBtn.style.display = 'inline-block';
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        let message = '';
        if (percentage >= 90) {
            message = 'Excellent! You\'re a web development expert! 🎉';
        } else if (percentage >= 70) {
            message = 'Great job! You have a solid understanding! 👍';
        } else if (percentage >= 50) {
            message = 'Good effort! Keep learning and practicing! 📚';
        } else {
            message = 'Keep studying! You\'ll get better with practice! 💪';
        }
        
        this.finalScore.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 1rem;">${this.score}/${this.questions.length}</div>
            <div style="font-size: 1.5rem; margin-bottom: 1rem; color: #764ba2;">${percentage}%</div>
            <div style="font-size: 1.1rem;">${message}</div>
        `;
        
        this.questionTitle.textContent = 'Quiz Complete!';
        this.questionText.textContent = 'Thanks for testing your knowledge!';
    }
    
    restartQuiz() {
        this.quizStarted = false;
        this.quizCompleted = false;
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        
        this.startBtn.style.display = 'inline-block';
        this.nextBtn.style.display = 'none';
        this.restartBtn.style.display = 'none';
        this.progressContainer.style.display = 'none';
        this.optionsContainer.style.display = 'none';
        this.resultsContainer.style.display = 'none';
        
        this.questionTitle.textContent = 'Web Development Quiz';
        this.questionText.textContent = 'Click "Start Quiz" to begin!';
    }
    
    // Method to add custom questions
    addQuestion(questionObj) {
        this.questions.push(questionObj);
    }
    
    // Method to shuffle questions
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }
    
    // Method to get random subset of questions
    getRandomQuestions(count) {
        const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
        this.questions = shuffled.slice(0, count);
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new Quiz();
    
    // Add some extra questions for variety
    window.quiz.addQuestion({
        question: "Which CSS property is used to create flexible layouts?",
        options: ["flexbox", "display: flex", "flex-direction", "All of the above"],
        correct: 3,
        explanation: "Flexbox uses multiple properties including display: flex, flex-direction, and others to create flexible layouts."
    });
    
    // Shuffle questions for variety
    window.quiz.shuffleQuestions();
    
    // Use only 5 random questions for each quiz session
    window.quiz.getRandomQuestions(5);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Quiz;
}
