// Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    // No prevenimos el envío para que mailto funcione
    document.getElementById('formSuccessModal').style.display = 'flex';
    setTimeout(() => contactForm.reset(), 1000); // Reset después de 1s
});

// Close Form Modal
function closeFormModal() {
    const modal = document.getElementById('formSuccessModal');
    modal.style.animation = 'fadeOutDown 0.5s ease-out';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = 'fadeInUp 0.5s ease-out'; // Reset animation
    }, 500);
}

// Close Form Modal on Outside Click
window.addEventListener('click', (event) => {
    const modal = document.getElementById('formSuccessModal');
    if (event.target === modal) {
        closeFormModal();
    }
});

// Smooth Scroll and Active Section
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('section');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });

        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Modal Functions (RADEC)
function openModal() {
    document.getElementById('radecModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('radecModal').style.display = 'none';
}

window.onclick = function(event) {
    const radecModal = document.getElementById('radecModal');
    if (event.target === radecModal) {
        radecModal.style.display = 'none';
    }
};

// Carousel
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

setInterval(nextSlide, 5000);

// Fetch Fuel Prices Client-Side
async function fetchFuelPrices() {
    const url = 'https://petrointelligence.com/sistema/indices/gasolinera.php?permiso=PL/24694/EXP/ES/2022';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    try {
        const response = await fetch(proxyUrl + url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        if (!response.ok) throw new Error('No se pudo obtener la página');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Buscar la tabla de precios con un enfoque más específico
        const priceTable = doc.querySelector('.table.table-striped');
        let magna = 'N/A', premium = 'N/A', diesel = 'N/A';

        if (priceTable) {
            const rows = priceTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const fuelType = cells[0].textContent.trim().toLowerCase();
                    const price = cells[1].textContent.trim().replace('$', '').replace(',', '') || 'N/A';
                    if (fuelType.includes('magna')) magna = price;
                    if (fuelType.includes('premium')) premium = price;
                    if (fuelType.includes('diésel') || fuelType.includes('diesel')) diesel = price;
                }
            });
        } else {
            console.warn('Tabla de precios no encontrada');
        }

        // Asignar precios con formato
        document.getElementById('price-magna').textContent = magna !== 'N/A' ? `$${parseFloat(magna).toFixed(2)} / litro` : 'N/A';
        document.getElementById('price-premium').textContent = premium !== 'N/A' ? `$${parseFloat(premium).toFixed(2)} / litro` : 'N/A';
        document.getElementById('price-diesel').textContent = diesel !== 'N/A' ? `$${parseFloat(diesel).toFixed(2)} / litro` : 'N/A';
    } catch (error) {
        console.error('Error al obtener precios:', error);
        document.getElementById('price-magna').textContent = '$23.39 / litro'; // Valores predeterminados
        document.getElementById('price-premium').textContent = '$24.60 / litro';
        document.getElementById('price-diesel').textContent = '$25.91 / litro';
        // Opcional: Mostrar alerta amigable
        // alert('No se pudieron obtener los precios actualizados. Mostrando precios predeterminados.');
    }
}


// Update Date
function updateDate() {
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('es-MX', options);
    document.getElementById('price-date').textContent = `actualizados al ${formattedDate}`;
}

// Check for midnight to update date and prices
function checkMidnight() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        updateDate();
        fetchFuelPrices();
    }
}

// Initial load
updateDate();
fetchFuelPrices();

setInterval(checkMidnight, 60000);

// Update Date
function updateDate() {
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('es-MX', options);
    document.getElementById('price-date').textContent = `actualizados al ${formattedDate}`;
}

// Check for midnight to update date and prices
function checkMidnight() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        updateDate();
        fetchFuelPrices();
    }
}

// Initial load
updateDate();
fetchFuelPrices();

setInterval(checkMidnight, 60000);