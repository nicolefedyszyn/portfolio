// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hamburger script loaded');
    
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    
    console.log('Hamburger element:', hamburger);
    console.log('Nav menu element:', navMenu);
    
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            const isExpanded = hamburger.classList.contains("active");
            hamburger.setAttribute("aria-expanded", isExpanded);
            // Dynamically set top offset for the menu to avoid overlapping header controls
            if (isExpanded) {
                const header = document.querySelector('header');
                if (header) {
                    const offset = Math.ceil(header.getBoundingClientRect().height);
                    document.documentElement.style.setProperty('--menu-top-offset', offset + 'px');
                }
            }
        });

        // Close menu when clicking on a nav link
        document.querySelectorAll(".nav-menu a").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            // clear hover state
            navMenu.querySelectorAll('a.hovering').forEach(a => a.classList.remove('hovering'));
        }));

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
                // clear hover state
                navMenu.querySelectorAll('a.hovering').forEach(a => a.classList.remove('hovering'));
            }
        });

        // Pointer-driven hover to "trigger when you pass" over items (works on mouse and touch)
        const setHover = (el) => {
            if (!navMenu.classList.contains('active')) return;
            if (!el) return;
            const link = el.closest('a');
            if (!link || !navMenu.contains(link)) return;
            const current = navMenu.querySelector('a.hovering');
            if (current === link) return;
            if (current) current.classList.remove('hovering');
            link.classList.add('hovering');
        };
        const clearHover = () => {
            navMenu.querySelectorAll('a.hovering').forEach(a => a.classList.remove('hovering'));
        };

        // Mouse pointer hover
        navMenu.addEventListener('pointerover', (e) => setHover(e.target));
        navMenu.addEventListener('pointerout', (e) => {
            if (!navMenu.contains(e.relatedTarget)) clearHover();
        });
        navMenu.addEventListener('pointermove', (e) => {
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (el) setHover(el);
        });

        // Touch hover while finger passes over items
        navMenu.addEventListener('touchmove', (e) => {
            const t = e.touches && e.touches[0];
            if (!t) return;
            const el = document.elementFromPoint(t.clientX, t.clientY);
            if (el) setHover(el);
        }, { passive: true });
        navMenu.addEventListener('touchend', clearHover, { passive: true });
    }
});
