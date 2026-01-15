// ===================================
// Utility Functions
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to element
function smoothScrollTo(element) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ===================================
// Header Functionality
// ===================================

// Header scroll effect
const header = document.getElementById('header');

function handleHeaderScroll() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', debounce(handleHeaderScroll, 10));

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===================================
// Search Functionality
// ===================================

const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.querySelector('.search-input');

if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    });
}

if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Close on outside click
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });
}

// Handle search form submission
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchValue = searchInput.value.trim();
        if (searchValue) {
            // Here you would typically send the search query to your backend
            console.log('Searching for:', searchValue);
            alert(`Busca por: "${searchValue}"\n\nEsta é uma demonstração. Em um site real, isso buscaria produtos.`);
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    });
}

// ===================================
// Smooth Scrolling for Navigation
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            smoothScrollTo(targetElement);
        }
    });
});

// ===================================
// Scroll to Top Button
// ===================================

const scrollToTopBtn = document.getElementById('scrollToTop');

function handleScrollToTopButton() {
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
}

if (scrollToTopBtn) {
    window.addEventListener('scroll', debounce(handleScrollToTopButton, 100));

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Contact Form Handling
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Validate form
        if (!data.name || !data.email || !data.phone || !data.message) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Here you would typically send the form data to your backend
        console.log('Form data:', data);

        // Show success message
        alert('Mensagem enviada com sucesso!\n\nEntraremos em contato em breve.');

        // Reset form
        contactForm.reset();

        // In a real application, you would send this data to a server:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     alert('Mensagem enviada com sucesso!');
        //     contactForm.reset();
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        //     alert('Erro ao enviar mensagem. Tente novamente.');
        // });
    });
}

// ===================================
// Intersection Observer for Animations
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.feature-card, .product-card, .contact-card');
animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ===================================
// Product Card Interactions
// ===================================

const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', () => {
        card.style.zIndex = '1';
    });
});

// ===================================
// Lazy Loading Images
// ===================================

const images = document.querySelectorAll('img[src]');

if ('loading' in HTMLImageElement.prototype) {
    // Browser supports lazy loading
    images.forEach(img => {
        img.loading = 'lazy';
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Phone Number Formatting
// ===================================

const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            value = value.replace(/(\d*)/, '$1');
        }

        e.target.value = value;
    });
}

// ===================================
// Hero Scroll Animation
// ===================================

const heroScroll = document.querySelector('.hero-scroll');

if (heroScroll) {
    heroScroll.addEventListener('click', () => {
        const servicesSection = document.getElementById('servicos');
        if (servicesSection) {
            smoothScrollTo(servicesSection);
        }
    });
}

// ===================================
// Active Navigation Link
// ===================================

function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.menu-list a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', debounce(setActiveNavLink, 100));

// ===================================
// Console Welcome Message
// ===================================

console.log('%c Imperial Toalheria ', 'background: #fcd21d; color: #333; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Locação de Toalhas, Guardanapos e Acessórios para Festas ', 'color: #2ea3f2; font-size: 14px;');
console.log('%c Site desenvolvido com HTML5, CSS3 e JavaScript ', 'color: #666; font-size: 12px;');

// ===================================
// Initialize on DOM Load
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');

    // Check scroll position on load
    handleHeaderScroll();
    handleScrollToTopButton();
    setActiveNavLink();

    // Log initialization
    console.log('Site initialized successfully!');
});

// ===================================
// Handle Page Visibility
// ===================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page is hidden');
    } else {
        console.log('Page is visible');
    }
});

// ===================================
// Prevent form resubmission on refresh
// ===================================

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
