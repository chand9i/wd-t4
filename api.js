// API Data Fetching Module
class APIFetcher {
    constructor() {
        this.apiEndpoints = {
            jokes: 'https://official-joke-api.appspot.com/random_joke',
            weather: 'https://api.openweathermap.org/data/2.5/weather',
            quotes: 'https://api.quotable.io/random',
            facts: 'https://uselessfacts.jsph.pl/random.json?language=en',
            advice: 'https://api.adviceslip.com/advice'
        };
        
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        // Button elements
        this.jokeBtn = document.getElementById('fetch-joke-btn');
        this.weatherBtn = document.getElementById('fetch-weather-btn');
        this.quoteBtn = document.getElementById('fetch-quote-btn');
        
        // Container elements
        this.jokeContainer = document.getElementById('joke-container');
        this.weatherContainer = document.getElementById('weather-container');
        this.quoteContainer = document.getElementById('quote-container');
        this.loadingIndicator = document.getElementById('loading-indicator');
        
        // Text elements
        this.jokeText = document.getElementById('joke-text');
        this.weatherText = document.getElementById('weather-text');
        this.quoteText = document.getElementById('quote-text');
        this.quoteAuthor = document.getElementById('quote-author');
    }
    
    bindEvents() {
        if (this.jokeBtn) {
            this.jokeBtn.addEventListener('click', () => this.fetchJoke());
        }
        
        if (this.weatherBtn) {
            this.weatherBtn.addEventListener('click', () => this.fetchWeather());
        }
        
        if (this.quoteBtn) {
            this.quoteBtn.addEventListener('click', () => this.fetchQuote());
        }
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.fetchJoke();
                        break;
                    case '2':
                        e.preventDefault();
                        this.fetchWeather();
                        break;
                    case '3':
                        e.preventDefault();
                        this.fetchQuote();
                        break;
                }
            }
        });
    }
    
    // Generic fetch method with error handling and caching
    async fetchData(url, cacheKey = null, options = {}) {
        try {
            // Check cache first
            if (cacheKey && this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout) {
                    return cached.data;
                }
            }
            
            this.showLoading();
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the result
            if (cacheKey) {
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now()
                });
            }
            
            return data;
            
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        } finally {
            this.hideLoading();
        }
    }
    
    async fetchJoke() {
        try {
            const data = await this.fetchData(this.apiEndpoints.jokes, 'joke');
            
            if (data && data.setup && data.punchline) {
                this.jokeText.innerHTML = `
                    <strong>Q:</strong> ${data.setup}<br>
                    <strong>A:</strong> ${data.punchline}
                `;
            } else {
                // Fallback jokes if API fails
                const fallbackJokes = [
                    { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
                    { setup: "Why did the CSS developer quit?", punchline: "Because they didn't like the style!" },
                    { setup: "How do you comfort a JavaScript bug?", punchline: "You console it!" }
                ];
                const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
                this.jokeText.innerHTML = `
                    <strong>Q:</strong> ${randomJoke.setup}<br>
                    <strong>A:</strong> ${randomJoke.punchline}
                `;
            }
            
            this.showContainer(this.jokeContainer);
            
        } catch (error) {
            this.showError('Failed to fetch joke. Please try again!', this.jokeContainer, this.jokeText);
        }
    }
    
    async fetchWeather() {
        try {
            // Since we can't use a real API key in this demo, we'll simulate weather data
            await this.delay(1000); // Simulate API delay
            
            const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Berlin'];
            const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear'];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            const randomTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C
            
            const simulatedWeather = {
                name: randomCity,
                weather: [{ description: randomCondition }],
                main: { temp: randomTemp, feels_like: randomTemp + Math.floor(Math.random() * 5) - 2 }
            };
            
            this.weatherText.innerHTML = `
                <strong>Location:</strong> ${simulatedWeather.name}<br>
                <strong>Temperature:</strong> ${simulatedWeather.main.temp}°C<br>
                <strong>Feels like:</strong> ${simulatedWeather.main.feels_like}°C<br>
                <strong>Condition:</strong> ${simulatedWeather.weather[0].description}
            `;
            
            this.showContainer(this.weatherContainer);
            
        } catch (error) {
            this.showError('Failed to fetch weather data. Please try again!', this.weatherContainer, this.weatherText);
        }
    }
    
    async fetchQuote() {
        try {
            const data = await this.fetchData(this.apiEndpoints.quotes, 'quote');
            
            if (data && data.content && data.author) {
                this.quoteText.textContent = `"${data.content}"`;
                this.quoteAuthor.textContent = `— ${data.author}`;
            } else {
                // Fallback quotes if API fails
                const fallbackQuotes = [
                    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                    { content: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
                    { content: "First, solve the problem. Then, write the code.", author: "John Johnson" }
                ];
                const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
                this.quoteText.textContent = `"${randomQuote.content}"`;
                this.quoteAuthor.textContent = `— ${randomQuote.author}`;
            }
            
            this.showContainer(this.quoteContainer);
            
        } catch (error) {
            this.showError('Failed to fetch quote. Please try again!', this.quoteContainer, this.quoteText);
        }
    }
    
    // Utility methods
    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'block';
        }
        
        // Disable all buttons during loading
        const buttons = [this.jokeBtn, this.weatherBtn, this.quoteBtn];
        buttons.forEach(btn => {
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            }
        });
    }
    
    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
        
        // Re-enable all buttons
        const buttons = [this.jokeBtn, this.weatherBtn, this.quoteBtn];
        buttons.forEach(btn => {
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        });
    }
    
    showContainer(container) {
        // Hide all other containers
        const containers = [this.jokeContainer, this.weatherContainer, this.quoteContainer];
        containers.forEach(c => {
            if (c && c !== container) {
                c.style.display = 'none';
            }
        });
        
        // Show the target container with animation
        if (container) {
            container.style.display = 'block';
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.3s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    showError(message, container, textElement) {
        if (textElement) {
            textElement.innerHTML = `<span style="color: #dc3545;">❌ ${message}</span>`;
        }
        this.showContainer(container);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Clear cache method
    clearCache() {
        this.cache.clear();
    }
    
    // Get cache info
    getCacheInfo() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            timeout: this.cacheTimeout
        };
    }
}

// Advanced API Features
class AdvancedAPIFetcher extends APIFetcher {
    constructor() {
        super();
        this.requestQueue = [];
        this.maxConcurrentRequests = 3;
        this.activeRequests = 0;
    }
    
    // Queue management for multiple API calls
    async queueRequest(requestFunction) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ requestFunction, resolve, reject });
            this.processQueue();
        });
    }
    
    async processQueue() {
        if (this.activeRequests >= this.maxConcurrentRequests || this.requestQueue.length === 0) {
            return;
        }
        
        this.activeRequests++;
        const { requestFunction, resolve, reject } = this.requestQueue.shift();
        
        try {
            const result = await requestFunction();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.activeRequests--;
            this.processQueue(); // Process next request in queue
        }
    }
    
    // Batch fetch multiple APIs
    async fetchMultiple(apis) {
        const promises = apis.map(api => {
            return this.queueRequest(() => this.fetchData(api.url, api.cacheKey, api.options));
        });
        
        try {
            const results = await Promise.allSettled(promises);
            return results.map((result, index) => ({
                api: apis[index],
                status: result.status,
                data: result.status === 'fulfilled' ? result.value : null,
                error: result.status === 'rejected' ? result.reason : null
            }));
        } catch (error) {
            console.error('Batch fetch error:', error);
            throw error;
        }
    }
    
    // Real-time data updates
    startRealTimeUpdates(apiKey, interval = 30000) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(async () => {
            try {
                await this.fetchQuote(); // Update quote every interval
            } catch (error) {
                console.error('Real-time update error:', error);
            }
        }, interval);
    }
    
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Initialize API fetcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.apiFetcher = new AdvancedAPIFetcher();
    
    // Add some demo functionality
    const demoBtn = document.createElement('button');
    demoBtn.className = 'btn btn-accent';
    demoBtn.textContent = 'Fetch All Data';
    demoBtn.style.marginTop = '1rem';
    
    const apiControls = document.querySelector('.api-controls');
    if (apiControls) {
        apiControls.appendChild(demoBtn);
        
        demoBtn.addEventListener('click', async () => {
            try {
                // Demonstrate batch fetching
                await Promise.all([
                    window.apiFetcher.fetchJoke(),
                    window.apiFetcher.fetchWeather(),
                    window.apiFetcher.fetchQuote()
                ]);
            } catch (error) {
                console.error('Batch fetch error:', error);
            }
        });
    }
    
    // Add cache info display
    const cacheBtn = document.createElement('button');
    cacheBtn.className = 'btn btn-secondary';
    cacheBtn.textContent = 'Cache Info';
    cacheBtn.style.marginTop = '0.5rem';
    cacheBtn.style.fontSize = '0.8rem';
    
    if (apiControls) {
        apiControls.appendChild(cacheBtn);
        
        cacheBtn.addEventListener('click', () => {
            const cacheInfo = window.apiFetcher.getCacheInfo();
            alert(`Cache Info:\nSize: ${cacheInfo.size} items\nKeys: ${cacheInfo.keys.join(', ')}\nTimeout: ${cacheInfo.timeout / 1000}s`);
        });
    }
    
    // Add clear cache button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-secondary';
    clearBtn.textContent = 'Clear Cache';
    clearBtn.style.marginTop = '0.5rem';
    clearBtn.style.fontSize = '0.8rem';
    
    if (apiControls) {
        apiControls.appendChild(clearBtn);
        
        clearBtn.addEventListener('click', () => {
            window.apiFetcher.clearCache();
            alert('Cache cleared!');
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIFetcher, AdvancedAPIFetcher };
}
