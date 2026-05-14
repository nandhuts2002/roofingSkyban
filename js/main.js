document.addEventListener('DOMContentLoaded', () => {
    // --- TRANSPARENT TO SOLID HEADER ---
    const header = document.querySelector('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call on load to set initial state

    // --- STICKY HEADER ---
    window.addEventListener('scroll', () => {
        // Transparent class handled above
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

    // --- ROOFING LAYERS EXPLOSION LOGIC ---
    const wrapper = document.getElementById('explosion-wrapper');
    const layersSection = document.getElementById('roofing-layers-section');
    const layers = document.querySelectorAll('.layer');
    const labels = document.querySelectorAll('.label');
    const btnExplode = document.getElementById('btn-explode');
    const btnCollapse = document.getElementById('btn-collapse');

    if (wrapper && layersSection) {
        // Intersection Observer for auto-explode
        const explosionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    wrapper.classList.add('exploded');
                    setTimeout(updateExplosionLines, 600);
                    explosionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        explosionObserver.observe(layersSection);

        // Manual Controls
        if (btnExplode) {
            btnExplode.addEventListener('click', () => {
                wrapper.classList.add('exploded');
                setTimeout(updateExplosionLines, 600);
            });
        }

        if (btnCollapse) {
            btnCollapse.addEventListener('click', () => {
                wrapper.classList.remove('exploded');
            });
        }

        // Hover effects
        layers.forEach(layer => {
            layer.addEventListener('mouseenter', () => {
                const idx = layer.getAttribute('data-index');
                const label = document.querySelector(`.label-${idx}`);
                if (label) label.classList.add('highlight');
                layer.style.zIndex = "100";
            });
            layer.addEventListener('mouseleave', () => {
                labels.forEach(l => l.classList.remove('highlight'));
                layer.style.zIndex = "";
            });
        });

        // Function to draw/update connector lines
        function updateExplosionLines() {
            const wrapperRect = wrapper.getBoundingClientRect();
            
            layers.forEach((layer, i) => {
                const idx = i + 1;
                const layerRect = layer.getBoundingClientRect();
                const label = document.querySelector(`.label-${idx}`);
                if (!label) return;
                
                const labelRect = label.getBoundingClientRect();
                const path = document.querySelector(`.line-${idx}`);

                if (!path || !labelRect) return;

                // Start point: Right side of the layer wavy edge
                const startX = (layerRect.left + layerRect.width * 0.9) - wrapperRect.left;
                const startY = (layerRect.top + layerRect.height * 0.4) - wrapperRect.top;
                
                // End point: Left of the label
                const endX = labelRect.left - wrapperRect.left - 15;
                const endY = (labelRect.top + labelRect.height / 2) - wrapperRect.top;

                // Create a smooth cubic curve
                const cp1x = startX + (endX - startX) * 0.4;
                const cp2x = startX + (endX - startX) * 0.6;
                const d = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
                
                path.setAttribute('d', d);
                
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = wrapper.classList.contains('exploded') ? '0' : length;
            });
        }

        // Update on resize
        let explosionResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(explosionResizeTimer);
            explosionResizeTimer = setTimeout(() => {
                if (wrapper.classList.contains('exploded')) {
                    updateExplosionLines();
                }
            }, 100);
        });
    }

    // --- PREMIUM GALLERY SLIDER LOGIC ---
    const track = document.getElementById('gallery-track');
    const slides = Array.from(document.querySelectorAll('.gallery-slide'));
    const nextBtn = document.querySelector('.slider-nav-next');
    const prevBtn = document.querySelector('.slider-nav-prev');
    const dotsContainer = document.getElementById('gallery-dots');
    const filterBtns = document.querySelectorAll('.gallery-toggle-btn');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let filteredSlides = [...slides];

        // Initialize Dots
        function updateDots() {
            dotsContainer.innerHTML = '';
            filteredSlides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        function goToSlide(index) {
            if (index < 0) index = filteredSlides.length - 1;
            if (index >= filteredSlides.length) index = 0;
            
            currentIndex = index;
            
            // Update classes
            slides.forEach(s => s.classList.remove('active'));
            filteredSlides[currentIndex].classList.add('active');

            // Calculate offset
            const slideWidth = filteredSlides[0].offsetWidth;
            const gap = 20;
            const offset = (track.parentElement.offsetWidth / 2) - (slideWidth / 2);
            const translateX = offset - (currentIndex * (slideWidth + gap));
            
            track.style.transform = `translateX(${translateX}px)`;
            
            // Update dots
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        // Filter Logic
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter slides
                if (filter === 'all') {
                    filteredSlides = [...slides];
                } else {
                    filteredSlides = slides.filter(s => s.dataset.type === filter);
                }

                // Update track visibility
                slides.forEach(s => {
                    s.style.display = filteredSlides.includes(s) ? 'block' : 'none';
                });

                currentIndex = 0;
                updateDots();
                goToSlide(0);
            });
        });

        // Initial setup
        updateDots();
        // Wait for images to load to get correct widths
        window.addEventListener('load', () => goToSlide(0));
        // Also call immediately
        goToSlide(0);

        // Resize handler
        window.addEventListener('resize', () => goToSlide(currentIndex));
    }
});
