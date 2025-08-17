document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const audio = document.getElementById('background-music');
    const musicWidget = document.getElementById('music-widget');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const btnIcon = playPauseBtn.querySelector('i');

    const pages = document.querySelectorAll('.letter-page');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');
    const pageNav = document.querySelector('.page-nav');
    let currentPage = 0;

    // --- Logika Halaman Pembuka ---
    welcomeScreen.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');

        audio.play().then(() => {
            musicWidget.classList.add('visible');
        }).catch(error => {
            console.log("Browser memblokir autoplay, audio akan dimulai saat tombol ditekan.");
            musicWidget.classList.add('visible');
            btnIcon.classList.remove('fa-pause');
            btnIcon.classList.add('fa-play');
            playPauseBtn.title = 'Putar Musik';
        });
        
        // Tampilkan navigasi setelah halaman pembuka hilang
        pageNav.classList.add('visible');
        updatePage();

    }, { once: true });

    // --- Logika Navigasi Halaman ---
    function updatePage() {
        pages.forEach((page, index) => {
            page.classList.remove('active');
            if (index === currentPage) {
                page.classList.add('active');
            }
        });

        // Update indikator halaman (mengabaikan halaman judul)
        if (currentPage > 0) {
            pageIndicator.textContent = `${currentPage}/${pages.length - 1}`;
        } else {
            pageIndicator.textContent = '';
        }
        
        // Atur status tombol prev/next
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === pages.length - 1;
    }

    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePage();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    });

    // --- Logika Tombol Play/Pause di Widget ---
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            btnIcon.classList.remove('fa-play');
            btnIcon.classList.add('fa-pause');
            playPauseBtn.title = 'Jeda Musik';
        } else {
            audio.pause();
            btnIcon.classList.remove('fa-pause');
            btnIcon.classList.add('fa-play');
            playPauseBtn.title = 'Putar Musik';
        }
    });

    // Inisialisasi halaman pertama
    updatePage();
});