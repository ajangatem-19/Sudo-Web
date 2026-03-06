Script.jas
// ============================================
// WAIT FOR DOM TO LOAD
// Ensures HTML is fully parsed before running scripts
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // GSAP PLUGIN REGISTRATION
    // ScrollTrigger allows animations based on scroll position
    // ============================================
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // CUSTOM CURSOR LOGIC
    // Makes two elements follow mouse with different speeds
    // ============================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only on devices with mouse (not touch)
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', function(e) {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot follows immediately
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Outline follows with delay (using Web Animations API)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { 
                duration: 500,      // 500ms delay creates trailing effect
                fill: "forwards"    // Maintains end position
            });
        });
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // Changes navbar appearance when scrolling down
    // ============================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // If scrolled more than 100px
        if (currentScroll > 100) {
            // Add background, blur, and shadow
            navbar.classList.add('bg-[#2C1810]/95', 'backdrop-blur-md', 'shadow-lg');
            navbar.classList.remove('py-6');
            navbar.classList.add('py-4');  // Smaller padding
        } else {
            // Remove effects at top of page
            navbar.classList.remove('bg-[#2C1810]/95', 'backdrop-blur-md', 'shadow-lg');
            navbar.classList.remove('py-4');
            navbar.classList.add('py-6');
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // MOBILE MENU TOGGLE
    // Shows/hides mobile navigation
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;
    
    mobileMenuBtn.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            // Slide in from right (remove translate)
            mobileMenu.classList.remove('translate-x-full');
        } else {
            // Slide out to right
            mobileMenu.classList.add('translate-x-full');
        }
    });

    // ============================================
    // HERO ANIMATIONS (GSAP)
    // Entrance animations when page loads
    // ============================================
    
    // Zoom out hero image slightly
    gsap.to('#hero-image', {
        scale: 1,           // From 1.1 (in HTML) to 1
        duration: 2,
        ease: 'power2.out'
    });

    // Animate hero title
    gsap.from('#hero-title', {
        opacity: 0,
        y: 50,              // Start 50px below
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Animate subtitle
    gsap.from('#hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
    });

    // Animate buttons
    gsap.from('#hero-cta', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.9,
        ease: 'power3.out'
    });

    // ============================================
    // SCROLL-TRIGGERED ANIMATIONS
    // Elements animate when they enter viewport
    // ============================================
    
    // About image reveal
    ScrollTrigger.create({
        trigger: '#about-image',
        start: 'top 80%',    // When top of element hits 80% of viewport height
        onEnter: () => {
            document.querySelector('.image-reveal').classList.add('active');
        }
    });

    // Parallax effect on hero image (moves slower than scroll)
    gsap.to('#hero-image', {
        yPercent: 30,        // Moves down 30% of its height
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom top',
            scrub: true      // Smoothly follows scroll position
        }
    });

    // Animate creative cards with stagger
    gsap.utils.toArray('.card-hover').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            },
            y: 50,           // Start below
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,  // Each card delays 0.1s after previous
            ease: 'power3.out'
        });
    });

    // ============================================
    // MAGNETIC BUTTON EFFECT
    // Buttons move slightly toward cursor
    // ============================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            // Get button's position
            const rect = btn.getBoundingClientRect();
            // Calculate mouse position relative to button center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button 20% toward mouse (subtle effect)
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        // Reset position when mouse leaves
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();  // Prevent default jump
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',   // Smooth animation
                    block: 'start'        // Align to top
                });
                
                // Close mobile menu if open
                if (isMenuOpen) {
                    mobileMenu.classList.add('translate-x-full');
                    isMenuOpen = false;
                }
            }
        });
    });

    // ============================================
    // GALLERY HOVER INTERACTIONS
    // Dims other images when one is hovered
    // ============================================
    const galleryItems = document.querySelectorAll('#gallery-grid > div');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            galleryItems.forEach(other => {
                if (other !== item) {
                    other.style.opacity = '0.5';  // Dim others
                    other.style.transition = 'opacity 0.3s';
                }
            });
        });
        
        item.addEventListener('mouseleave', function() {
            galleryItems.forEach(other => {
                other.style.opacity = '1';  // Restore all
            });
        });
    });

    // ============================================
    // FORM HANDLING (Basic)
    // Prevents default form submission for demo
    // ============================================
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Thank you for subscribing! We\'ll be in touch soon.');
                this.reset();
            }
        });
    }

}); // End DOMContentLoaded