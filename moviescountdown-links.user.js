// ==UserScript==
// @name         MoviesCountdown Quick Links
// @namespace    https://github.com/xb00tt/lilenhancer
// @version      1.2.5
// @description  Adds Stremio, MetaCritic, Google and YouTube Trailer buttons next to the Simkl button on moviescountdown.com movie pages
// @author       xb00tt
// @license      MIT
// @icon         https://eu.simkl.in/img_moviescountdown/favicon/favicon-32x32.png
// @homepageURL  https://github.com/xb00tt/lilenhancer
// @supportURL   https://github.com/xb00tt/lilenhancer/issues
// @match        https://moviescountdown.com/*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const moreInfo = document.querySelector('countdown-content-page-info-right-more-info');
    const title = document.querySelector('countdown-content-page-info-right-title h1')?.textContent.trim();
    if (!moreInfo || !title) return;

    const meta = document.querySelector('countdown-content-page-info-right-meta')?.textContent || '';
    const year = meta.match(/\b(19|20)\d{2}\b/)?.[0] || '';
    const titleYear = year ? `${title} ${year}` : title;
    const q = (s) => new URLSearchParams({ x: s }).toString().slice(2); // spaces as '+'

    const links = [
        ['Stremio', 'stremio', `https://web.stremio.com/#/search?search=${encodeURIComponent(titleYear)}`],
        ['MetaCritic', 'metacritic', `https://www.metacritic.com/search/${encodeURIComponent(title)}/`],
        ['Google', 'google', `https://google.com/search?q=${q(titleYear)}`],
        ['YouTube Trailer', 'youtube', `https://www.youtube.com/results?search_query=${q(titleYear + ' trailer')}`],
    ];

    // Mirrors the site's "More details" button (its label lives in a CSS ::after we can't reuse)
    const style = document.createElement('style');
    style.textContent = `
        countdown-content-page-info-right-more-info { flex-wrap: wrap; gap: 0 8px; }
        .mcl-btn {
            display: flex; align-items: center; gap: 6px; margin-top: 12px; padding: 8px;
            border-radius: 6px; background: rgba(255,255,255,.1); color: #fff;
            font: 600 14px Nunito, "Open Sans", sans-serif; text-decoration: none;
        }
        .mcl-btn:hover { background: rgb(12 15 17 / 50%); }
        .mcl-btn::before {
            content: "" !important; width: 20px; height: 20px; background: currentColor !important;
            -webkit-mask: var(--mcl-icon) center / auto 16px no-repeat; mask: var(--mcl-icon) center / auto 16px no-repeat;
        }
        .mcl-btn::after { content: none !important; display: none !important; }
        countdown-content-page-info-right-more-info a:not(.mcl-btn)::after { content: "Simkl" !important; }
        countdown-content-page-info-right-more-info a:not(.mcl-btn)::before { background-size: 24px !important; background-position: center !important; }
        /* Trim labels to cap height so flex centring lines icons up with the text's centre */
        .mcl-btn span, countdown-content-page-info-right-more-info a:not(.mcl-btn)::after {
            display: block; text-box: trim-both cap alphabetic;
        }
    `;
    document.head.append(style);

    for (const [label, icon, href] of links) {
        const a = document.createElement('a');
        a.className = 'mcl-btn';
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.append(Object.assign(document.createElement('span'), { textContent: label }));
        a.style.setProperty('--mcl-icon', `url(https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/${icon}.svg)`);
        moreInfo.append(a);
    }
})();
