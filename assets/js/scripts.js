document.addEventListener("DOMContentLoaded", () => {

    // --- ROUTING (Single Page Application Logic) ---
    const navLinks = document.querySelectorAll('.main-nav a, .nav-submit-btn, .hero-actions a, .logo');
    const pages = document.querySelectorAll('.page');

    function navigate() {
        let hash = window.location.hash || '#home';
        
        // Handle hash to page ID mapping
        const targetPageId = `page-${hash.replace('#', '')}`;
        const targetPage = document.getElementById(targetPageId);

        if (targetPage) {
            // Hide all pages
            pages.forEach(p => p.classList.remove('active'));
            // Show target page
            targetPage.classList.add('active');
            
            // Update active state in nav
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === hash) {
                    link.classList.add('active-link');
                }
            });

            window.scrollTo(0, 0);

            // Re-trigger GSAP animations if present
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => ScrollTrigger.refresh(), 100);
                initPageAnimations(hash);
            }
        } else {
            // Fallback to home if page not found
            window.location.hash = '#home';
        }
    }

    window.addEventListener('hashchange', navigate);
    
    // --- GSAP ANIMATIONS ---
    function initPageAnimations(hash) {
        if (typeof gsap === 'undefined') return;

        if (hash === '#home' || hash === '') {
            // Hero Text Stagger Animation
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

        if (hash === '#dashboard') {
            gsap.fromTo(".deploy-form",
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
            gsap.fromTo(".active-incubations li",
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
            );
        }
        
        if (hash === '#terminal') {
            gsap.fromTo(".terminal-window",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" }
            );
        }
    }

    // Global Scroll Animations (run once)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Marquee Animation
        const marqueeContent = document.querySelector(".marquee-content");
        if (marqueeContent) {
            const clone = marqueeContent.innerHTML;
            marqueeContent.innerHTML += clone;
            
            gsap.to(".marquee-content", {
                xPercent: -50,
                ease: "none",
                duration: 20,
                repeat: -1
            });
        }

        // Reveal Sections on Scroll (Global)
        const revealSections = document.querySelectorAll(".reveal-section");
        revealSections.forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });

        // Stagger Feature Cards on Scroll
        const featureGrids = document.querySelectorAll(".features-grid");
        featureGrids.forEach(grid => {
            const cards = grid.querySelectorAll(".feature-card");
            if(cards.length > 0) {
                gsap.from(cards, {
                    scrollTrigger: {
                        trigger: grid,
                        start: "top 80%",
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power2.out"
                });
            }
        });
    }

    // --- BOUNTY SLIDER LOGIC ---
    const bountySlider = document.getElementById('bounty');
    const bountyVal = document.querySelector('.bounty-val');
    if(bountySlider && bountyVal) {
        bountySlider.addEventListener('input', (e) => {
            bountyVal.textContent = `${e.target.value} Cycles`;
        });
    }

    // Initial Load Navigation
    navigate();
});
