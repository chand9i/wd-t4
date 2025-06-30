// Interactive Image Carousel
class Carousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.inner = this.carousel.querySelector('.carousel-inner');
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.prevBtn = this.carousel.querySelector('.carousel-btn-prev');
        this.nextBtn = this.carousel.querySelector('.carousel-btn-next');
        this.indicators = this.carousel.querySelectorAll('.indicator');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCarousel();
        this.startAutoPlay();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.goToPrev());
        this.nextBtn.addEventListener('click', () => this.goToNext());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
    }
    
    goToNext() {
        if (this.isTransitioning) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToPrev() {
        if (this.isTransitioning) return;
        
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        
        this.currentSlide = slideIndex;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    updateCarousel() {
        this.isTransitioning = true;
        
        // Update slide position
        const translateX = -this.currentSlide * 100;
        this.inner.style.transform = `translateX(${translateX}%)`;
        
        // Update active slide class
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Add slide animation classes
        this.slides[this.currentSlide].classList.add('slide-in');
        
        // Remove transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
            this.slides.forEach(slide => slide.classList.remove('slide-in'));
        }, 500);
        
        // Trigger custom event
        this.carousel.dispatchEvent(new CustomEvent('slideChanged', {
            detail: { currentSlide: this.currentSlide, totalSlides: this.totalSlides }
        }));
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.goToNext();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.startAutoPlay();
    }
    
    handleKeyboard(e) {
        if (!this.carousel.matches(':hover')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.goToPrev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.goToNext();
                break;
            case ' ':
                e.preventDefault();
                if (this.autoPlayInterval) {
                    this.pauseAutoPlay();
                } else {
                    this.startAutoPlay();
                }
                break;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        const threshold = 50; // Minimum distance for swipe
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });
        
        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.goToNext();
                } else {
                    this.goToPrev();
                }
            }
            
            isDragging = false;
            this.startAutoPlay();
        });
        
        // Prevent context menu on long press
        this.carousel.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    // Public methods for external control
    play() {
        this.startAutoPlay();
    }
    
    pause() {
        this.pauseAutoPlay();
    }
    
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    setAutoPlayDelay(delay) {
        this.autoPlayDelay = delay;
        if (this.autoPlayInterval) {
            this.resetAutoPlay();
        }
    }
    
    // Add new slide dynamically
    addSlide(slideHTML) {
        const slideElement = document.createElement('div');
        slideElement.className = 'carousel-slide';
        slideElement.innerHTML = slideHTML;
        
        this.inner.appendChild(slideElement);
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        
        // Add new indicator
        const indicator = document.createElement('button');
        indicator.className = 'indicator';
        indicator.setAttribute('data-slide', this.totalSlides - 1);
        indicator.addEventListener('click', () => this.goToSlide(this.totalSlides - 1));
        
        const indicatorContainer = this.carousel.querySelector('.carousel-indicators');
        indicatorContainer.appendChild(indicator);
        this.indicators = this.carousel.querySelectorAll('.indicator');
    }
    
    // Remove slide
    removeSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        
        this.slides[index].remove();
        this.indicators[index].remove();
        
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.indicators = this.carousel.querySelectorAll('.indicator');
        this.totalSlides = this.slides.length;
        
        // Adjust current slide if necessary
        if (this.currentSlide >= this.totalSlides) {
            this.currentSlide = this.totalSlides - 1;
        }
        
        this.updateCarousel();
    }
}

// Enhanced Carousel with additional features
class EnhancedCarousel extends Carousel {
    constructor(selector) {
        super(selector);
        this.addEnhancements();
    }
    
    addEnhancements() {
        this.addProgressBar();
        this.addSlideCounter();
        this.addFullscreenMode();
    }
    
    addProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'carousel-progress';
        progressBar.innerHTML = '<div class="carousel-progress-fill"></div>';
        progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            overflow: hidden;
        `;
        
        const progressFill = progressBar.querySelector('.carousel-progress-fill');
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width ${this.autoPlayDelay}ms linear;
        `;
        
        this.carousel.appendChild(progressBar);
        this.progressFill = progressFill;
        
        // Update progress on slide change
        this.carousel.addEventListener('slideChanged', () => {
            this.updateProgress();
        });
        
        this.updateProgress();
    }
    
    updateProgress() {
        if (!this.progressFill) return;
        
        // Reset progress
        this.progressFill.style.width = '0%';
        
        // Start progress animation
        setTimeout(() => {
            this.progressFill.style.width = '100%';
        }, 100);
    }
    
    addSlideCounter() {
        const counter = document.createElement('div');
        counter.className = 'carousel-counter';
        counter.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
        `;
        
        this.carousel.appendChild(counter);
        this.counter = counter;
        
        this.carousel.addEventListener('slideChanged', () => {
            this.updateCounter();
        });
        
        this.updateCounter();
    }
    
    updateCounter() {
        if (!this.counter) return;
        this.counter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }
    
    addFullscreenMode() {
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'carousel-fullscreen-btn';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        
        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.carousel.appendChild(fullscreenBtn);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.carousel.requestFullscreen().catch(err => {
                console.log('Error entering fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main carousel with enhanced features
    window.mainCarousel = new EnhancedCarousel('.carousel');
    
    // Add event listeners for carousel events
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('slideChanged', (e) => {
            console.log(`Slide changed to: ${e.detail.currentSlide + 1}/${e.detail.totalSlides}`);
        });
        
        // Add play/pause button
        const playPauseBtn = document.createElement('button');
        playPauseBtn.className = 'carousel-play-pause';
        playPauseBtn.innerHTML = '⏸️';
        playPauseBtn.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        
        let isPlaying = true;
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                window.mainCarousel.pause();
                playPauseBtn.innerHTML = '▶️';
            } else {
                window.mainCarousel.play();
                playPauseBtn.innerHTML = '⏸️';
            }
            isPlaying = !isPlaying;
        });
        
        carousel.appendChild(playPauseBtn);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Carousel, EnhancedCarousel };
}
