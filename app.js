/* -------------------------------------------------------------
   FHS Sistemas Eléctricos - Interactive Web Engine (JavaScript)
   Author: Expert Web Designer & Developer
   Version: 1.0.0
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Navigation & Scroll Effects
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Scroll listener to toggle compact navbar style
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link highlighting (Scrollspy)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for navbar height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 2. Mobile Menu (Hamburger Toggle)
    // ==========================================
    const burgerMenu = document.getElementById('burger-menu');
    const navLinksContainer = document.getElementById('nav-links');

    if (burgerMenu && navLinksContainer) {
        burgerMenu.addEventListener('click', () => {
            const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
            burgerMenu.setAttribute('aria-expanded', !isExpanded);
            burgerMenu.classList.toggle('mobile-active');
            navLinksContainer.classList.toggle('mobile-active');
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.setAttribute('aria-expanded', 'false');
                burgerMenu.classList.remove('mobile-active');
                navLinksContainer.classList.remove('mobile-active');
            });
        });
    }

    // ==========================================
    // 3. Modals System (Service Details)
    // ==========================================
    const modalTriggers = document.querySelectorAll('.open-modal');
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const contactRequirementField = document.getElementById('message');

    // Open Modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Close Modal helper
    const closeModal = (modalElement) => {
        modalElement.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Close modal via close button
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal'));
        });
    });

    // Close modal via clicking outside of modal-content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal via Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // Handle "Solicitar este Servicio" click inside Modal
    const modalActionButtons = document.querySelectorAll('.close-modal-action');
    modalActionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = btn.closest('.modal');
            const serviceTitle = modal.querySelector('h3').textContent;
            
            // Close modal
            closeModal(modal);
            
            // Prefill requirements field in contact form
            if (contactRequirementField) {
                contactRequirementField.value = `Hola, estoy interesado en el servicio de "${serviceTitle}". Por favor, bríndeme más información técnica y cotización.`;
                // Trigger label animation by dispatching input event
                contactRequirementField.dispatchEvent(new Event('input', { bubbles: true }));
                contactRequirementField.focus();
            }
        });
    });

    // ==========================================
    // 4. Contact Form Validation & Submission
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formSpinner = document.getElementById('form-spinner');
    const formSuccessAlert = document.getElementById('form-success');

    if (contactForm) {
        // Validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/; // Matches general international numbers

        const validateField = (inputElement, errorElement, validationFn) => {
            const value = inputElement.value.trim();
            const isValid = validationFn(value);
            const formGroup = inputElement.closest('.form-group');

            if (!isValid) {
                formGroup.classList.add('invalid');
                return false;
            } else {
                formGroup.classList.remove('invalid');
                return true;
            }
        };

        // Inputs Event Listeners for real-time validation feedback
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        nameInput.addEventListener('blur', () => {
            validateField(nameInput, null, (val) => val.length > 0);
        });

        emailInput.addEventListener('blur', () => {
            validateField(emailInput, null, (val) => emailRegex.test(val));
        });

        phoneInput.addEventListener('blur', () => {
            validateField(phoneInput, null, (val) => val.length > 4 && phoneRegex.test(val));
        });

        contactRequirementField.addEventListener('blur', () => {
            validateField(contactRequirementField, null, (val) => val.length > 0);
        });

        // Form Submit
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all fields on submit
            const isNameValid = validateField(nameInput, null, (val) => val.length > 0);
            const isEmailValid = validateField(emailInput, null, (val) => emailRegex.test(val));
            const isPhoneValid = validateField(phoneInput, null, (val) => val.length > 4 && phoneRegex.test(val));
            const isMessageValid = validateField(contactRequirementField, null, (val) => val.length > 0);

            if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
                // Disable button and show loading state
                submitBtn.disabled = true;
                const btnTextEl = submitBtn.querySelector('.btn-text');
                btnTextEl.textContent = 'Enviando...';
                formSpinner.style.display = 'inline-block';

                // Simulate API post call (e.g. backend saving)
                setTimeout(() => {
                    // Hide spinner, restore button
                    formSpinner.style.display = 'none';
                    btnTextEl.textContent = 'Solicitud Enviada';
                    
                    // Show success alert
                    formSuccessAlert.style.display = 'flex';
                    
                    // Reset form fields
                    contactForm.reset();
                    
                    // Reset labels positioning
                    const inputs = contactForm.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    });

                    // Reactivate submit button after 5 seconds, restore default text
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        btnTextEl.textContent = 'Enviar Solicitud';
                        formSuccessAlert.style.display = 'none';
                    }, 5000);

                }, 1800); // 1.8 seconds processing animation
            } else {
                // Focus the first invalid input
                const firstInvalidGroup = contactForm.querySelector('.form-group.invalid');
                if (firstInvalidGroup) {
                    firstInvalidGroup.querySelector('input, textarea').focus();
                }
            }
        });
    }

    // ==========================================
    // 5. Scroll Animations (IntersectionObserver)
    // ==========================================
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');

    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    observer.unobserve(entry.target); // Trigger animation only once
                }
            });
        }, {
            threshold: 0.15, // trigger when 15% of the element is visible
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    } else {
        // Fallback for older browsers: show everything immediately
        animatedElements.forEach(el => {
            el.classList.add('animated');
        });
    }

    // ==========================================
    // 6. Dynamic Event Tracking & Prefills
    // ==========================================
    // Smooth scroll for hero scroll arrow and CTA buttons
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
