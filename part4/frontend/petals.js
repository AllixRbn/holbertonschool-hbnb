/* ================================================
   HBnB — petals.js
   Sakura petal animation · Theme toggle
   ================================================ */
(function () {
    'use strict';

    const PALETTES = {
        light: [
            'rgba(247,198,217,0.65)',
            'rgba(253,232,240,0.55)',
            'rgba(232,150,180,0.45)',
            'rgba(255,210,228,0.55)',
            'rgba(240,180,210,0.40)',
        ],
        dark: [
            'rgba(196, 96,160,0.34)',
            'rgba( 80, 28, 68,0.52)',
            'rgba(200,108,168,0.30)',
            'rgba(220,140,190,0.26)',
            'rgba( 56, 18, 52,0.46)',
        ],
    };

    const PETAL_COUNT = 14;

    function buildPetals() {
        const container = document.getElementById('petals-container');
        if (!container) return;

        const isDark = document.documentElement.dataset.theme === 'dark';
        const colors = isDark ? PALETTES.dark : PALETTES.light;
        container.innerHTML = '';

        for (let i = 0; i < PETAL_COUNT; i++) {
            const el   = document.createElement('div');
            el.className = 'petal';
            const size  = 7  + Math.random() * 14;
            const left  = Math.random() * 97;
            const dur   = 10 + Math.random() * 14;
            const delay = -(Math.random() * 24);
            const color = colors[Math.floor(Math.random() * colors.length)];

            el.style.cssText = [
                `width:${size}px`,
                `height:${(size * 0.62).toFixed(1)}px`,
                `left:${left.toFixed(1)}%`,
                `background:${color}`,
                `animation-duration:${dur.toFixed(1)}s`,
                `animation-delay:${delay.toFixed(1)}s`,
            ].join(';');

            container.appendChild(el);
        }
    }

    function applyTheme(dark) {
        const root = document.documentElement;
        const btn  = document.getElementById('theme-toggle');
        if (dark) {
            root.dataset.theme = 'dark';
            if (btn) btn.textContent = '☀️';
        } else {
            delete root.dataset.theme;
            if (btn) btn.textContent = '🌸';
        }
    }

    function setupThemeToggle() {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        const saved = localStorage.getItem('hbnb-theme');
        applyTheme(saved === 'dark');
        buildPetals();

        btn.addEventListener('click', () => {
            const isDark = document.documentElement.dataset.theme === 'dark';
            applyTheme(!isDark);
            localStorage.setItem('hbnb-theme', !isDark ? 'dark' : 'light');
            buildPetals();
        });
    }

    /* Observe dynamic containers and trigger staggered animation */
    function observeDynamic() {
        ['places-list', 'reviews'].forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const mo = new MutationObserver(() => {
                if (typeof window.animateCards === 'function') window.animateCards();
            });
            mo.observe(el, { childList: true });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupThemeToggle();
        observeDynamic();
    });
})();
