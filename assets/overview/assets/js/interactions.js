// ========== NAVIGATION SCROLL ==========
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// ========== MOBILE NAVIGATION ==========
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

function closeMobileNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ========== TESTIMONIAL SLIDER ==========
const testimonialItems = document.querySelectorAll('.testimonial-item');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
    testimonialItems.forEach(item => item.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    testimonialItems[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonial = index;
}

testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => {
        showTestimonial(parseInt(dot.dataset.index));
        clearInterval(testimonialInterval);
        startTestimonialAutoplay();
    });
});

function startTestimonialAutoplay() {
    testimonialInterval = setInterval(() => {
        showTestimonial((currentTestimonial + 1) % testimonialItems.length);
    }, 5000);
}

// Initialize: show first testimonial
if (testimonialItems.length > 0) {
    showTestimonial(0);
    startTestimonialAutoplay();
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== PARALLAX ON HERO IMAGE ==========
const heroImg = document.querySelector('.hero-image img');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (heroImg && scrolled < window.innerHeight) {
        heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
    }
});

// ========== COUNTER ANIMATION ==========
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent;
            const match = text.match(/(\d+)/);
            if (match) {
                const target = parseInt(match[0]);
                const suffix = text.replace(match[0], '');
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = Math.floor(current) + suffix;
                }, 25);
            }
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// ========== THEME DETAIL MODAL (AMBIENTES DIBRUS) ==========
const themesData = [
    {
        id: 'cozinhas',
        tag: 'Especialidade Sob Medida',
        title: 'COZINHAS GOURMET',
        subtitle: 'Ergonomia, tecnologia e alta gastronomia em harmonia perfeita.',
        desc: 'Desenvolvemos cozinhas planejadas que equilibram estética contemporânea refinada e máxima funcionalidade culinária. Com ilhas esculpidas em materiais nobres, sistemas de amortecimento ocultos padrão europeu, iluminação linear em LED quente e divisores internos inteligentes, cada detalhe é concebido para transformar a convivência e o preparo gastronômico em momentos extraordinários.',
        image: 'assets/images/project-01-kitchen.jpg',
        features: [
            'Ilhas esculpidas com canaletas de LED e tomadas ocultas',
            'Ferragens europeias com amortecimento suave',
            'Divisores internos aveludados para talheres e louças',
            'Revestimentos nobres de alta resistência a calor e umidade'
        ]
    },
    {
        id: 'closets',
        tag: 'Organização & Requinte',
        title: 'CLOSETS MASTER',
        subtitle: 'O conceito de boutique particular dentro do seu quarto.',
        desc: 'Ambientes desenhados para valorizar suas roupas, joias e acessórios com sofisticação absoluta. Combinamos portas deslizantes estruturadas em perfil preto fosco, vidro reflecta bronze com proteção térmica e visual, gaveteiros com corrediças invisíveis aveludadas e iluminação perimetral automatizada acionada por sensores inteligentes de presença.',
        image: 'assets/images/project-02-closet.jpg',
        features: [
            'Vidro reflecta bronze com proteção UV e perfis slim',
            'Gaveteiros aveludados para joias e relógios',
            'Iluminação perimetral vertical em LED de alta fidelidade',
            'Sapateiras deslizantes inclinadas e módulos ventilados'
        ]
    },
    {
        id: 'theater',
        tag: 'Conforto & Acústica',
        title: 'HOME THEATER & LIVING',
        subtitle: 'Imersão audiovisual com harmonia arquitetônica impecável.',
        desc: 'Salas de estar e cinemas residenciais concebidos para proporcionar conforto absoluto sem fiação à mostra. Desenvolvemos painéis ripados contemporâneos em madeira nobre, nichos retroiluminados com controle dimmer de intensidade e móveis técnicos projetados para ventilação passiva de equipamentos eletrônicos e fidelidade acústica.',
        image: 'assets/images/project-04-theater.jpg',
        features: [
            'Fiação 100% embutida e gestão técnica de equipamentos',
            'Painéis ripados contemporâneos com conforto acústico',
            'Racks suspensos com ventilação passiva e portas em tela acústica',
            'Nichos em balanço com retroiluminação linear em LED'
        ]
    },
    {
        id: 'suites',
        tag: 'Intimidade & Relaxamento',
        title: 'SUÍTES & DORMITÓRIOS',
        subtitle: 'Refúgios de acolhimento e repouso milimetricamente pensados.',
        desc: 'Criamos dormitórios que convidam ao descanso com soluções sob medida que aproveitam cada centímetro da planta. Cabeceiras estofadas integradas a painéis de madeira, mesas de cabeceira suspensas com portas USB e carregadores por indução, e armários discretos com fechamento suave proporcionam atmosfera intimista e repousante.',
        image: 'assets/images/project-09-suite.jpg',
        features: [
            'Cabeceiras estofadas integradas a painéis de madeira nobre',
            'Criados-mudos suspensos com carregamento por indução',
            'Iluminação indireta quente pensada para relaxamento',
            'Aproveitamento milimétrico de cada espaço com roupeiros inteligentes'
        ]
    },
    {
        id: 'gourmet',
        tag: 'Convivência & Degustação',
        title: 'ESPAÇOS GOURMET & ADEGAS',
        subtitle: 'O cenário ideal para celebrar os melhores momentos com exclusividade.',
        desc: 'Projetamos adegas climatizadas personalizadas e áreas gourmet completas com materiais de altíssima resistência. Desde cristaleiras iluminadas com perfis nobres e suportes metálicos para garrafas até bancadas de apoio integradas com cooktops e chopeiras, transformando o ato de receber em uma verdadeira celebração.',
        image: 'assets/images/project-11-wine.jpg',
        features: [
            'Adegas climatizadas sob medida com isolamento térmico',
            'Cristaleiras com perfis nobres e vidro duplo temperado',
            'Suportes cênicos iluminados para rótulos especiais',
            'Marcenaria tratada para áreas de churrasqueira e bar molhado'
        ]
    },
    {
        id: 'office',
        tag: 'Foco & Produtividade',
        title: 'HOME OFFICE & CORPORATIVO',
        subtitle: 'Estações de trabalho elegantes, ergonômicas e funcionais.',
        desc: 'Seja para a rotina diária de trabalho remoto ou ambientes executivos corporativos, nossos projetos aliam ergonomia estrita à sobriedade estética. Mesas com calhas para cabos e tomadas embutidas, estantes com nichos modulares para biblioteca e armários com fechos discretos proporcionam organização e foco total.',
        image: 'assets/images/project-08-office.jpg',
        features: [
            'Estações executivas ergonômicas com acabamento anti-reflexo',
            'Calhas invisíveis de cabos, conexões de rede e tomadas',
            'Estantes modulares com nichos iluminados para livros e acervos',
            'Armários discretos com fechamento suave por toque'
        ]
    },
    {
        id: 'banheiros',
        tag: 'Bem-estar & Requinte',
        title: 'BANHEIROS & LAVABOS',
        subtitle: 'Soluções inteligentes para ambientes de autocuidado e relaxamento.',
        desc: 'Marcenaria planejada com materiais especiais à prova d\'água e umidade, garantindo durabilidade eterna mesmo nas áreas mais úmidas. Gabinetes suspensos com gavetas ocultas para toalhas e cosméticos, molduras com espelho retroiluminado e nichos decorativos com acabamento impecável em MDF naval e vernizes de alta resistência.',
        image: 'assets/images/project-10-bath.jpg',
        features: [
            'MDF naval de alta densidade resistente a vapor e respingos',
            'Gavetas invisíveis com divisórias acrílicas organizadoras',
            'Espelhos com molduras e retroiluminação difusa suave',
            'Puxadores cava usinados com toque refinado e proteção especial'
        ]
    },
    {
        id: 'autoral',
        tag: 'Exclusividade Arquitetônica',
        title: 'MOBILIÁRIO AUTORAL',
        subtitle: 'Peças únicas desenhadas como verdadeiras obras de arte escultóricas.',
        desc: 'Para clientes e arquitetos que buscam soluções que desafiam o comum. Desenvolvemos peças conceituais exclusivas: painéis geométricos tridimensionais, aparadores com curvas sinuosas, estantes esculturais integradas ao teto e divisórias vazadas tipo muxarabi em lâminas nobres de madeira natural como Freijó, Nogueira e Pau-Ferro.',
        image: 'assets/images/project-13-library.jpg',
        features: [
            'Lâminas naturais de madeira selecionadas folha a folha',
            'Design autoral desenhado sob medida para soluções singulares',
            'Usinagem de alta precisão em curvas, ângulos e ripados complexos',
            'Acabamento aveludado com verniz de toque sedoso e proteção fosca'
        ]
    }
];

let currentThemeIndex = 0;

const themeModalBackdrop = document.getElementById('themeModalBackdrop');
const themeModalImg = document.getElementById('themeModalImg');
const themeModalBadge = document.getElementById('themeModalBadge');
const themeModalTag = document.getElementById('themeModalTag');
const themeModalTitle = document.getElementById('themeModalTitle');
const themeModalSubtitle = document.getElementById('themeModalSubtitle');
const themeModalDesc = document.getElementById('themeModalDesc');
const themeModalFeatures = document.getElementById('themeModalFeatures');
const themeModalCounter = document.getElementById('themeModalCounter');
const themeModalClose = document.getElementById('themeModalClose');
const themeModalPrev = document.getElementById('themeModalPrev');
const themeModalNext = document.getElementById('themeModalNext');
const themeModalCta = document.getElementById('themeModalCta');

function renderTheme(index) {
    if (index < 0) index = themesData.length - 1;
    if (index >= themesData.length) index = 0;
    currentThemeIndex = index;
    const theme = themesData[index];

    if (themeModalImg) {
        themeModalImg.style.opacity = '0.3';
        setTimeout(() => {
            themeModalImg.src = theme.image;
            themeModalImg.alt = theme.title;
            themeModalImg.style.opacity = '1';
        }, 120);
    }
    if (themeModalBadge) themeModalBadge.textContent = `Ambiente 0${index + 1} / 0${themesData.length}`;
    if (themeModalTag) themeModalTag.textContent = theme.tag;
    if (themeModalTitle) themeModalTitle.textContent = theme.title;
    if (themeModalSubtitle) themeModalSubtitle.textContent = theme.subtitle;
    if (themeModalDesc) themeModalDesc.textContent = theme.desc;
    if (themeModalCounter) themeModalCounter.textContent = `0${index + 1} / 0${themesData.length}`;

    if (themeModalFeatures) {
        themeModalFeatures.innerHTML = theme.features.map(feat => `
            <div class="theme-modal-feat-item">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>${feat}</span>
            </div>
        `).join('');
    }
}

function openThemeModal(index) {
    renderTheme(index);
    if (themeModalBackdrop) {
        themeModalBackdrop.classList.add('is-open');
        themeModalBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';

    // Notifica parent (se dentro de iframe) para ocultar navbar superior
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ ds: 'modal', open: true }, '*');
        }
    } catch (e) {}
}

function closeThemeModal() {
    if (themeModalBackdrop) {
        themeModalBackdrop.classList.remove('is-open');
        themeModalBackdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';

    // Notifica parent (se dentro de iframe) para restaurar navbar superior
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ ds: 'modal', open: false }, '*');
        }
    } catch (e) {}
}

function nextTheme() {
    renderTheme(currentThemeIndex + 1);
}

function prevTheme() {
    renderTheme(currentThemeIndex - 1);
}

// Vincula cada um dos 8 cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.setAttribute('data-theme-index', index);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('title', 'Clique para ver foto e detalhes deste ambiente');
    
    card.addEventListener('click', () => {
        openThemeModal(index);
    });

    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openThemeModal(index);
        }
    });
});

if (themeModalClose) {
    themeModalClose.addEventListener('click', closeThemeModal);
}

if (themeModalBackdrop) {
    themeModalBackdrop.addEventListener('click', (e) => {
        if (e.target === themeModalBackdrop) {
            closeThemeModal();
        }
    });
}

if (themeModalPrev) {
    themeModalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevTheme();
    });
}

if (themeModalNext) {
    themeModalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextTheme();
    });
}

if (themeModalCta) {
    themeModalCta.addEventListener('click', (e) => {
        e.preventDefault();
        closeThemeModal();
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (!themeModalBackdrop || !themeModalBackdrop.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
        closeThemeModal();
    } else if (e.key === 'ArrowRight') {
        nextTheme();
    } else if (e.key === 'ArrowLeft') {
        prevTheme();
    }
});

