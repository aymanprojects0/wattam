document.addEventListener('DOMContentLoaded', function() {
    console.log('WATTAM - Initialisation du site');

    // Mobile Menu Functionality - SIMPLE VERSION
    function initMobileMenu() {
        console.log('Initializing mobile menu...');
        
        const nav = document.querySelector('nav');
        const navUl = nav.querySelector('ul');
        const body = document.body;
        
        // Check if menu toggle already exists
        if (document.querySelector('.menu-toggle')) {
            return;
        }
        
        // Create mobile menu toggle button
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Add the toggle button to header
        document.querySelector('.header-flex').appendChild(menuToggle);
        
        // Toggle menu on click
        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('active');
            menuToggle.innerHTML = navUl.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        console.log('Mobile menu initialized successfully');
    }

    // Initialize mobile menu for mobile screens
    if (window.innerWidth <= 768) {
        initMobileMenu();
    }

    // Re-check on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && !document.querySelector('.menu-toggle')) {
            initMobileMenu();
        }
    });

    // Smooth scrolling for navigation links - SIMPLE VERSION
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                
                // Close mobile menu if open
                const navUl = document.querySelector('nav ul');
                if (navUl && navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    const menuToggle = document.querySelector('.menu-toggle');
                    if (menuToggle) {
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Scroll to section
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Product Filtering System
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.querySelector('.products-grid');
    
    const products = [
        { id: 1, name: 'Disjoncteur', category: 'les disjoncteur', image: 'images/products/les disjoncteur.jpg' },
        { id: 2, name: 'Disjoncteur Haut Poteau', category: 'Les disjoncteur haut poteau', image: 'images/products/Les disjoncteur haut poteau.jpg' },
        { id: 3, name: 'Interrupteur IACM', category: 'Interrupteur iacm', image: 'images/products/Interrupteur iacm.jpg' },
        { id: 4, name: 'Almelec', category: 'Almelec', image: 'images/products/Almelec.jpg' },
        { id: 5, name: 'Parafoudres', category: 'Les parafoudres', image: 'images/products/Les parafoudres.jpg' },
        { id: 6, name: 'Pinces d\'ancrages', category: 'Pinces d\'ancrages', image: 'images/products/Pinces d\'ancrages.jpg' },
        { id: 7, name: 'Projecteurs', category: 'Projecteurs', image: 'images/products/Projecteurs.jpg' },
        { id: 8, name: 'Contacteur', category: 'Contacteur', image: 'images/products/Contacteur.jpg' }
    ];

    function renderProducts(filter = 'all') {
        productsGrid.innerHTML = '';
        
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(product => product.category === filter);
        
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">Aucun produit trouvé dans cette catégorie.</p>';
            return;
        }
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.category}</p>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    }
    
    // Initial render
    renderProducts();
    
    // Filter button events
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            renderProducts(filter);
        });
    });

    // Statistics Animation
    const stats = document.querySelectorAll('.stat .number');
    
    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + '+';
                }
            }, 40);
        });
    }
    
    // Observe when about section comes into view
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(aboutSection);
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Initialize EmailJS
        (function() {
            if (typeof emailjs !== 'undefined') {
                emailjs.init("bS7QwXpkYuDW17OR9");
            }
        })();

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                alert("⚠️ Merci de remplir tous les champs obligatoires !");
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;

            // Send email
            emailjs.send("service_7udyguo", "template_73ua5ni", {
                from_name: name,
                from_email: email,
                phone: phone || 'Non fourni',
                subject: subject,
                message: message
            })
            .then(() => {
                alert(`✅ Merci ${name}, votre message a été envoyé avec succès !`);
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("❌ Erreur lors de l'envoi. Veuillez réessayer.");
            })
            .finally(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        });
    }

    console.log('WATTAM - Site initialisé avec succès');
});

// Simple CSS for mobile menu
const mobileMenuCSS = `
.menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #2c3e50;
    cursor: pointer;
    padding: 10px;
}

@media (max-width: 768px) {
    .menu-toggle {
        display: block;
    }
    
    nav ul {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        flex-direction: column;
        padding: 0;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    nav ul.active {
        display: flex;
    }
    
    nav ul li {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #f5f5f5;
    }
    
    nav ul li a {
        display: block;
        padding: 15px 20px;
    }
}

.no-products {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    color: #666;
}
`;

// Inject CSS only once
if (!document.querySelector('#mobile-menu-css')) {
    const style = document.createElement('style');
    style.id = 'mobile-menu-css';
    style.textContent = mobileMenuCSS;
    document.head.appendChild(style);
}