document.addEventListener("DOMContentLoaded", () => {

    // --- MOBILE MENU TOGGLE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if(menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }

    // --- ROUTING (Single Page Application Logic) ---
    const navLinks = document.querySelectorAll('.main-nav a, .nav-submit-btn, .hero-actions a, .logo, .footer-links a, .docs-nav a');
    const pages = document.querySelectorAll('.page');

    function navigate() {
        let fullHash = window.location.hash || '#home';
        let baseHash = fullHash;
        
        // Close mobile menu on navigate
        if(mainNav) mainNav.classList.remove('open');
        
        // Handle sub-routing (e.g., #docs-api)
        if(fullHash.includes('-') && document.getElementById(`page-${fullHash.split('-')[0].replace('#', '')}`)) {
            baseHash = fullHash.split('-')[0];
        }

        const targetPageId = `page-${baseHash.replace('#', '')}`;
        const targetPage = document.getElementById(targetPageId);

        if (targetPage) {
            // Hide all pages
            pages.forEach(p => p.classList.remove('active'));
            // Show target page
            targetPage.classList.add('active');
            
            // Update active state in nav
            document.querySelectorAll('.main-nav a').forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === baseHash) {
                    link.classList.add('active-link');
                }
            });

            // Scroll handling
            if(fullHash !== baseHash) {
                const subTarget = document.getElementById(fullHash.replace('#', ''));
                if(subTarget) {
                    setTimeout(() => subTarget.scrollIntoView({ behavior: 'smooth' }), 50);
                }
            } else {
                window.scrollTo(0, 0);
            }

            // Re-trigger GSAP animations robustly
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => {
                    ScrollTrigger.refresh();
                    initScrollAnimations();
                    initPageAnimations(baseHash);
                }, 50);
            }
        } else {
            window.location.hash = '#home';
        }
    }

    window.addEventListener('hashchange', navigate);
    
    // --- GSAP ANIMATIONS ---
    function initPageAnimations(hash) {
        if (typeof gsap === 'undefined') return;

        if (hash === '#home' || hash === '') {
            if(document.querySelector(".hero-title .block")) {
                gsap.fromTo(".hero-title .block", 
                    { y: 100, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.1, clearProps: "all" }
                );
                gsap.fromTo(".hero-subtitle, .hero-actions",
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5, clearProps: "all" }
                );
                gsap.fromTo(".hero-media img",
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.3, clearProps: "all" }
                );
            }
        }

        if (hash === '#dashboard') {
            if(document.querySelector(".deploy-form")) {
                gsap.fromTo(".deploy-form",
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" }
                );
                gsap.fromTo(".active-incubations li",
                    { x: 50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out", clearProps: "all" }
                );
            }
        }
        
        if (hash === '#terminal') {
            if(document.querySelector(".terminal-window")) {
                gsap.fromTo(".terminal-window",
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: "power4.out", clearProps: "all" }
                );
            }
        }
    }

    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        
        // Kill existing triggers to avoid overlap on SPA navigation
        ScrollTrigger.getAll().forEach(t => t.kill());

        const revealSections = document.querySelectorAll(".page.active .reveal-section");
        revealSections.forEach(section => {
            gsap.fromTo(section, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out"
                }
            );
        });

        const featureGrids = document.querySelectorAll(".page.active .features-grid");
        featureGrids.forEach(grid => {
            const cards = grid.querySelectorAll(".feature-card");
            if(cards.length > 0) {
                gsap.fromTo(cards, 
                    { y: 40, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: grid,
                            start: "top 85%",
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: "power2.out"
                    }
                );
            }
        });
    }

    // Global Scroll Animations (run once)
    if (typeof gsap !== 'undefined') {
        const marqueeContent = document.querySelector(".marquee-content");
        if (marqueeContent && !marqueeContent.dataset.initialized) {
            const clone = marqueeContent.innerHTML;
            marqueeContent.innerHTML += clone;
            marqueeContent.dataset.initialized = 'true';
            
            gsap.to(".marquee-content", {
                xPercent: -50,
                ease: "none",
                duration: 20,
                repeat: -1
            });
        }
    }

    // --- BOUNTY SLIDER LOGIC ---
    const bountySlider = document.getElementById('bounty');
    const bountyVal = document.querySelector('.bounty-val');
    if(bountySlider && bountyVal) {
        bountySlider.addEventListener('input', (e) => {
            bountyVal.textContent = `${e.target.value} Cycles`;
        });
    }

    // --- TERMINAL INTERACTION ---
    const termInput = document.querySelector('.terminal-input');
    const logStream = document.querySelector('.log-stream');
    if(termInput && logStream) {
        termInput.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                const val = termInput.value.trim();
                if(val) {
                    const userCommand = document.createElement('p');
                    userCommand.textContent = `> ${val}`;
                    logStream.appendChild(userCommand);
                    
                    const response = document.createElement('p');
                    response.className = 'success';
                    
                    switch(val.toLowerCase()) {
                        case 'help':
                            response.textContent = "> AVAILABLE COMMANDS: status, nodes, clear, hack";
                            break;
                        case 'status':
                            response.textContent = "> SYSTEM OPTIMAL. META SHIFT IMMINENT.";
                            break;
                        case 'nodes':
                            response.textContent = "> 1,402 ACTIVE NODES IN POOL.";
                            break;
                        case 'clear':
                            logStream.innerHTML = '';
                            response.textContent = "";
                            break;
                        case 'hack':
                            response.textContent = "> ACCESS DENIED. INITIATING COUNTERMEASURES.";
                            response.style.color = 'red';
                            response.classList.remove('success');
                            break;
                        default:
                            response.textContent = "> COMMAND NOT RECOGNIZED. TYPE 'help'.";
                            response.classList.remove('success');
                            break;
                    }
                    
                    if(response.textContent) logStream.appendChild(response);
                }
                termInput.value = '';
                const terminalBody = document.querySelector('.terminal-body');
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }

    // Initial Load Navigation
    navigate();
});
