// Main JavaScript for Portfolio Website (Flip Animation & AI Assistant)
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Portfolio Website Loaded');
    initializeWebsite();
});

// Global variables
let flipInterval;
let isFlipping = true;
let userHasInteracted = false;

// Initialize website functionality
function initializeWebsite() {
    startFlipAnimation();
    setupAnimations();
    setupAIAssistant();
    initializeDateTime();
    initializeQuotes();
    initNetBackground();
}

// Restart Vanta background if page becomes visible again
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        if (!window.vantaEffect) {
            initNetBackground();
        }
    }
});


function initNetBackground() {
    window.vantaEffect = VANTA.NET({
        el: "#vantajs-net",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundAlpha: 0.0, // transparent so your content shows
        color: 0x74b9ff,      // net line color
        points: 12.00,        // number of points
        maxDistance: 20.00,   // distance between points
        spacing: 15.00        // spacing of grid
    });
}

// Date Time Functionality
function initializeDateTime() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const dateTimeString = now.toLocaleDateString('en-US', options);
    
    const mainDateTime = document.getElementById('current-datetime');
    const aiDateTime = document.getElementById('ai-current-datetime');
    
    if (mainDateTime) mainDateTime.textContent = dateTimeString;
    if (aiDateTime) aiDateTime.textContent = dateTimeString;
}

// Quote Functionality
function initializeQuotes() {
    const quotes = [
        { text: "Security is not a product, but a process", author: "Bruce Schneier" },
        { text: "The best way to predict the future is to invent it", author: "Alan Kay" },
        { text: "Code is poetry written in logic", author: "Unknown" },
        { text: "First, solve the problem. Then, write the code", author: "John Johnson" },
        { text: "Any fool can write code that a computer can understand", author: "Martin Fowler" },
        { text: "Programming is not about typing, it's about thinking", author: "Rich Hickey" }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const aiRandomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    const mainQuote = document.getElementById('daily-quote');
    const aiQuote = document.getElementById('ai-daily-quote');
    
    if (mainQuote) {
        mainQuote.textContent = randomQuote.text;
        mainQuote.nextElementSibling.textContent = `- ${randomQuote.author}`;
    }
    
    if (aiQuote) {
        aiQuote.textContent = aiRandomQuote.text;
        aiQuote.nextElementSibling.textContent = `- ${aiRandomQuote.author}`;
    }
}

// Start automatic flip animation
function startFlipAnimation() {
    const flipContainer = document.getElementById('flip-container');
    let isShowingFront = true;
    
    // Start flipping every 4 seconds
    flipInterval = setInterval(() => {
        if (!userHasInteracted) {
            if (isShowingFront) {
                flipContainer.classList.remove('show-front');
                flipContainer.classList.add('show-back');
                isShowingFront = false;
            } else {
                flipContainer.classList.remove('show-back');
                flipContainer.classList.add('show-front');
                isShowingFront = true;
            }
        }
    }, 4000);
    
    // Initially show front
    flipContainer.classList.add('show-front');
}

// Stop flip animation when user interacts
function stopFlipAnimation() {
    if (flipInterval) {
        clearInterval(flipInterval);
        flipInterval = null;
    }
    
    userHasInteracted = true;
    
    const flipContainer = document.getElementById('flip-container');
    flipContainer.classList.remove('show-front');
    flipContainer.classList.add('show-back');
    
    // Focus on the input after stopping flip
    setTimeout(() => {
        const userInput = document.getElementById('user-input');
        if (userInput) {
            userInput.focus();
        }
    }, 800);
}

// Setup AI Assistant functionality
function setupAIAssistant() {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickBtns = document.querySelectorAll('.quick-btn');

    if (userInput && sendBtn) {
        // Stop flipping when user starts typing
        userInput.addEventListener('input', function() {
            if (!userHasInteracted && this.value.trim()) {
                stopFlipAnimation();
            }
            toggleSendButton();
        });

        userInput.addEventListener('focus', function() {
            if (!userHasInteracted) {
                stopFlipAnimation();
            }
        });

        // Send message events
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keydown', handleKeyDown);

        // Auto-resize textarea
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    // Quick action buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!userHasInteracted) {
                stopFlipAnimation();
            }
            const question = btn.getAttribute('data-question');
            sendQuickMessage(question);
        });
    });
}

// Handle keyboard input
function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Toggle send button state
function toggleSendButton() {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (sendBtn) {
        sendBtn.disabled = !userInput.value.trim();
    }
}

// Send quick message
function sendQuickMessage(message) {
    const userInput = document.getElementById('user-input');
    userInput.value = message;
    sendMessage();
}

// Send message function
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    toggleSendButton();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        hideTypingIndicator();
        addMessage(response, 'ai');
    }, 1000 + Math.random() * 1500);
}

// Add message to chat
function addMessage(content, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'ai' ? '🤖' : '👤';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <span class="ai-icon">${avatar}</span>
        </div>
        <div class="message-content">
            <p>${content}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Force scroll to bottom with a slight delay
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        // Also scroll the main chat container if needed
        const chatContainer = document.querySelector('.flip-side.back .chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, 100);
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.classList.remove('hidden');
        
        // Force scroll to bottom when typing indicator appears
        setTimeout(() => {
            const chatMessages = document.getElementById('chat-messages');
            const chatContainer = document.querySelector('.flip-side.back .chat-container');
            
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 50);
    }
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.classList.add('hidden');
    }
}

// Setup general animations
function setupAnimations() {
    // Animate intro elements on load
    animateIntroElements();
}

// Animate intro elements
function animateIntroElements() {
    const introTitle = document.querySelector('.intro-title');
    const introSubtitle = document.querySelector('.intro-subtitle');
    const introFeatures = document.querySelector('.intro-features');
    
    if (introTitle) {
        setTimeout(() => {
            introTitle.classList.add('fade-in');
        }, 300);
    }
    
    if (introSubtitle) {
        setTimeout(() => {
            introSubtitle.classList.add('fade-in');
        }, 600);
    }
    
    if (introFeatures) {
        setTimeout(() => {
            introFeatures.classList.add('fade-in');
        }, 900);
    }
}

// Simple AI response generator (basic version)
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for portfolio-related keywords
    if (message.includes('skill') || message.includes('technology') || message.includes('tech')) {
        return `🚀 Tech arsenal locked & loaded!<br><br>
            Core Powers: Scripting 🖋️ | Problem Solving 🧩 | Analytical Thinking 🔍 | Threat Intelligence 🛡️ | Attention to Detail 🎯<br><br>

            Code & Tools: Python 🐍 | TensorFlow 🧠 | Scikit-learn 📊 | NLP 💬 | Flask ⚙️ | SQL 🗄️<br><br>

            Cyber Mastery: Penetration Testing 💥 | Ethical Hacking 🕵️‍♂️ | Network Forensics 🛰️ | Cryptography 🔐 | AI-Powered Threat Detection 🤖`;
    }
    
    if (message.includes('experience') || message.includes('work') || message.includes('job')) {
        return `💼 Experience<br><br>
                📂 Penetration Testing Intern – Hacktify Cyber Security (Feb 2024 – Mar 2024)<br>
                    • Discovered & reported XSS, SQLi, and IDOR flaws <br>
                    • Fixed CORS & CSRF vulnerabilities to boost resilience<br>
                    • Deep-dived into ethical hacking, network forensics & cryptography on hands-on labs`;
                `<br>📂 SOFTWARE ENGINEER — Odoo India Pvt. Ltd. — (Dec 2025– Jun 2026)<br>
                    • Contributed to Odoo product quality by investigating complex issues across Accounting, Sales, Inventory, and Industry applications.<br>
                    • Delivered 2+ upstream contributions to Odoo core, including bug fixes, and upgrade scripts.<br>
                    • Worked extensively with Python, PostgreSQL, XML, and JavaScript to diagnose defects and support customer escalations.`;
    }
    
    if (message.includes('project') || message.includes('portfolio')) {
        return `🚀 Projects<br><br>
                    1️⃣ OneStop Hospital 🏥<br>
                    AI-driven disease prediction with real-time patient data protection<br>
                    Chatbot doctor 🩺 for instant health answers + home remedy suggestions<br>
                    Powered by: Python | TensorFlow | Scikit-learn | NLP | Flask | SQL<br><br>

                    2️⃣ Algo Trading System with ML & Automation 📈<br>
                    Hybrid strategy: RSI + Moving Average crossover + Random Forest AI (53% win rate)<br>
                    Fully automated: Fetch ➡️ Signal ➡️ Backtest ➡️ Log ➡️ Alert (via Telegram)<br>
                    Ready for future: Sentiment & news-based trading expansion`;
    }
    
    if (message.includes('education') || message.includes('study') || message.includes('degree')) {
        return `🎓 Education<br><br>
                •B.Tech (Computer Engineering) – Charusat University, Changa | CGPA: 7.80 <br>
                •Diploma (Computer Engineering) – Govt. Polytechnic, Gandhinagar | CGPA: 9.10`;
    }
    
    if (message.includes('contact') || message.includes('reach') || message.includes('email')) {
        return `📞 Contact<br><br>
                📡 Let’s connect, collaborate, or conquer!<br>
                📱 +91 88662 83517<br>
                📧 dhrudeepvaghashiya0721@gmail.com<br>
                💼 LinkedIn<br>
                💻 GitHub<br>
                I'm always open to discussing new opportunities, collaborations, or just having a tech chat!`;
    }
    
    if (message.includes('certification') || message.includes('certified')) {
        return `🏆 Certifications<br><br>
                🎖️ Badges earned, skills unlocked!<br>
                    • Harvard University – CS50's CS for Business Professionals 🎓<br>
                    • JAYSO Foundation – AI Voice Box Program 🎤<br>
                    • TATASTRIVE – Cybersecurity Training 🛡️<br>
                    • Coursera – Google Cybersecurity 🌐<br>
                    • Code Unnati - Advance Course 🎓<br>
                    • Coursera - Data Analytics 📊<br>
                    • Coursera - Fundamentals of Red Hat Enterprise Linux 9 🎩<br>\
                    • CVM Unniversity - CVM University Hackathon 2025🎓<br>
                    • TATA - Cybersecurity Analyst Job Simulation🔍<br>
                    • Deloitte - Cyber Job Simulation💼`;
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! 👋 I'm excited to tell you about my portfolio. What would you like to explore - my skills, experience, projects, or something else?";
    }
    
    if (message.includes('about') || message.includes('who') || message.includes('yourself')) {
        return `👨‍💻 I’m Dhrudeep Vaghasiya, a Cybersecurity & AI Technologist passionate about securing systems and building smart solutions.
        With hands-on expertise in penetration testing, AI-driven threat detection, and secure system design, I craft innovative digital defenses that actually work in the wild.
        From AI-powered healthcare platforms to automated trading systems, I love turning ideas into impactful, scalable tech.
        What would you like to explore — my projects, skills, or hackathon wins?`;
    }
    
    // Default response for off-topic questions
    return "I don't know all this, I only know about this portfolio only. Please ask me about my skills, experience, projects, education, certifications, or how to contact me.";
}

// Utility functions
function showPage(pageId) {
    // This function is kept for compatibility but not used in flip version
}

function addLoadingState(element) {
    if (element) {
        element.style.opacity = '0.7';
        element.style.pointerEvents = 'none';
    }
}

function removeLoadingState(element) {
    if (element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
}

// Add dynamic styles
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .hidden {
            display: none !important;
        }
        
        /* Smooth transitions for flip animation */
        .flip-container {
            transition: transform 0.8s ease-in-out;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Portfolio error:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
    console.log('Portfolio fully loaded');
    addDynamicStyles();
});

// Cleanup when page unloads
window.addEventListener('beforeunload', function() {
    if (flipInterval) {
        clearInterval(flipInterval);
    }
});

// Navigation helper (for compatibility)
window.portfolioNav = {
    goToAssistant: () => {
        if (!userHasInteracted) {
            stopFlipAnimation();
        }
    },
    goToPortfolio: () => console.log('Portfolio is integrated in flip view'),
    goToHome: () => location.reload()
};
