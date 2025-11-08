// Mock Interview Question Loader
class MockInterview {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.answers = [];
    this.config = null;
    this.startTime = Date.now();
  }

  async init() {
    // Check for saved progress first
    const hasProgress = this.loadProgress();

    if (hasProgress) {
      // Progress was loaded, skip loading new questions
      this.setupUI();
      this.displayCurrentQuestion();
      return;
    }

    // Load configuration from sessionStorage
    const configStr = sessionStorage.getItem('mockInterviewConfig');
    if (!configStr) {
      window.location.href = '/mock-interview';
      return;
    }

    this.config = JSON.parse(configStr);

    // Load questions from JSON file
    await this.loadQuestions();

    // Initialize UI
    this.setupUI();
    this.displayCurrentQuestion();
  }

  async loadQuestions() {
    try {
      const response = await fetch('/data/interview-questions.json');
      const data = await response.json();

      // Get questions for selected category
      let categoryQuestions = data[this.config.category] || [];

      // Filter by difficulty if not "mixed"
      if (this.config.difficulty !== 'mixed') {
        categoryQuestions = categoryQuestions.filter(
          q => q.difficulty === this.config.difficulty
        );
      }

      // Shuffle questions
      categoryQuestions = this.shuffleArray(categoryQuestions);

      // Select the requested number of questions
      this.questions = categoryQuestions.slice(0, parseInt(this.config.questionCount));

      if (this.questions.length === 0) {
        alert('No questions available for this configuration');
        window.location.href = '/mock-interview';
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load interview questions');
      window.location.href = '/mock-interview';
    }
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  setupUI() {
    // Update total questions
    document.getElementById('totalQuestions').textContent = this.questions.length;

    // Setup event listeners
    document.getElementById('btnNext')?.addEventListener('click', () => this.nextQuestion());
    document.getElementById('btnSkip')?.addEventListener('click', () => this.skipQuestion());
    document.getElementById('btnExit')?.addEventListener('click', () => this.exitInterview());
    document.querySelector('.btn-exit-interview')?.addEventListener('click', () => this.exitInterview());

    // Setup hint toggle
    document.getElementById('hintToggle')?.addEventListener('click', () => {
      const hintContent = document.getElementById('hintContent');
      hintContent?.classList.toggle('hidden');
    });

    // Setup word count
    const textarea = document.getElementById('answerInput');
    textarea?.addEventListener('input', (e) => {
      const words = e.target.value.trim().split(/\s+/).filter(w => w.length > 0).length;
      document.getElementById('wordCount').textContent = words;
    });

    // Setup timer if timed mode
    if (this.config.mode === 'timed') {
      this.startTimer();
    } else {
      document.getElementById('timer')?.style.display = 'none';
    }
  }

  displayCurrentQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finishInterview();
      return;
    }

    const question = this.questions[this.currentIndex];

    // Update progress
    const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('currentQuestion').textContent = this.currentIndex + 1;

    // Update question display
    document.querySelector('.question-label').textContent = `Question ${this.currentIndex + 1}`;
    document.getElementById('questionText').textContent = question.question;

    // Update badges
    const difficultyBadge = document.querySelector('.badge-difficulty');
    if (difficultyBadge) {
      difficultyBadge.textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
      difficultyBadge.className = `badge badge-difficulty badge-${question.difficulty}`;
    }

    const categoryBadge = document.querySelector('.badge-category');
    if (categoryBadge) {
      categoryBadge.textContent = this.config.category.charAt(0).toUpperCase() + this.config.category.slice(1);
    }

    // Clear previous answer
    document.getElementById('answerInput').value = '';
    document.getElementById('wordCount').textContent = '0';

    // Hide hint
    document.getElementById('hintContent')?.classList.add('hidden');

    // Reset timer if timed mode
    if (this.config.mode === 'timed') {
      this.resetTimer();
    }
  }

  nextQuestion() {
    // Save current answer
    const answer = document.getElementById('answerInput')?.value || '';
    this.answers.push({
      questionId: this.questions[this.currentIndex].id,
      question: this.questions[this.currentIndex].question,
      userAnswer: answer,
      modelAnswer: this.questions[this.currentIndex].answer,
      timestamp: new Date().toISOString()
    });

    // Move to next question
    this.currentIndex++;
    this.displayCurrentQuestion();
  }

  skipQuestion() {
    this.answers.push({
      questionId: this.questions[this.currentIndex].id,
      question: this.questions[this.currentIndex].question,
      userAnswer: '[SKIPPED]',
      modelAnswer: this.questions[this.currentIndex].answer,
      timestamp: new Date().toISOString()
    });

    this.currentIndex++;
    this.displayCurrentQuestion();
  }

  startTimer() {
    // 2 minutes per question
    this.timeRemaining = 120;
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = this.timeRemaining % 60;
      document.getElementById('timer').textContent =
        `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;

      if (this.timeRemaining <= 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  resetTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.startTimer();
  }

  exitInterview() {
    // Show custom modal with save option
    const currentQuestion = this.currentIndex + 1;
    const totalQuestions = this.questions.length;
    const questionsLeft = totalQuestions - this.currentIndex;

    const message = `Are you sure you want to exit?\n\nYou're on question ${currentQuestion} of ${totalQuestions}.\nYou have ${questionsLeft} question${questionsLeft !== 1 ? 's' : ''} left.\n\nDo you want to save your progress and resume later?`;

    const userChoice = confirm(message);

    if (userChoice) {
      // User clicked OK - Save progress
      this.saveProgress();
      alert('Your progress has been saved! You can resume this interview later from the interviews page.');
      window.location.href = '/interviews';
    } else {
      // User clicked Cancel - Ask if they want to exit without saving
      const exitConfirm = confirm('Exit without saving? Your answers will be lost.');
      if (exitConfirm) {
        sessionStorage.removeItem('mockInterviewConfig');
        sessionStorage.removeItem('mockInterviewProgress');
        window.location.href = '/mock-interview';
      }
      // If they cancel again, stay on the page
    }
  }

  saveProgress() {
    const progress = {
      config: this.config,
      currentIndex: this.currentIndex,
      answers: this.answers,
      questions: this.questions,
      startTime: this.startTime,
      savedAt: new Date().toISOString()
    };

    sessionStorage.setItem('mockInterviewProgress', JSON.stringify(progress));
  }

  loadProgress() {
    const progressStr = sessionStorage.getItem('mockInterviewProgress');
    if (progressStr) {
      try {
        const progress = JSON.parse(progressStr);

        // Ask if they want to resume
        const questionsLeft = progress.questions.length - progress.currentIndex;
        const resume = confirm(`You have a saved interview in progress!\n\nCategory: ${progress.config.category}\nQuestions left: ${questionsLeft}\n\nDo you want to resume where you left off?`);

        if (resume) {
          this.questions = progress.questions;
          this.currentIndex = progress.currentIndex;
          this.answers = progress.answers;
          this.startTime = progress.startTime;
          this.config = progress.config;
          return true;
        } else {
          // Clear saved progress if they don't want to resume
          sessionStorage.removeItem('mockInterviewProgress');
        }
      } catch (e) {
        console.error('Error loading progress:', e);
        sessionStorage.removeItem('mockInterviewProgress');
      }
    }
    return false;
  }

  finishInterview() {
    // Clear saved progress since they're finishing
    sessionStorage.removeItem('mockInterviewProgress');

    // Save results
    sessionStorage.setItem('mockInterviewResults', JSON.stringify({
      config: this.config,
      answers: this.answers,
      totalTime: Date.now() - this.startTime,
      completedAt: new Date().toISOString()
    }));

    // Navigate to results page
    window.location.href = '/mock-interview/results';
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  const interview = new MockInterview();
  interview.init();
});
