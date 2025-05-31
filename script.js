// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileMenuWrapper = document.querySelector('.mobile-menu-wrapper');
    const body = document.body;
    
    // Function to open mobile menu
    function openMobileMenu() {
        navMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        body.style.overflow = 'hidden';
    }
    
    // Function to close mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        body.style.overflow = '';
    }
    
    // Toggle menu when clicking on menu button
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    
    // Close mobile menu when clicking on overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Smooth scrolling for navigation links with performance optimization
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add keyboard navigation for accessibility
    smoothScrollLinks.forEach(link => {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.addEventListener('keydown', function(e) {
            // Execute on Enter or Space key
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Active menu item based on scroll position with performance optimization
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.desktop-nav a, .nav-menu a');
    
    // Use requestAnimationFrame for better scroll performance
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                let current = '';
                const headerHeight = document.querySelector('header').offsetHeight;
                const scrollPosition = window.pageYOffset;
                
                sections.forEach(section => {
                    if (!section.id) return;
                    const sectionTop = section.offsetTop - headerHeight - 100;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    const href = item.getAttribute('href');
                    if (href === `#${current}`) {
                        item.classList.add('active');
                        // Add ARIA attributes for accessibility
                        item.setAttribute('aria-current', 'page');
                    } else {
                        item.removeAttribute('aria-current');
                    }
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
    
    // Form submission handling with accessibility improvements
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        // Add form validation attributes
        const requiredInputs = contactForm.querySelectorAll('input[required], textarea[required]');
        requiredInputs.forEach(input => {
            input.setAttribute('aria-required', 'true');
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            let isValid = true;
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    // Add accessible error message
                    const errorId = `error-${input.id || Math.random().toString(36).substring(2, 9)}`;
                    let errorMsg = input.nextElementSibling;
                    
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.id = errorId;
                        errorMsg.classList.add('error-message');
                        errorMsg.textContent = 'هذا الحقل مطلوب';
                        input.parentNode.insertBefore(errorMsg, input.nextSibling);
                        input.setAttribute('aria-describedby', errorId);
                    }
                } else {
                    input.classList.remove('error');
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (isValid) {
                // Here you would typically send the form data to a server
                // Create accessible success message
                const successMsg = document.createElement('div');
                successMsg.classList.add('success-message');
                successMsg.setAttribute('role', 'alert');
                successMsg.textContent = 'شكراً لتواصلك معنا! سيتم الرد عليك قريباً.';
                
                // Insert success message before the form
                contactForm.parentNode.insertBefore(successMsg, contactForm);
                
                // Reset form
                this.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            }
        });
        
        // Clear error state on input
        requiredInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            });
        });
    }
    
    // Add touch-friendly hover effects for mobile
    const touchElements = document.querySelectorAll('.department-card, .facility-item, .course-item, .career-item, .whatsapp-option');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-hover');
        }, {passive: true});
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-hover');
        }, {passive: true});
    });
    
    // Lazy loading images for better performance
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
            
            // Ensure all images have alt text for accessibility
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', '');
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading using Intersection Observer
        const lazyImages = document.querySelectorAll('img:not([src]):not([data-src])');
        lazyImages.forEach(img => {
            if (img.src) {
                img.dataset.src = img.src;
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
            }
        });
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }
    }
    
    // Preload important resources
    function preloadResources() {
        // Preload critical fonts
        const fontPreloads = [
            'https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&display=swap'
        ];
        
        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = font;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
    
    preloadResources();
    
    // Add smooth transition when page loads with performance metrics
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Performance metrics logging
        if (window.performance && window.performance.timing) {
            setTimeout(function() {
                const timing = window.performance.timing;
                const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                const domReadyTime = timing.domComplete - timing.domLoading;
                
                console.log('Page load time: ' + pageLoadTime + 'ms');
                console.log('DOM ready time: ' + domReadyTime + 'ms');
                
                // Send metrics to analytics if needed
                // analyticsService.sendMetric('pageLoadTime', pageLoadTime);
            }, 0);
        }
    });
    
    // Add accessibility improvements
    function enhanceAccessibility() {
        // Add appropriate ARIA roles
        const header = document.querySelector('header');
        if (header) header.setAttribute('role', 'banner');
        
        const main = document.querySelector('main') || document.querySelector('.hero');
        if (main) main.setAttribute('role', 'main');
        
        const footer = document.querySelector('footer');
        if (footer) footer.setAttribute('role', 'contentinfo');
        
        const nav = document.querySelector('nav');
        if (nav) nav.setAttribute('role', 'navigation');
        
        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('.btn, .department-card, .facility-item, .course-item, .career-item');
        interactiveElements.forEach(el => {
            if (!el.getAttribute('tabindex') && !el.tagName.match(/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/i)) {
                el.setAttribute('tabindex', '0');
            }
        });
    }
    
    enhanceAccessibility();
});
