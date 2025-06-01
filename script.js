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
    
    // Active menu item based on scroll position with optimized performance
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.desktop-nav a, .nav-menu a');

    // Use Intersection Observer instead of scroll event for better performance
    if ('IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When section is visible
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const id = entry.target.getAttribute('id');
                    // Update navigation only when needed
                    navItems.forEach(item => {
                        if (item.getAttribute('href') === `#${id}`) {
                            if (!item.classList.contains('active')) {
                                navItems.forEach(navItem => {
                                    navItem.classList.remove('active');
                                    navItem.removeAttribute('aria-current');
                                });
                                item.classList.add('active');
                                item.setAttribute('aria-current', 'page');
                            }
                        }
                    });
                }
            });
        }, { threshold: [0.5], rootMargin: '-10% 0px -70% 0px' });
        
        // Observe all sections
        sections.forEach(section => navObserver.observe(section));
    } else {
        // Fallback to scroll event with throttling for older browsers
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    let current = '';
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop - headerHeight - 100;
                        const sectionHeight = section.offsetHeight;
                        const sectionId = section.getAttribute('id');
                        
                        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                            current = sectionId;
                        }
                    });
                    
                    navItems.forEach(item => {
                        item.classList.remove('active');
                        item.removeAttribute('aria-current');
                        if (item.getAttribute('href') === `#${current}`) {
                            item.classList.add('active');
                            item.setAttribute('aria-current', 'page');
                        }
                    });
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }
    
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
    
    // Preload important resources - optimized to avoid DOM manipulation
    function preloadResources() {
        // Font preloading moved to HTML with rel="preload" for better performance
        // Preload any dynamic resources that might be needed later
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                // Preload department page images when idle
                const departmentLinks = document.querySelectorAll('.department-card a');
                departmentLinks.forEach(link => {
                    const prefetcher = document.createElement('link');
                    prefetcher.rel = 'prefetch';
                    prefetcher.href = link.getAttribute('href');
                    document.head.appendChild(prefetcher);
                });
            });
        }
    }
    
    preloadResources();
    
    // Add smooth transition when page loads with performance metrics
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Performance metrics logging with modern Performance API
        if ('performance' in window) {
            // Use newer Performance API methods when available
            if (window.PerformanceObserver) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            // Only log important metrics
                            if (['largest-contentful-paint', 'first-input', 'layout-shift'].includes(entry.entryType)) {
                                console.log(`${entry.entryType}: `, entry);
                            }
                        });
                    });
                    
                    // Observe key performance metrics
                    observer.observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
                } catch (e) {
                    // Fallback to traditional metrics
                    setTimeout(function() {
                        if (window.performance.timing) {
                            const timing = window.performance.timing;
                            const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                            console.log('Page load time: ' + pageLoadTime + 'ms');
                        }
                    }, 0);
                }
            }
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
