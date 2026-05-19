// Reusable GSAP animation utilities
window.Animations = {
    fadeInUp: (element, delay = 0) => {
        gsap.fromTo(element, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, delay, ease: "power2.out" }
        );
    },
    
    pulseGlow: (element) => {
        gsap.to(element, {
            boxShadow: "0 0 15px rgba(0, 229, 255, 0.4)",
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
};
