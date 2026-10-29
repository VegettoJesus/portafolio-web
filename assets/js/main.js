document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;
    
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.getAttribute('data-bs-theme') === 'dark') {
            htmlElement.setAttribute('data-bs-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        } else {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        }
    });

    const navbar = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const faders = document.querySelectorAll('.fade-in-section');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                appearOnScroll.unobserve(entry.target); 
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) { // Si es móvil
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
                bsCollapse.hide();
            }
        });
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const allProjects = Array.from(document.querySelectorAll('.project-item')); 
    const paginationContainer = document.getElementById('pagination-container');
    
    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 4; 

    function renderProjects() {
        const filteredProjects = allProjects.filter(project => {
            return currentFilter === 'all' || project.getAttribute('data-category') === currentFilter;
        });

        allProjects.forEach(item => item.style.display = 'none');
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const projectsToShow = filteredProjects.slice(startIndex, endIndex);
        projectsToShow.forEach(item => {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease-in-out';
        });

        renderPagination(filteredProjects.length);
    }

    function renderPagination(totalItems) {
        paginationContainer.innerHTML = ''; 
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) return; 

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `btn ${i === currentPage ? 'btn-primary active' : 'btn-outline-primary'} rounded-circle mx-1 fw-bold`;
            btn.style.width = '40px';
            btn.style.height = '40px';
            btn.textContent = i;
            
            btn.addEventListener('click', () => {
                currentPage = i;
                renderProjects();
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            paginationContainer.appendChild(btn);
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'btn-primary');
                btn.classList.add('btn-outline-primary');
            });
            button.classList.remove('btn-outline-primary');
            button.classList.add('active', 'btn-primary');
            currentFilter = button.getAttribute('data-filter');
            currentPage = 1; 
            renderProjects();
        });
    });
    renderProjects();

    const modalsToLoad = [
        'proyecto1.html',
        'proyecto2.html',
        'proyecto3.html',
        'proyecto4.html',
        'proyecto5.html',
        'proyecto6.html',
        'proyecto8.html',
    ];

    const modalsContainer = document.getElementById('modals-container');

    async function loadModals() {
        try {
            const fetchPromises = modalsToLoad.map(modal => 
                fetch(`modals/${modal}`).then(response => {
                    if (!response.ok) throw new Error(`Error cargando ${modal}`);
                    return response.text();
                })
            );

            const modalsHTML = await Promise.all(fetchPromises);
            modalsContainer.innerHTML = modalsHTML.join('');
        } catch (error) {
        }
    }

    loadModals();

    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyIcon = document.getElementById('copyIcon');
    const copyText = document.getElementById('copyText');
    const emailAddress = 'jesusleonangulo@hotmail.com';

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(emailAddress);
                
                copyIcon.className = 'bi bi-check2-circle me-2 text-success';
                copyText.textContent = '¡Copiado!';
                copyEmailBtn.classList.replace('btn-outline-info', 'btn-success');
                copyEmailBtn.classList.add('text-white');

                setTimeout(() => {
                    copyIcon.className = 'bi bi-clipboard me-2';
                    copyText.textContent = 'Copiar correo';
                    copyEmailBtn.classList.replace('btn-success', 'btn-outline-info');
                    copyEmailBtn.classList.remove('text-white');
                }, 2000);

            } catch (err) {
                const textArea = document.createElement("textarea");
                textArea.value = emailAddress;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                
                copyIcon.className = 'bi bi-check2-circle me-2 text-success';
                copyText.textContent = '¡Copiado!';
                setTimeout(() => {
                    copyIcon.className = 'bi bi-clipboard me-2';
                    copyText.textContent = 'Copiar correo';
                }, 2000);
            }
        });
    }
});
