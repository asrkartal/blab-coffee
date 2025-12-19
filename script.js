// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Menu filter
const categoryBtns = document.querySelectorAll('.category-btn');
const menuCards = document.querySelectorAll('.menu-card');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;
        menuCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Create floating particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (8 + Math.random() * 4) + 's';
    particlesContainer.appendChild(particle);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Intersection Observer for animations
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

document.querySelectorAll('.menu-card, .gallery-item, .feature-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== Cart Functionality ====================
let cart = [];

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const orderModal = document.getElementById('orderModal');
const closeCart = document.getElementById('closeCart');
const closeOrder = document.getElementById('closeOrder');
const closeOrderBtn = document.getElementById('closeOrderBtn');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const orderNumber = document.getElementById('orderNumber');

// Open Cart Modal
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
});

// Close Cart Modal
closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

// Close Order Modal
closeOrder.addEventListener('click', () => {
    orderModal.classList.remove('active');
});

closeOrderBtn.addEventListener('click', () => {
    orderModal.classList.remove('active');
});

// Close modals on overlay click
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        orderModal.classList.remove('active');
    }
});

// Quantity selectors in menu cards
document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
        const qtyEl = btn.parentElement.querySelector('.qty-value');
        let qty = parseInt(qtyEl.textContent);
        if (qty < 10) {
            qtyEl.textContent = qty + 1;
        }
    });
});

document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
        const qtyEl = btn.parentElement.querySelector('.qty-value');
        let qty = parseInt(qtyEl.textContent);
        if (qty > 1) {
            qtyEl.textContent = qty - 1;
        }
    });
});

// Add to Cart
document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-card');
        const name = card.querySelector('.card-title').textContent;
        const priceText = card.querySelector('.card-price').textContent;
        const price = parseInt(priceText.replace('₺', ''));
        const qtyEl = card.querySelector('.qty-value');
        const qty = parseInt(qtyEl.textContent);

        // Check if item already in cart
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.qty += qty;
        } else {
            cart.push({ name, price, qty: qty });
        }

        updateCart();

        // Reset qty selector
        qtyEl.textContent = '1';

        // Show feedback
        btn.textContent = 'Eklendi ✓';
        btn.style.background = '#4CAF50';
        setTimeout(() => {
            btn.textContent = 'Ekle';
            btn.style.background = '';
        }, 1000);
    });
});

// Update Cart Display
function updateCart() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotal.textContent = '₺' + total;

    // Update checkout button
    checkoutBtn.disabled = cart.length === 0;

    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Sepetiniz boş</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₺${item.price}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeItem(${index})">Sil</button>
            </div>
        `).join('');
    }
}

// Change Quantity
function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

// Remove Item
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Checkout
checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) return;

    // Count coffee items in cart (only coffee category counts for stamps)
    const coffeeCount = cart.reduce((sum, item) => {
        const isCoffee = ['Espresso', 'Latte', 'Cappuccino', 'Americano', 'Mocha', 'Türk Kahvesi', 'Iced Latte', 'Frappe'].includes(item.name);
        return sum + (isCoffee ? item.qty : 0);
    }, 0);

    // Add stamps
    if (coffeeCount > 0) {
        addStamps(coffeeCount);
    }

    // Generate random order number
    const num = Math.floor(1000 + Math.random() * 9000);
    const orderNum = '#' + num;
    orderNumber.textContent = orderNum;

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Save to local history
    if (typeof saveOrderToHistory === 'function') {
        saveOrderToHistory(orderNum, [...cart], total);
    }

    // Save to Supabase database if user is logged in
    console.log('📦 Order placed:', orderNum);
    console.log('👤 User:', window.currentSupabaseUser);

    if (window.saveOrderToDatabase && window.currentSupabaseUser) {
        console.log('💾 Saving to Supabase...');
        try {
            await saveOrderToDatabase({
                orderNum: orderNum,
                items: [...cart],
                total: total
            });
        } catch (err) {
            console.error('Error saving order:', err);
        }
    }

    // Clear cart
    cart = [];
    updateCart();

    // Close cart modal and show order modal
    cartModal.classList.remove('active');
    orderModal.classList.add('active');
});

// ==================== Loyalty Stamp System ====================
let stamps = parseInt(localStorage.getItem('blabStamps')) || 0;
const stampCountEl = document.getElementById('stampCount');
const stampElements = document.querySelectorAll('.stamp');

// Initialize stamps on page load
updateStampDisplay();

function addStamps(count) {
    for (let i = 0; i < count; i++) {
        stamps++;

        // Check if completed 9 (got free coffee on 9th)
        if (stamps >= 9) {
            // Show celebration then reset
            updateStampDisplay();
            setTimeout(() => {
                showCelebration();
            }, 600);
            return;
        }
    }

    localStorage.setItem('blabStamps', stamps);
    updateStampDisplay();
}

// Celebration Modal
const celebrationModal = document.getElementById('celebrationModal');
const closeCelebration = document.getElementById('closeCelebration');
const confettiContainer = document.getElementById('confetti');

function showCelebration() {
    // Create confetti
    createConfetti();

    // Show modal
    celebrationModal.classList.add('active');
}

function createConfetti() {
    confettiContainer.innerHTML = '';
    const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

        // Random shapes
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        }

        confettiContainer.appendChild(confetti);
    }
}

closeCelebration.addEventListener('click', () => {
    celebrationModal.classList.remove('active');
    confettiContainer.innerHTML = '';

    // Reset stamps after celebration
    stamps = 0;
    localStorage.setItem('blabStamps', stamps);
    updateStampDisplay();
});


function updateStampDisplay() {
    // Update counter
    if (stampCountEl) {
        stampCountEl.textContent = Math.min(stamps, 9);
    }

    // Update stamp visuals
    stampElements.forEach((stamp, index) => {
        if (index < stamps) {
            stamp.classList.add('filled');
        } else {
            stamp.classList.remove('filled');
        }
    });
}

// Reset stamps button (for testing - can be called from console)
function resetStamps() {
    stamps = 0;
    localStorage.setItem('blabStamps', stamps);
    updateStampDisplay();
}

// ==================== NEW FEATURES ====================

// === THEME TOGGLE ===
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('blabTheme');

if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('blabTheme', isLight ? 'light' : 'dark');
});

// === LANGUAGE TOGGLE ===
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('blabLang') || 'tr';

const translations = {
    tr: {
        // Hero
        heroBadge: 'Okul Kahveciniz',
        heroTitle1: 'Kahvenin',
        heroTitle2: 'En Taze Hali',
        heroDesc: 'Okul içinde profesyonelce hazırlanmış kahve deneyimi. Her yudumda kalite, her fincanda mutluluk.',
        menuBtn: 'Menüyü Keşfet',
        aboutBtn: 'Bizi Tanıyın',
        // Loyalty
        loyaltyBadge: 'Kampanya',
        loyaltyTitle: '9 Kahve Al, 10. Bizden!',
        loyaltyDesc: 'Her kahve alışverişinde damga kazan, 9 damga topla ve 10. kahven bizden olsun!',
        loyaltyProgress: ' / 9 kahve toplandı - Hediye kazandın!',
        loyaltyInfo: 'Kahve siparişi verdiğinizde otomatik olarak damga kazanırsınız.',
        // Menu
        menuSectionBadge: 'Menümüz',
        menuSectionTitle: 'Lezzetli Seçenekler',
        filterAll: 'Tümü',
        filterCoffee: 'Kahveler',
        filterCold: 'Soğuk İçecekler',
        filterFood: 'Atıştırmalıklar',
        addBtn: 'Ekle',
        // Gallery
        galleryBadge: 'Galeri',
        galleryTitle: 'Kahve Anları',
        // About
        aboutBadge: 'Hakkımızda',
        aboutTitle: 'Blab Hikayesi',
        reviewsTitle: 'Müşteri Yorumları',
        mapTitle: 'Bizi Bulun',
        // Cart
        cartTitle: 'Sepetim',
        cartEmpty: 'Sepetiniz boş',
        cartTotal: 'Toplam:',
        checkoutBtn: 'Siparişi Onayla',
        prepTimeText: 'Tahmini hazırlık süresi:',
        // Nav
        navHome: 'Ana Sayfa',
        navMenu: 'Menü',
        navGallery: 'Galeri',
        navAbout: 'Hakkımızda',
        // Footer
        footerQuickLinks: 'Hızlı Linkler',
        footerContact: 'İletişim',
        footerHours: 'Çalışma Saatleri',
        orderHistory: 'Sipariş Geçmişi',
        // Modals
        favoritesTitle: 'Favorilerim',
        favoritesEmpty: 'Henüz favori eklemediniz',
        historyTitle: 'Sipariş Geçmişi',
        historyEmpty: 'Henüz sipariş vermediniz',
        searchPlaceholder: 'Ürün ara...',
        addToCart: 'Sepete Ekle',
        remove: 'Kaldır'
    },
    en: {
        // Hero
        heroBadge: 'Your School Coffee Shop',
        heroTitle1: 'The Freshest',
        heroTitle2: 'Coffee Experience',
        heroDesc: 'Professionally crafted coffee experience on campus. Quality in every sip, happiness in every cup.',
        menuBtn: 'Explore Menu',
        aboutBtn: 'About Us',
        // Loyalty
        loyaltyBadge: 'Campaign',
        loyaltyTitle: 'Buy 9 Coffees, Get 10th Free!',
        loyaltyDesc: 'Earn a stamp with every coffee purchase, collect 9 stamps and get your 10th coffee free!',
        loyaltyProgress: ' / 9 coffees collected - Earned a gift!',
        loyaltyInfo: 'You automatically earn stamps when you order coffee.',
        // Menu
        menuSectionBadge: 'Our Menu',
        menuSectionTitle: 'Delicious Options',
        filterAll: 'All',
        filterCoffee: 'Coffees',
        filterCold: 'Cold Drinks',
        filterFood: 'Snacks',
        addBtn: 'Add',
        // Gallery
        galleryBadge: 'Gallery',
        galleryTitle: 'Coffee Moments',
        // About
        aboutBadge: 'About',
        aboutTitle: 'Blab Story',
        reviewsTitle: 'Customer Reviews',
        mapTitle: 'Find Us',
        // Cart
        cartTitle: 'My Cart',
        cartEmpty: 'Your cart is empty',
        cartTotal: 'Total:',
        checkoutBtn: 'Confirm Order',
        prepTimeText: 'Estimated prep time:',
        // Nav
        navHome: 'Home',
        navMenu: 'Menu',
        navGallery: 'Gallery',
        navAbout: 'About',
        // Footer
        footerQuickLinks: 'Quick Links',
        footerContact: 'Contact',
        footerHours: 'Working Hours',
        orderHistory: 'Order History',
        // Modals
        favoritesTitle: 'My Favorites',
        favoritesEmpty: 'No favorites yet',
        historyTitle: 'Order History',
        historyEmpty: 'No orders yet',
        searchPlaceholder: 'Search products...',
        addToCart: 'Add to Cart',
        remove: 'Remove'
    }
};

langToggle.textContent = currentLang.toUpperCase();

// Apply saved language on load
if (currentLang === 'en') {
    applyTranslations('en');
}

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('blabLang', currentLang);
    langToggle.textContent = currentLang.toUpperCase();
    applyTranslations(currentLang);
});

function applyTranslations(lang) {
    const t = translations[lang];

    // Hero
    const heroBadge = document.querySelector('.hero-badge');
    const titleLines = document.querySelectorAll('.title-line');
    const heroDesc = document.querySelector('.hero-description');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');

    if (heroBadge) heroBadge.textContent = t.heroBadge;
    if (titleLines[0]) titleLines[0].textContent = t.heroTitle1;
    if (titleLines[1]) titleLines[1].textContent = t.heroTitle2;
    if (heroDesc) heroDesc.textContent = t.heroDesc;
    if (heroButtons[0]) heroButtons[0].textContent = t.menuBtn;
    if (heroButtons[1]) heroButtons[1].textContent = t.aboutBtn;

    // Loyalty
    const loyaltyBadge = document.querySelector('.loyalty-badge');
    const loyaltyTitle = document.querySelector('.loyalty-title');
    const loyaltyDesc = document.querySelector('.loyalty-desc');
    const loyaltyInfo = document.querySelector('.loyalty-info p');

    if (loyaltyBadge) loyaltyBadge.textContent = t.loyaltyBadge;
    if (loyaltyTitle) loyaltyTitle.textContent = t.loyaltyTitle;
    if (loyaltyDesc) loyaltyDesc.textContent = t.loyaltyDesc;
    if (loyaltyInfo) loyaltyInfo.textContent = t.loyaltyInfo;

    // Menu Section
    const menuBadges = document.querySelectorAll('.section-badge');
    const menuTitles = document.querySelectorAll('.section-title');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cardBtns = document.querySelectorAll('.card-btn');

    if (menuBadges[0]) menuBadges[0].textContent = t.menuSectionBadge;
    if (menuTitles[0]) menuTitles[0].textContent = t.menuSectionTitle;

    if (filterBtns.length >= 4) {
        filterBtns[0].textContent = t.filterAll;
        filterBtns[1].textContent = t.filterCoffee;
        filterBtns[2].textContent = t.filterCold;
        filterBtns[3].textContent = t.filterFood;
    }

    cardBtns.forEach(btn => {
        if (btn.textContent !== 'Eklendi ✓') {
            btn.textContent = t.addBtn;
        }
    });

    // Gallery
    if (menuBadges[1]) menuBadges[1].textContent = t.galleryBadge;
    if (menuTitles[1]) menuTitles[1].textContent = t.galleryTitle;

    // About
    if (menuBadges[2]) menuBadges[2].textContent = t.aboutBadge;
    if (menuTitles[2]) menuTitles[2].textContent = t.aboutTitle;

    // Nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length >= 4) {
        navLinks[0].textContent = t.navHome;
        navLinks[1].textContent = t.navMenu;
        navLinks[2].textContent = t.navGallery;
        navLinks[3].textContent = t.navAbout;
    }

    // Cart modal
    const cartModalTitle = document.querySelector('#cartModal .modal-header h3');
    const cartTotalLabel = document.querySelector('.cart-total span:first-child');
    const checkoutBtnEl = document.getElementById('checkoutBtn');

    if (cartModalTitle) cartModalTitle.textContent = t.cartTitle;
    if (cartTotalLabel) cartTotalLabel.textContent = t.cartTotal;
    if (checkoutBtnEl) checkoutBtnEl.textContent = t.checkoutBtn;

    // Search
    const searchInputEl = document.getElementById('searchInput');
    if (searchInputEl) searchInputEl.placeholder = t.searchPlaceholder;

    // Favorites modal
    const favModalTitle = document.querySelector('#favoritesModal .modal-header h3');
    if (favModalTitle) favModalTitle.textContent = t.favoritesTitle;

    // History modal
    const historyModalTitle = document.querySelector('#historyModal .modal-header h3');
    if (historyModalTitle) historyModalTitle.textContent = t.historyTitle;

    // Footer
    const footerTitles = document.querySelectorAll('.footer-links h4');
    if (footerTitles[0]) footerTitles[0].textContent = t.footerQuickLinks;
    if (footerTitles[1]) footerTitles[1].textContent = t.footerContact;
    if (footerTitles[2]) footerTitles[2].textContent = t.footerHours;

    // Product descriptions and badges
    translateProducts(lang);
}

function translateProducts(lang) {
    const productTranslations = {
        'Espresso': { tr: 'Yoğun ve aromik tek shot espresso', en: 'Intense and aromatic single shot espresso' },
        'Latte': { tr: 'Kremsi süt köpüğü ile espresso', en: 'Espresso with creamy steamed milk' },
        'Cappuccino': { tr: 'Kadifemsi köpük ile klasik lezzet', en: 'Classic taste with velvety foam' },
        'Americano': { tr: 'Sıcak su ile seyreltilmiş espresso', en: 'Espresso diluted with hot water' },
        'Mocha': { tr: 'Çikolata ile buluşan espresso', en: 'Espresso meets chocolate' },
        'Türk Kahvesi': { tr: 'Geleneksel Türk kahvesi', en: 'Traditional Turkish coffee' },
        'Iced Latte': { tr: 'Buzlu espresso ve soğuk süt', en: 'Iced espresso with cold milk' },
        'Frappe': { tr: 'Buzlu ve köpüklü kahve keyfi', en: 'Iced and frothy coffee delight' },
        'Limonata': { tr: 'Ev yapımı taze limonata', en: 'Homemade fresh lemonade' },
        'Kruvasan': { tr: 'Taze tereyağlı kruvasan', en: 'Fresh buttery croissant' },
        'Cheesecake': { tr: 'San Sebastian cheesecake', en: 'Basque burnt cheesecake' },
        'Cookie': { tr: 'Çikolata parçalı kurabiye', en: 'Chocolate chip cookie' }
    };

    const badgeTranslations = {
        'Popüler': { tr: 'Popüler', en: 'Popular' },
        'En Çok Satan': { tr: 'En Çok Satan', en: 'Best Seller' },
        'Serinletici': { tr: 'Serinletici', en: 'Refreshing' },
        'Popular': { tr: 'Popüler', en: 'Popular' },
        'Best Seller': { tr: 'En Çok Satan', en: 'Best Seller' },
        'Refreshing': { tr: 'Serinletici', en: 'Refreshing' }
    };

    const menuCards = document.querySelectorAll('.menu-card');

    menuCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent;
        const desc = card.querySelector('.card-description');
        const badge = card.querySelector('.card-badge');

        // Translate description
        if (desc && productTranslations[title]) {
            desc.textContent = productTranslations[title][lang];
        }

        // Translate badge
        if (badge && badgeTranslations[badge.textContent]) {
            badge.textContent = badgeTranslations[badge.textContent][lang];
        }
    });

    // Also translate section description
    const sectionDesc = document.querySelector('.section-description');
    if (sectionDesc) {
        sectionDesc.textContent = lang === 'en'
            ? 'Carefully prepared drinks and snacks'
            : 'Özenle hazırlanan içeceklerimiz ve atıştırmalıklarımız';
    }

    // Hero stats (stat-item, not hero-stat)
    const statItems = document.querySelectorAll('.stat-item');
    const statTranslations = [
        { tr: 'Günlük Kahve', en: 'Daily Coffee' },
        { tr: 'Çeşit İçecek', en: 'Drink Variety' },
        { tr: 'Mutlu Öğrenci', en: 'Happy Students' }
    ];

    statItems.forEach((stat, i) => {
        const label = stat.querySelector('.stat-label');
        if (label && statTranslations[i]) {
            label.textContent = statTranslations[i][lang];
        }
    });

    // About section texts
    const aboutTexts = document.querySelectorAll('.about-text');
    const aboutTranslations = [
        {
            tr: 'Blab, öğrencilerin ihtiyaçlarını anlayan bir kahve mekanıdır. Okul içinde kaliteli kahve deneyimi sunmak ve öğrencilerin ders aralarında rahatça vakit geçirebilecekleri bir ortam yaratmak amacıyla kurulduk.',
            en: 'Blab is a coffee shop that understands student needs. We were established to offer quality coffee experience on campus and create a comfortable environment for students during their breaks.'
        },
        {
            tr: 'Her fincan kahvemiz, özenle seçilmiş çekirdeklerden ve profesyonel baristalarımız tarafından hazırlanır. Amacımız sadece kahve satmak değil, unutulmaz anlar yaratmaktır.',
            en: 'Every cup of our coffee is prepared from carefully selected beans by our professional baristas. Our goal is not just to sell coffee, but to create unforgettable moments.'
        }
    ];

    aboutTexts.forEach((text, i) => {
        if (aboutTranslations[i]) {
            text.textContent = aboutTranslations[i][lang];
        }
    });

    // Feature items
    const featureItems = document.querySelectorAll('.feature-item');
    const featureTranslations = [
        { titleTr: 'Taze Çekirdek', titleEn: 'Fresh Beans', descTr: 'Her gün taze kavrulmuş çekirdekler', descEn: 'Freshly roasted beans every day' },
        { titleTr: 'Öğrenci Dostu', titleEn: 'Student Friendly', descTr: 'Uygun fiyatlar ve kampanyalar', descEn: 'Affordable prices and campaigns' },
        { titleTr: 'Hızlı Servis', titleEn: 'Fast Service', descTr: 'Ders arasına yetişen hızlı hazırlık', descEn: 'Quick preparation between classes' }
    ];

    featureItems.forEach((item, i) => {
        if (featureTranslations[i]) {
            const title = item.querySelector('h4');
            const desc = item.querySelector('p');
            if (title) title.textContent = lang === 'en' ? featureTranslations[i].titleEn : featureTranslations[i].titleTr;
            if (desc) desc.textContent = lang === 'en' ? featureTranslations[i].descEn : featureTranslations[i].descTr;
        }
    });

    // Reviews section
    const reviewsTitle = document.querySelector('.reviews-section .section-title');
    if (reviewsTitle) {
        reviewsTitle.textContent = lang === 'en' ? '💬 Customer Reviews' : '💬 Müşteri Yorumları';
    }

    const reviewCards = document.querySelectorAll('.review-card');
    const reviewTranslations = [
        { tr: 'Kampüsteki en iyi kahve burası! Latte\'si harika, fiyatlar da öğrenci dostu. Ders arasında mutlaka uğruyorum.', en: 'Best coffee on campus! Their latte is amazing, prices are student-friendly. I always stop by between classes.' },
        { tr: 'Espresso\'ları mükemmel! Çalışanlar çok ilgili, ortam da çok güzel. 9 kahve al 10. bedava kampanyası harika!', en: 'Their espresso is perfect! Staff is very friendly, atmosphere is great. The buy 9 get 10th free campaign is awesome!' },
        { tr: 'Cheesecake ve kahve ikilisi için en iyi adres. Hızlı servis için teşekkürler Blab ekibi!', en: 'Best place for cheesecake and coffee combo. Thanks Blab team for the fast service!' }
    ];

    reviewCards.forEach((card, i) => {
        const text = card.querySelector('.review-text');
        if (text && reviewTranslations[i]) {
            text.textContent = reviewTranslations[i][lang];
        }
    });


    // Map title
    const mapTitle = document.querySelector('[data-translate="findUs"]');
    if (mapTitle) {
        mapTitle.textContent = lang === 'en' ? '📍 Find Us' : '📍 Bizi Bulun';
    }

    // Footer content
    const footerLinks = document.querySelectorAll('.footer-links ul li a');
    const footerLinkTexts = [
        { tr: 'Ana Sayfa', en: 'Home' },
        { tr: 'Menü', en: 'Menu' },
        { tr: 'Galeri', en: 'Gallery' },
        { tr: 'Hakkımızda', en: 'About' }
    ];
    footerLinks.forEach((link, i) => {
        if (footerLinkTexts[i] && !link.id) {
            link.textContent = footerLinkTexts[i][lang];
        }
    });

    // Footer hours section
    const hoursItems = document.querySelectorAll('.footer-links:last-child ul li');
    const hoursTexts = [
        { tr: 'Pazartesi - Cuma', en: 'Monday - Friday' },
        { tr: '08:00 - 17:00', en: '08:00 - 17:00' },
        { tr: 'Cumartesi - Pazar', en: 'Saturday - Sunday' },
        { tr: 'Kapalı', en: 'Closed' }
    ];
    hoursItems.forEach((item, i) => {
        if (hoursTexts[i]) {
            item.textContent = hoursTexts[i][lang];
        }
    });

    // Footer copyright
    const footerBottom = document.querySelectorAll('.footer-bottom p');
    if (footerBottom[0]) {
        footerBottom[0].innerHTML = lang === 'en'
            ? '&copy; 2024 Blab Coffee. All rights reserved.'
            : '&copy; 2024 Blab Coffee. Tüm hakları saklıdır.';
    }
    if (footerBottom[1]) {
        footerBottom[1].textContent = lang === 'en'
            ? 'Developed by Bilgi Computer Engineering Students'
            : 'Bilgi Bilgisayar Mühendisliği Öğrencileri tarafından geliştirildi';
    }

    // Loyalty section
    const loyaltyProgress = document.querySelector('.loyalty-progress');
    if (loyaltyProgress) {
        const stampCount = document.getElementById('stampCount').textContent;
        loyaltyProgress.innerHTML = lang === 'en'
            ? `<span id="stampCount">${stampCount}</span> / 9 coffees collected - Gift earned!`
            : `<span id="stampCount">${stampCount}</span> / 9 kahve toplandı - Hediye kazandın!`;
    }

    // Cart modal
    const emptyCart = document.querySelector('.empty-cart');
    if (emptyCart) {
        emptyCart.textContent = lang === 'en' ? 'Your cart is empty' : 'Sepetiniz boş';
    }

    // Prep time
    const prepTimeText = document.querySelector('.prep-time-text');
    if (prepTimeText) {
        const timeValue = document.getElementById('prepTimeValue').textContent;
        prepTimeText.innerHTML = lang === 'en'
            ? `Estimated preparation time: <strong id="prepTimeValue">${timeValue}</strong>`
            : `Tahmini hazırlık süresi: <strong id="prepTimeValue">${timeValue}</strong>`;
    }

    // Order confirmation modal
    const orderModalTitle = document.querySelector('#orderModal .modal-header h3');
    if (orderModalTitle) {
        orderModalTitle.textContent = lang === 'en' ? '✅ Order Confirmed!' : '✅ Sipariş Onaylandı!';
    }

    const orderSuccessTitle = document.querySelector('.order-success h4');
    if (orderSuccessTitle) {
        orderSuccessTitle.textContent = lang === 'en' ? 'Your order has been received!' : 'Siparişiniz alındı!';
    }

    const orderSuccessText = document.querySelector('.order-success p');
    if (orderSuccessText) {
        orderSuccessText.textContent = lang === 'en'
            ? 'Your order is being prepared. Please wait at Blab.'
            : 'Siparişiniz hazırlanıyor. Lütfen Blab\'da bekleyiniz.';
    }

    const orderNumberLabel = document.querySelector('.order-number');
    if (orderNumberLabel) {
        const orderNum = document.getElementById('orderNumber').textContent;
        orderNumberLabel.innerHTML = lang === 'en'
            ? `Order No: <strong id="orderNumber">${orderNum}</strong>`
            : `Sipariş No: <strong id="orderNumber">${orderNum}</strong>`;
    }

    // Celebration modal
    const celebrationTitle = document.querySelector('.celebration-title');
    if (celebrationTitle) {
        celebrationTitle.textContent = lang === 'en' ? 'CONGRATULATIONS!' : 'TEBRİKLER!';
    }

    const celebrationSubtitle = document.querySelector('.celebration-subtitle');
    if (celebrationSubtitle) {
        celebrationSubtitle.textContent = lang === 'en' ? "Your 10th Coffee is on Us!" : "10. Kahven Bizden!";
    }

    const celebrationMessage = document.querySelector('.celebration-message');
    if (celebrationMessage) {
        celebrationMessage.textContent = lang === 'en'
            ? 'You have collected 9 coffees. Your next coffee is FREE!'
            : '9 kahve topladınız. Bir sonraki kahveniz BİZDEN!';
    }

    const celebrationBtn = document.querySelector('.celebration-btn span');
    if (celebrationBtn) {
        celebrationBtn.textContent = lang === 'en' ? 'Awesome!' : 'Harika!';
    }

    // Gallery overlay captions
    const galleryOverlays = document.querySelectorAll('.gallery-overlay span');
    const galleryCaptions = [
        { tr: 'Sabah Kahvesi', en: 'Morning Coffee' },
        { tr: 'Latte Art', en: 'Latte Art' },
        { tr: 'Çalışma Molası', en: 'Study Break' },
        { tr: 'Kahve Çekirdekleri', en: 'Coffee Beans' },
        { tr: 'Espresso', en: 'Espresso' },
        { tr: 'Arkadaşlarla', en: 'With Friends' }
    ];
    galleryOverlays.forEach((overlay, i) => {
        if (galleryCaptions[i]) {
            overlay.textContent = galleryCaptions[i][lang];
        }
    });

    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryTexts = [
        { tr: 'Tümü', en: 'All' },
        { tr: 'Kahveler', en: 'Coffees' },
        { tr: 'Soğuk İçecekler', en: 'Cold Drinks' },
        { tr: 'Atıştırmalık', en: 'Snacks' }
    ];
    categoryBtns.forEach((btn, i) => {
        if (categoryTexts[i]) {
            btn.textContent = categoryTexts[i][lang];
        }
    });

    // Scroll indicator (hero-scroll, not scroll-indicator)
    const scrollText = document.querySelector('.hero-scroll span');
    if (scrollText) {
        scrollText.textContent = lang === 'en' ? 'Scroll Down' : 'Aşağı Kaydır';
    }

    // Gallery section subtitle
    const gallerySubtitle = document.querySelector('.gallery .section-description');
    if (gallerySubtitle) {
        gallerySubtitle.textContent = lang === 'en'
            ? 'Special moments from Blab'
            : "Blab'deki özel anlardan kareler";
    }

    // Floating badge (2024'ten beri)
    const floatingBadge = document.querySelector('.floating-badge');
    if (floatingBadge) {
        floatingBadge.textContent = lang === 'en' ? 'Since 2024' : "2024'ten beri";
    }

    // Footer brand description
    const footerBrandDesc = document.querySelector('.footer-brand p');
    if (footerBrandDesc) {
        footerBrandDesc.textContent = lang === 'en'
            ? "Your school's favorite coffee shop. Fresh coffee, warm atmosphere, and student-friendly prices every day."
            : 'Okulun en sevilen kahvecisi. Her gün taze kahve, sıcak atmosfer ve öğrenci dostu fiyatlar.';
    }

    // Footer Quick Links title
    const quickLinksTitle = document.querySelector('.footer-links h4');
    if (quickLinksTitle) {
        quickLinksTitle.textContent = lang === 'en' ? 'Quick Links' : 'Hızlı Linkler';
    }

    // Footer contact title (İletişim)
    const contactTitle = document.querySelector('.footer-contact h4');
    if (contactTitle) {
        contactTitle.textContent = lang === 'en' ? 'Contact' : 'İletişim';
    }

    // Footer hours title (Çalışma Saatleri)  
    const hoursTitle = document.querySelector('.footer-hours h4');
    if (hoursTitle) {
        hoursTitle.textContent = lang === 'en' ? 'Working Hours' : 'Çalışma Saatleri';
    }

    // Footer hours content
    const hoursListItems = document.querySelectorAll('.footer-hours ul li');
    const hoursListTexts = [
        { tr: 'Pazartesi - Cuma', en: 'Monday - Friday' },
        { tr: '08:00 - 17:00', en: '08:00 - 17:00' },
        { tr: 'Cumartesi - Pazar', en: 'Saturday - Sunday' },
        { tr: 'Kapalı', en: 'Closed' }
    ];
    hoursListItems.forEach((item, i) => {
        if (hoursListTexts[i]) {
            item.textContent = hoursListTexts[i][lang];
            if (i === 1 || i === 3) item.classList.add('highlight');
        }
    });
}

// === SEARCH ===
const searchBtn = document.getElementById('searchBtn');
const searchDropdown = document.getElementById('searchDropdown');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const menuItems = [
    { name: 'Espresso', price: 80 },
    { name: 'Latte', price: 145 },
    { name: 'Cappuccino', price: 145 },
    { name: 'Americano', price: 115 },
    { name: 'Mocha', price: 160 },
    { name: 'Türk Kahvesi', price: 55 },
    { name: 'Iced Latte', price: 155 },
    { name: 'Frappe', price: 165 },
    { name: 'Limonata', price: 85 },
    { name: 'Kruvasan', price: 95 },
    { name: 'Cheesecake', price: 135 },
    { name: 'Cookie', price: 70 }
];

searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    searchDropdown.classList.toggle('active');
    if (searchDropdown.classList.contains('active')) {
        searchInput.focus();
    }
});

document.addEventListener('click', (e) => {
    if (!searchDropdown.contains(e.target) && e.target !== searchBtn) {
        searchDropdown.classList.remove('active');
    }
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 1) {
        searchResults.innerHTML = '';
        return;
    }

    const filtered = menuItems.filter(item =>
        item.name.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        searchResults.innerHTML = '<p style="color: var(--muted); padding: 0.5rem;">Sonuç bulunamadı</p>';
    } else {
        searchResults.innerHTML = filtered.map(item => `
            <div class="search-result-item" onclick="scrollToProduct('${item.name}')">
                <span>${item.name}</span>
                <span>₺${item.price}</span>
            </div>
        `).join('');
    }
});

function scrollToProduct(name) {
    // Find the menu card with matching product name
    const menuCards = document.querySelectorAll('.menu-card');
    let targetCard = null;

    menuCards.forEach(card => {
        const title = card.querySelector('.card-title');
        if (title && title.textContent === name) {
            targetCard = card;
        }
    });

    if (targetCard) {
        // Close search dropdown
        searchDropdown.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';

        // Scroll to the card
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight the card briefly
        targetCard.style.transform = 'scale(1.05)';
        targetCard.style.boxShadow = '0 0 30px rgba(212, 165, 116, 0.5)';
        targetCard.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            targetCard.style.transform = '';
            targetCard.style.boxShadow = '';
        }, 1500);
    }
}

function addToCartFromSearch(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCart();
    searchDropdown.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
}

// === FAVORITES ===
let favorites = JSON.parse(localStorage.getItem('blabFavorites')) || [];
const favoritesBtn = document.getElementById('favoritesBtn');
const favoritesModal = document.getElementById('favoritesModal');
const closeFavorites = document.getElementById('closeFavorites');
const favoritesList = document.getElementById('favoritesList');
const favCount = document.getElementById('favCount');

updateFavoritesCount();

favoritesBtn.addEventListener('click', () => {
    favoritesModal.classList.add('active');
    renderFavorites();
});

closeFavorites.addEventListener('click', () => {
    favoritesModal.classList.remove('active');
});

favoritesModal.addEventListener('click', (e) => {
    if (e.target === favoritesModal) {
        favoritesModal.classList.remove('active');
    }
});

function toggleFavorite(name, price) {
    const index = favorites.findIndex(f => f.name === name);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ name, price });
    }
    localStorage.setItem('blabFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
}

function updateFavoritesCount() {
    favCount.textContent = favorites.length;
    updateFavoriteButtons();
}

// Add heart buttons to all menu cards dynamically
function addFavoriteButtons() {
    const menuCards = document.querySelectorAll('.menu-card');

    menuCards.forEach(card => {
        const cardImage = card.querySelector('.card-image');
        const title = card.querySelector('.card-title').textContent;
        const priceText = card.querySelector('.card-price').textContent;
        const price = parseInt(priceText.replace('₺', ''));

        // Check if button already exists
        if (cardImage.querySelector('.card-fav-btn')) return;

        const favBtn = document.createElement('button');
        favBtn.className = 'card-fav-btn';
        favBtn.setAttribute('data-product', title);
        favBtn.setAttribute('aria-label', 'Favorilere ekle');
        favBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        `;

        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(title, price);
            favBtn.classList.toggle('active');
        });

        // Check if already favorited
        if (favorites.some(f => f.name === title)) {
            favBtn.classList.add('active');
        }

        cardImage.appendChild(favBtn);
    });
}

// Update heart button states
function updateFavoriteButtons() {
    document.querySelectorAll('.card-fav-btn').forEach(btn => {
        const product = btn.getAttribute('data-product');
        if (favorites.some(f => f.name === product)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Initialize favorite buttons
addFavoriteButtons();

// Product descriptions for translation
const productTranslations = {
    'Espresso': { tr: 'Yoğun ve aromik tek shot espresso', en: 'Intense and aromatic single shot espresso' },
    'Latte': { tr: 'Kremsi süt köpüğü ile espresso', en: 'Espresso with creamy steamed milk' },
    'Cappuccino': { tr: 'Kadifemsi köpük ile klasik lezzet', en: 'Classic taste with velvety foam' },
    'Americano': { tr: 'Sıcak su ile seyreltilmiş espresso', en: 'Espresso diluted with hot water' },
    'Mocha': { tr: 'Çikolata ile buluşan espresso', en: 'Espresso meets chocolate' },
    'Türk Kahvesi': { tr: 'Geleneksel Türk kahvesi', en: 'Traditional Turkish coffee' },
    'Iced Latte': { tr: 'Buzlu espresso ve soğuk süt', en: 'Iced espresso with cold milk' },
    'Frappe': { tr: 'Buzlu ve köpüklü kahve keyfi', en: 'Iced and frothy coffee delight' },
    'Limonata': { tr: 'Ev yapımı taze limonata', en: 'Homemade fresh lemonade' },
    'Kruvasan': { tr: 'Taze tereyağlı kruvasan', en: 'Fresh buttery croissant' },
    'Cheesecake': { tr: 'San Sebastian cheesecake', en: 'Basque burnt cheesecake' },
    'Cookie': { tr: 'Çikolata parçalı kurabiye', en: 'Chocolate chip cookie' }
};

const badgeTranslations = {
    'Popüler': { tr: 'Popüler', en: 'Popular' },
    'En Çok Satan': { tr: 'En Çok Satan', en: 'Best Seller' },
    'Serinletici': { tr: 'Serinletici', en: 'Refreshing' }
};

function renderFavorites() {
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-cart">Henüz favori eklemediniz</p>';
    } else {
        favoritesList.innerHTML = favorites.map(fav => `
            <div class="favorite-item">
                <div class="favorite-item-info">
                    <span class="favorite-item-name">${fav.name}</span>
                    <span class="favorite-item-price">₺${fav.price}</span>
                </div>
                <div class="favorite-item-actions">
                    <button class="fav-add-btn" onclick="addFavToCart('${fav.name}', ${fav.price})">Sepete Ekle</button>
                    <button class="fav-remove-btn" onclick="removeFavorite('${fav.name}')">Kaldır</button>
                </div>
            </div>
        `).join('');
    }
}

function addFavToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCart();
}

function removeFavorite(name) {
    favorites = favorites.filter(f => f.name !== name);
    localStorage.setItem('blabFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
    renderFavorites();
}

// === ORDER HISTORY ===
let orderHistory = JSON.parse(localStorage.getItem('blabHistory')) || [];
const historyModal = document.getElementById('historyModal');
const closeHistory = document.getElementById('closeHistory');
const historyList = document.getElementById('historyList');

// Add history button to footer
const footerLinks = document.querySelector('.footer-links ul');
if (footerLinks) {
    const historyLi = document.createElement('li');
    historyLi.innerHTML = '<a href="#" id="historyLink">Sipariş Geçmişi</a>';
    footerLinks.appendChild(historyLi);

    document.getElementById('historyLink').addEventListener('click', (e) => {
        e.preventDefault();
        historyModal.classList.add('active');
        renderHistory();
    });
}

closeHistory.addEventListener('click', () => {
    historyModal.classList.remove('active');
});

historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.classList.remove('active');
    }
});

function saveOrderToHistory(orderNum, items, total) {
    const order = {
        orderNum,
        date: new Date().toLocaleDateString('tr-TR'),
        items: items.map(i => `${i.qty}x ${i.name}`).join(', '),
        total
    };
    orderHistory.unshift(order);
    if (orderHistory.length > 10) orderHistory.pop(); // Keep last 10
    localStorage.setItem('blabHistory', JSON.stringify(orderHistory));
}

function renderHistory() {
    if (orderHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-cart">Henüz sipariş vermediniz</p>';
    } else {
        historyList.innerHTML = orderHistory.map(order => `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">${order.date}</span>
                    <span class="history-order-num">${order.orderNum}</span>
                </div>
                <p class="history-items">${order.items}</p>
                <p class="history-total">₺${order.total}</p>
            </div>
        `).join('');
    }
}

// === PREP TIME ESTIMATE ===
const prepTimeEl = document.getElementById('prepTime');
const prepTimeValue = document.getElementById('prepTimeValue');

function updatePrepTime() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalItems === 0) {
        prepTimeEl.style.display = 'none';
    } else {
        prepTimeEl.style.display = 'flex';
        // 2 min base + 1 min per item
        const minutes = 2 + totalItems;
        prepTimeValue.textContent = `~${minutes} dk`;
    }
}

// Override updateCart to include prep time
const originalUpdateCart = updateCart;
updateCart = function () {
    originalUpdateCart();
    updatePrepTime();
};

// ===========================
// USER AUTHENTICATION SYSTEM
// ===========================
const authModal = document.getElementById('authModal');
const userBtn = document.getElementById('userBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotForm = document.getElementById('forgotForm');
const userProfile = document.getElementById('userProfile');

// Form elements
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const loginSubmit = document.getElementById('loginSubmit');

const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerConfirm = document.getElementById('registerConfirm');
const registerError = document.getElementById('registerError');
const registerSubmit = document.getElementById('registerSubmit');

const forgotEmail = document.getElementById('forgotEmail');
const forgotError = document.getElementById('forgotError');
const forgotSuccess = document.getElementById('forgotSuccess');
const forgotSubmit = document.getElementById('forgotSubmit');

// Navigation links
const showForgot = document.getElementById('showForgot');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const backToLogin = document.getElementById('backToLogin');

// Close buttons
const closeAuth = document.getElementById('closeAuth');
const closeAuth2 = document.getElementById('closeAuth2');
const closeAuth3 = document.getElementById('closeAuth3');
const closeAuth4 = document.getElementById('closeAuth4');
const logoutBtn = document.getElementById('logoutBtn');

// Get current user from localStorage
let currentUser = JSON.parse(localStorage.getItem('blabUser')) || null;
let users = JSON.parse(localStorage.getItem('blabUsers')) || [];

// Initialize user state
updateUserButtonState();

// Open auth modal - check Supabase session directly
userBtn.addEventListener('click', async () => {
    authModal.classList.add('active');

    // Check Supabase session directly
    const session = await getSession();
    if (session && session.user) {
        window.currentSupabaseUser = session.user;
        showUserProfile();
    } else {
        showLoginForm();
    }
});

// Close modal handlers
[closeAuth, closeAuth2, closeAuth3, closeAuth4].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            authModal.classList.remove('active');
        });
    }
});

authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('active');
    }
});

// Navigation between forms
showForgot.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotForm();
});

showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

backToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Show/Hide form functions
function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    forgotForm.style.display = 'none';
    userProfile.style.display = 'none';
    clearErrors();
}

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    forgotForm.style.display = 'none';
    userProfile.style.display = 'none';
    clearErrors();
}

function showForgotForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    forgotForm.style.display = 'block';
    userProfile.style.display = 'none';
    clearErrors();
}

function showUserProfile() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    forgotForm.style.display = 'none';
    userProfile.style.display = 'block';

    // Update profile info from Supabase user
    const user = window.currentSupabaseUser;
    if (user) {
        const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Kullanıcı';
        document.getElementById('userName').textContent = userName;
        document.getElementById('userEmail').textContent = user.email || '';
        document.getElementById('userOrders').textContent = 0; // TODO: Get from database
        document.getElementById('userStamps').textContent = stamps || 0;
    }
}

function clearErrors() {
    loginError.classList.remove('show');
    registerError.classList.remove('show');
    forgotError.classList.remove('show');
    forgotSuccess.classList.remove('show');
    loginError.textContent = '';
    registerError.textContent = '';
    forgotError.textContent = '';
    forgotSuccess.textContent = '';
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function showSuccess(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

// Login handler - SUPABASE
loginSubmit.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        showError(loginError, 'Lütfen tüm alanları doldurun.');
        return;
    }

    loginSubmit.disabled = true;
    loginSubmit.textContent = 'Giriş yapılıyor...';

    try {
        const data = await supabaseSignIn(email, password);

        if (data && data.session) {
            window.currentSupabaseUser = data.user;
            console.log('✅ Login successful:', data.user.email);
            showUserProfile();
            loginEmail.value = '';
            loginPassword.value = '';
        }
    } catch (error) {
        console.error('Login error:', error);
        showError(loginError, error.message || 'E-posta veya şifre hatalı.');
    } finally {
        loginSubmit.disabled = false;
        loginSubmit.textContent = 'Giriş Yap';
    }
});

// Register handler - SUPABASE
registerSubmit.addEventListener('click', async () => {
    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = registerConfirm.value;

    if (!name || !email || !password || !confirm) {
        showError(registerError, 'Lütfen tüm alanları doldurun.');
        return;
    }

    // Email validation - must end with valid domain
    const validDomains = ['@gmail.com', '@hotmail.com', '@outlook.com', '@yahoo.com', '@icloud.com', '@bilgi.edu.tr'];
    const hasValidDomain = validDomains.some(domain => email.toLowerCase().endsWith(domain));

    if (!hasValidDomain) {
        showError(registerError, 'Geçerli bir e-posta adresi girin (@gmail.com, @hotmail.com, @outlook.com, @yahoo.com, @bilgi.edu.tr)');
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError(registerError, 'Geçersiz e-posta formatı.');
        return;
    }

    // Password length validation (8+ characters)
    if (password.length < 8) {
        showError(registerError, 'Şifre en az 8 karakter olmalı.');
        return;
    }

    // Password special character validation
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(password)) {
        showError(registerError, 'Şifre en az bir özel karakter içermeli (!@#$%^&* vb.)');
        return;
    }

    // Password match validation
    if (password !== confirm) {
        showError(registerError, 'Şifreler eşleşmiyor.');
        return;
    }

    registerSubmit.disabled = true;
    registerSubmit.textContent = 'Kayıt yapılıyor...';

    try {
        const { user } = await supabaseSignUp(email, password, name);

        if (user) {
            showSuccess(registerError, '✅ Kayıt başarılı! Lütfen e-postanızı onaylayın.');
            // Clear form
            registerName.value = '';
            registerEmail.value = '';
            registerPassword.value = '';
            registerConfirm.value = '';
        }
    } catch (error) {
        console.error('Register error:', error);
        showError(registerError, error.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
        registerSubmit.disabled = false;
        registerSubmit.textContent = 'Üye Ol';
    }
});

// Forgot password handler - SUPABASE (REAL EMAIL!)
forgotSubmit.addEventListener('click', async () => {
    const email = forgotEmail.value.trim();

    if (!email) {
        showError(forgotError, 'Lütfen e-posta adresinizi girin.');
        return;
    }

    forgotSubmit.disabled = true;
    forgotSubmit.textContent = 'Gönderiliyor...';

    try {
        await supabaseResetPassword(email);
        showSuccess(forgotSuccess, '✅ Şifre sıfırlama linki e-posta adresinize gönderildi!');
        forgotEmail.value = '';
    } catch (error) {
        console.error('Reset password error:', error);
        showError(forgotError, error.message || 'Bir hata oluştu.');
    } finally {
        forgotSubmit.disabled = false;
        forgotSubmit.textContent = 'Sıfırlama Linki Gönder';
    }
});

// Logout handler - SUPABASE
logoutBtn.addEventListener('click', async () => {
    try {
        await supabaseSignOut();
        window.currentSupabaseUser = null;
        authModal.classList.remove('active');
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Update user button appearance
function updateUserButtonState() {
    if (currentUser) {
        userBtn.classList.add('logged-in');
        userBtn.setAttribute('aria-label', 'Hesabım');
    } else {
        userBtn.classList.remove('logged-in');
        userBtn.setAttribute('aria-label', 'Giriş Yap');
    }
}

// Update user order count on checkout
const originalCheckoutClick = checkoutBtn.onclick;
checkoutBtn.addEventListener('click', () => {
    if (currentUser && cart.length > 0) {
        currentUser.orders = (currentUser.orders || 0) + 1;
        localStorage.setItem('blabUser', JSON.stringify(currentUser));

        // Update in users array too
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex > -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('blabUsers', JSON.stringify(users));
        }
    }
});
