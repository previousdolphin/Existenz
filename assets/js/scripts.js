document.addEventListener("DOMContentLoaded", () => {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        
        // Hero Text Stagger Animation
        gsap.from(".hero-title .block", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out",
            delay: 0.2
        });

        gsap.from(".hero-subtitle, .hero-actions", {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.8
        });

        gsap.from(".hero-media img", {
            scale: 0.9,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.5
        });

        // Marquee Animation
        const marqueeContent = document.querySelector(".marquee-content");
        if (marqueeContent) {
            // Duplicate content for seamless loop
            const clone = marqueeContent.innerHTML;
            marqueeContent.innerHTML += clone;
            
            gsap.to(".marquee-content", {
                xPercent: -50,
                ease: "none",
                duration: 20,
                repeat: -1
            });
        }

        // Reveal Sections on Scroll
        const revealSections = document.querySelectorAll(".reveal-section");
        
        revealSections.forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%", // Trigger when top of section hits 85% of viewport height
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

    } else {
        console.warn("GSAP or ScrollTrigger not loaded.");
    }
});