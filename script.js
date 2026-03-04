    window.onload = function() {

        /* ── NAV ── */
        var navbar = document.getElementById('navbar');
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });

        /* ── LIBRO ── */
        var slideIds = ['slide-cover', 'slide-page1', 'slide-page2', 'slide-back'];
        var current  = 0;

        function goTo(n) {
            // ocultar todos
            for (var i = 0; i < slideIds.length; i++) {
                var el = document.getElementById(slideIds[i]);
                if (el) el.style.display = 'none';
            }
            // mostrar el pedido
            var show = document.getElementById(slideIds[n]);
            if (show) show.style.display = 'block';
            current = n;

            // dots
            var dots = document.querySelectorAll('.book-dot');
            for (var j = 0; j < dots.length; j++) {
                dots[j].classList.toggle('active', j === n);
            }

            // flechas
            var prev = document.getElementById('prevPage');
            var next = document.getElementById('nextPage');
            if (prev) prev.disabled = (n === 0);
            if (next) next.disabled = (n === slideIds.length - 1);
        }

        // Botón Abrir
        var btnOpen = document.getElementById('openBook');
        if (btnOpen) btnOpen.onclick = function() { goTo(1); };

        // Botón Volver
        var btnClose = document.getElementById('closeBook');
        if (btnClose) btnClose.onclick = function() { goTo(0); };

        // Flechas
        var prevBtn = document.getElementById('prevPage');
        var nextBtn = document.getElementById('nextPage');
        if (prevBtn) prevBtn.onclick = function() { if (current > 0) goTo(current - 1); };
        if (nextBtn) nextBtn.onclick = function() { if (current < slideIds.length - 1) goTo(current + 1); };

        // Dots
        var dots = document.querySelectorAll('.book-dot');
        for (var d = 0; d < dots.length; d++) {
            (function(idx) {
                dots[idx].onclick = function() { goTo(idx); };
            })(d);
        }

        // Swipe móvil
        var book = document.getElementById('book');
        var touchX = 0;
        if (book) {
            book.addEventListener('touchstart', function(e) {
                touchX = e.changedTouches[0].screenX;
            }, { passive: true });
            book.addEventListener('touchend', function(e) {
                var diff = touchX - e.changedTouches[0].screenX;
                if (diff > 50 && current < slideIds.length - 1) goTo(current + 1);
                if (diff < -50 && current > 0) goTo(current - 1);
            }, { passive: true });
        }

        // Arrancar en portada
        goTo(0);

        /* ── STATS CONTADOR ── */
        var statNums   = document.querySelectorAll('.stat-num');
        var statsReady = false;
        function runStats() {
            if (statsReady) return;
            statsReady = true;
            for (var i = 0; i < statNums.length; i++) {
                (function(el) {
                    var raw    = el.textContent;
                    var num    = parseInt(raw);
                    var suffix = raw.replace(/[0-9]/g, '');
                    var cur    = 0;
                    var step   = Math.ceil(num / 60);
                    var t = setInterval(function() {
                        cur = Math.min(cur + step, num);
                        el.textContent = cur + suffix;
                        if (cur >= num) clearInterval(t);
                    }, 25);
                })(statNums[i]);
            }
        }
        var statsSection = document.querySelector('.stats');
        if (statsSection) {
            window.addEventListener('scroll', function() {
                if (statsSection.getBoundingClientRect().top < window.innerHeight) runStats();
            });
        }

    }; // fin window.onload