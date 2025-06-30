// Main JavaScript file for Advanced CSS & JavaScript Learning Hub
class LearningHub {
    constructor() {
        this.currentSection = 'responsive';
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeScrollEffects();
        this.initializeNavigation();
        this.setupIntersectionObserver();
        this.addProgressTracking();
        
        this.initialized = true;
        console.log('Learning Hub initialized successfully!');
    }
    
    bindEvents() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
        
        // Window resize handler for responsive adjustments
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Theme toggle (if needed)
        this.addThemeToggle();
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const targetPosition = section.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            this.currentSection = sectionId;
            this.updateActiveNavLink(sectionId);
        }
    }
    
    updateActiveNavLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    initializeScrollEffects() {
        // Add scroll-based animations
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.grid-item, .quiz-container, .carousel-container, .api-demo');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('fade-in-up');
                }
            });
        };
        
        window.addEventListener('scroll', this.throttle(animateOnScroll, 100));
        animateOnScroll(); // Run once on load
    }
    
    initializeNavigation() {
        // Add active state to navigation based on scroll position
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.project-section');
        
        const updateActiveNav = () => {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };
        
        window.addEventListener('scroll', this.throttle(updateActiveNav, 100));
    }
    
    setupIntersectionObserver() {
        // Use Intersection Observer for better performance
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Track section visits
                    const sectionId = entry.target.getAttribute('id');
                    if (sectionId) {
                        this.trackSectionVisit(sectionId);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all project sections
        document.querySelectorAll('.project-section').forEach(section => {
            observer.observe(section);
        });
    }
    
    handleResize() {
        // Handle responsive adjustments
        const width = window.innerWidth;
        
        if (width <= 480) {
            document.body.classList.add('mobile-view');
            document.body.classList.remove('tablet-view', 'desktop-view');
        } else if (width <= 768) {
            document.body.classList.add('tablet-view');
            document.body.classList.remove('mobile-view', 'desktop-view');
        } else {
            document.body.classList.add('desktop-view');
            document.body.classList.remove('mobile-view', 'tablet-view');
        }
        
        // Adjust carousel height on mobile
        if (width <= 480 && window.mainCarousel) {
            const carouselSlides = document.querySelectorAll('.carousel-slide');
            carouselSlides.forEach(slide => {
                slide.style.height = '250px';
            });
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Global keyboard shortcuts
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    this.scrollToSection('responsive');
                    break;
                case '2':
                    e.preventDefault();
                    this.scrollToSection('quiz');
                    break;
                case '3':
                    e.preventDefault();
                    this.scrollToSection('carousel');
                    break;
                case '4':
                    e.preventDefault();
                    this.scrollToSection('api');
                    break;
            }
        }
    }
    
    addThemeToggle() {
        // Add a simple theme toggle
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '🌙';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        `;
        
        let isDarkMode = false;
        
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
            
            // Store theme preference
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            isDarkMode = true;
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '☀️';
        }
        
        document.body.appendChild(themeToggle);
    }
    
    addProgressTracking() {
        // Track user progress through the learning modules
        this.progress = {
            sectionsVisited: new Set(),
            quizCompleted: false,
            carouselInteracted: false,
            apiDataFetched: false
        };
        
        // Load saved progress
        const savedProgress = localStorage.getItem('learningProgress');
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            this.progress = { ...this.progress, ...parsed };
            this.progress.sectionsVisited = new Set(parsed.sectionsVisited || []);
        }
        
        this.updateProgressDisplay();
    }
    
    trackSectionVisit(sectionId) {
        this.progress.sectionsVisited.add(sectionId);
        this.saveProgress();
        this.updateProgressDisplay();
    }
    
    trackQuizCompletion() {
        this.progress.quizCompleted = true;
        this.saveProgress();
        this.updateProgressDisplay();
    }
    
    trackCarouselInteraction() {
        this.progress.carouselInteracted = true;
        this.saveProgress();
        this.updateProgressDisplay();
    }
    
    trackAPIUsage() {
        this.progress.apiDataFetched = true;
        this.saveProgress();
        this.updateProgressDisplay();
    }
    
    saveProgress() {
        const progressToSave = {
            ...this.progress,
            sectionsVisited: Array.from(this.progress.sectionsVisited)
        };
        localStorage.setItem('learningProgress', JSON.stringify(progressToSave));
    }
    
    updateProgressDisplay() {
        // Create or update progress indicator
        let progressIndicator = document.querySelector('.progress-indicator');
        
        if (!progressIndicator) {
            progressIndicator = document.createElement('div');
            progressIndicator.className = 'progress-indicator';
            progressIndicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(118, 75, 162, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 25px;
                font-size: 0.9rem;
                z-index: 1000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(progressIndicator);
        }
        
        const totalSections = 4;
        const completedSections = this.progress.sectionsVisited.size;
        const progressPercentage = Math.round((completedSections / totalSections) * 100);
        
        progressIndicator.innerHTML = `
            📚 Progress: ${progressPercentage}%
            ${this.progress.quizCompleted ? '✅' : '⭕'} Quiz
            ${this.progress.carouselInteracted ? '✅' : '⭕'} Carousel
            ${this.progress.apiDataFetched ? '✅' : '⭕'} API
        `;
    }
    
    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Public methods for external use
    getCurrentSection() {
        return this.currentSection;
    }
    
    getProgress() {
        return { ...this.progress };
    }
    
    resetProgress() {
        this.progress = {
            sectionsVisited: new Set(),
            quizCompleted: false,
            carouselInteracted: false,
            apiDataFetched: false
        };
        localStorage.removeItem('learningProgress');
        this.updateProgressDisplay();
    }
}

// Initialize the Learning Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.learningHub = new LearningHub();
    
    // Add some additional event listeners for progress tracking
    
    // Track quiz completion
    document.addEventListener('quizCompleted', () => {
        window.learningHub.trackQuizCompletion();
    });
    
    // Track carousel interaction
    document.addEventListener('click', (e) => {
        if (e.target.closest('.carousel-btn') || e.target.closest('.indicator')) {
            window.learningHub.trackCarouselInteraction();
        }
    });
    
    // Track API usage
    document.addEventListener('click', (e) => {
        if (e.target.id && e.target.id.includes('fetch-')) {
            window.learningHub.trackAPIUsage();
        }
    });
    
    // Add welcome message
    setTimeout(() => {
        if (!localStorage.getItem('welcomeShown')) {
            const welcome = document.createElement('div');
            welcome.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                text-align: center;
                max-width: 400px;
            `;
            
            welcome.innerHTML = `
                <h3 style="color: #764ba2; margin-bottom: 1rem;">Welcome to the Learning Hub! 🚀</h3>
                <p style="margin-bottom: 1.5rem;">Explore responsive design, interactive components, and API integration.</p>
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 1.5rem;">
                    💡 Use Alt+1,2,3,4 for quick navigation<br>
                    💡 Your progress is automatically saved
                </p>
                <button class="btn btn-primary" onclick="this.parentElement.remove(); localStorage.setItem('welcomeShown', 'true')">
                    Let's Start Learning!
                </button>
            `;
            
            document.body.appendChild(welcome);
        }
    }, 1000);
});

// Add dark mode styles
const darkModeStyles = `
    .dark-mode {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #ffffff;
        --text-secondary: #cccccc;
    }
    
    .dark-mode body {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        color: var(--text-primary);
    }
    
    .dark-mode .main-nav {
        background: rgba(45, 45, 45, 0.95);
    }
    
    .dark-mode .nav-title,
    .dark-mode .nav-link {
        color: var(--text-primary);
    }
    
    .dark-mode .project-section {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
    
    .dark-mode .quiz-container,
    .dark-mode .api-result-card {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
`;

// Inject dark mode styles
const styleSheet = document.createElement('style');
styleSheet.textContent = darkModeStyles;
document.head.appendChild(styleSheet);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningHub;
}
