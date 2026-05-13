document.addEventListener('DOMContentLoaded', () => {
    // --- HERO SLIDER ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 6000;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }

    // --- STICKY HEADER ---
    let lastScroll = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // scroll down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
            header.style.transform = 'translateY(-100%)';
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // scroll up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // --- FADE-UP ANIMATION ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // --- COLOR PICKER (Product Pages) ---
    const swatches = document.querySelectorAll('.swatch');
    const roofImage = document.getElementById('roof-image');
    
    if (swatches.length > 0 && roofImage) {
        swatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                const color = swatch.dataset.color;
                // In a real app, you'd change an image or SVG fill
                // For this demo, we'll change the background color of a placeholder
                roofImage.style.backgroundColor = color;
                
                // Update active state
                swatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            });
        });
    }

    // --- MOBILE MENU ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('is-active');
        });
    }

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
