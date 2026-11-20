document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const audio = document.getElementById('background-music');
    const musicWidget = document.getElementById('music-widget');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('reading-progress-bar');

    const pages = document.querySelectorAll('.letter-page');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');
    const pageNav = document.querySelector('.page-nav');
    const container = document.querySelector('.container');
    const backLink = document.querySelector('.back-link');
    let currentPage = 0;
    let isReading = false;

    // Selama layar pembuka tampil, konten di belakangnya tidak boleh difokus.
    if (backLink && container && musicWidget) {
        backLink.inert = true;
        container.inert = true;
        musicWidget.inert = true;
    }

    // Kata interaktif bisa difokus dengan keyboard, termasuk di layar sentuh.
    document.querySelectorAll('.interactive-word').forEach((word) => {
        word.setAttribute('tabindex', '0');
        const note = word.getAttribute('data-tooltip');
        if (note) word.setAttribute('aria-label', `Catatan: ${note}`);
    });

    const setPlayIcon = (isPaused) => {
        playPauseBtn.dataset.playing = isPaused ? 'false' : 'true';
        playPauseBtn.title = isPaused ? 'Putar Musik' : 'Jeda Musik';
        playPauseBtn.setAttribute('aria-label', isPaused ? 'Putar musik' : 'Jeda musik');
    };

    // --- Logika Halaman Pembuka ---
    const startReading = () => {
        if (isReading) return;
        isReading = true;

        welcomeScreen.classList.add('hidden');
        welcomeScreen.setAttribute('aria-hidden', 'true');
        musicWidget.classList.add('visible');
        pageNav.classList.add('visible');

        if (backLink && container && musicWidget) {
            backLink.inert = false;
            container.inert = false;
            musicWidget.inert = false;
        }

        audio.play().then(() => {
            setPlayIcon(false);
        }).catch(() => {
            // Autoplay diblokir browser: pengguna tinggal menekan tombol putar.
            setPlayIcon(true);
        });

        updatePage();
    };

    welcomeScreen.addEventListener('click', startReading, { once: true });
    welcomeScreen.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            startReading();
        }
    });

    // --- Logika Navigasi Halaman ---
    function updatePage() {
        pages.forEach((page, index) => {
            page.classList.toggle('active', index === currentPage);
        });

        if (currentPage > 0) {
            pageIndicator.textContent = `${currentPage} / ${pages.length - 1}`;
        } else {
            pageIndicator.textContent = '';
        }

        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === pages.length - 1;

        if (progressBar) {
            const progress = (currentPage / (pages.length - 1)) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Fokus ke awal halaman saat berpindah, supaya pembaca layar ikut pindah.
        if (isReading && currentPage > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const goNext = () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePage();
        }
    };

    const goPrev = () => {
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    };

    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);

    document.addEventListener('keydown', (event) => {
        if (!isReading) return;
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

        if (event.key === 'ArrowRight' || event.key === 'PageDown') {
            event.preventDefault();
            goNext();
        } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
            event.preventDefault();
            goPrev();
        } else if (event.key === 'Home') {
            event.preventDefault();
            currentPage = 0;
            updatePage();
        } else if (event.key === 'End') {
            event.preventDefault();
            currentPage = pages.length - 1;
            updatePage();
        }
    });

    // Geser untuk mobile
    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (event) => {
        if (!isReading) return;
        const deltaX = event.changedTouches[0].screenX - touchStartX;
        const deltaY = event.changedTouches[0].screenY - touchStartY;

        if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) return;

        if (deltaX < 0) goNext();
        else goPrev();
    }, { passive: true });

    // --- Logika Tombol Play/Pause di Widget ---
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            setPlayIcon(false);
        } else {
            audio.pause();
            setPlayIcon(true);
        }
    });

    updatePage();
});
