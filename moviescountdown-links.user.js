// ==UserScript==
// @name         MoviesCountdown Quick Links
// @namespace    https://github.com/xb00tt/lilenhancer
// @version      1.3.0
// @description  Adds customizable search buttons (Stremio, MetaCritic, Google, YouTube Trailer and more) next to the Simkl button on moviescountdown.com movie pages
// @author       xb00tt
// @license      MIT
// @icon         https://eu.simkl.in/img_moviescountdown/favicon/favicon-32x32.png
// @homepageURL  https://github.com/xb00tt/lilenhancer
// @supportURL   https://github.com/xb00tt/lilenhancer/issues
// @match        https://moviescountdown.com/*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// ==/UserScript==

(async function () {
    'use strict';

    const moreInfo = document.querySelector('countdown-content-page-info-right-more-info');
    const title = document.querySelector('countdown-content-page-info-right-title h1')?.textContent.trim();
    if (!moreInfo || !title) return;

    const meta = document.querySelector('countdown-content-page-info-right-meta')?.textContent || '';
    const year = meta.match(/\b(19|20)\d{2}\b/)?.[0] || '';

    // url: {title} and {year} are replaced URL-encoded. icon: Simple Icons slug, image URL, or empty.
    const DEFAULTS = [
        { label: 'Stremio', url: 'https://web.stremio.com/#/search?search={title}%20{year}', icon: 'stremio', enabled: true },
        { label: 'MetaCritic', url: 'https://www.metacritic.com/search/{title}/', icon: 'metacritic', enabled: true },
        { label: 'Google', url: 'https://google.com/search?q={title}+{year}', icon: 'google', enabled: true },
        { label: 'YouTube Trailer', url: 'https://www.youtube.com/results?search_query={title}+{year}+trailer', icon: 'youtube', enabled: true },
        { label: 'IMDb', url: 'https://www.imdb.com/find/?s=tt&q={title}%20{year}', icon: 'imdb', enabled: false },
        { label: 'Letterboxd', url: 'https://letterboxd.com/search/films/{title}/', icon: 'letterboxd', enabled: false },
        { label: 'Rotten Tomatoes', url: 'https://www.rottentomatoes.com/search?search={title}', icon: 'rottentomatoes', enabled: false },
        { label: 'Trakt', url: 'https://trakt.tv/search/movies?query={title}', icon: 'trakt', enabled: false },
        { label: 'TMDB', url: 'https://www.themoviedb.org/search/movie?query={title}%20y:{year}', icon: 'themoviedatabase', enabled: false },
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/w/index.php?search={title}+{year}+film', icon: 'wikipedia', enabled: false },
    ];
    const GEAR = 'https://cdn.jsdelivr.net/npm/@tabler/icons@3.19.0/icons/outline/settings.svg';
    const clone = (list) => list.map((b) => ({ ...b }));
    let buttons = (await GM.getValue('buttons')) || clone(DEFAULTS);

    const isHttp = (s) => /^https?:\/\//i.test(s);
    const fill = (tpl) => tpl.replace(/\{(title|year)\}/g, (_, k) => encodeURIComponent(k === 'title' ? title : year));
    const el = (tag, props = {}, ...kids) => {
        const e = Object.assign(document.createElement(tag), props);
        e.append(...kids);
        return e;
    };

    // Simple Icons slugs are drawn as a mask in the text colour; image URLs as-is (masks need CORS, plain images don't)
    function iconEl(icon, mono = !isHttp(icon)) {
        const i = el('i', { className: 'mcl-icon' });
        if (!icon) return i;
        const src = isHttp(icon) ? icon : `https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/${encodeURIComponent(icon.toLowerCase())}.svg`;
        i.classList.add(mono ? 'mono' : 'image');
        i.style.setProperty('--mcl-icon', `url(${JSON.stringify(src)})`);
        return i;
    }

    // Mirrors the site's "More details" button (its label lives in a CSS ::after we can't reuse)
    const style = document.createElement('style');
    style.textContent = `
        countdown-content-page-info-right-more-info { flex-wrap: wrap; gap: 0 8px; }
        .mcl-btn {
            display: flex; align-items: center; gap: 6px; margin-top: 12px; padding: 8px;
            border: 0; border-radius: 6px; background: rgba(255,255,255,.1); color: #fff; cursor: pointer;
            font: 600 14px Nunito, "Open Sans", sans-serif; text-decoration: none;
        }
        .mcl-btn:hover { background: rgb(12 15 17 / 50%); }
        .mcl-btn::before, .mcl-btn::after { content: none !important; display: none !important; }
        .mcl-icon { width: 20px; height: 20px; flex: none; }
        .mcl-icon.mono {
            background: currentColor;
            -webkit-mask: var(--mcl-icon) center / auto 16px no-repeat; mask: var(--mcl-icon) center / auto 16px no-repeat;
        }
        .mcl-icon.image { background: var(--mcl-icon) center / auto 16px no-repeat; }
        countdown-content-page-info-right-more-info a:not(.mcl-btn)::after { content: "Simkl" !important; }
        countdown-content-page-info-right-more-info a:not(.mcl-btn)::before { background-size: 24px !important; background-position: center !important; }
        /* Trim labels to cap height so flex centring lines icons up with the text's centre */
        .mcl-btn span, countdown-content-page-info-right-more-info a:not(.mcl-btn)::after {
            display: block; text-box: trim-both cap alphabetic;
        }

        .mcl-dialog {
            width: min(860px, calc(100vw - 32px)); max-height: calc(100vh - 64px); padding: 20px;
            border: 0; border-radius: 10px; background: #26282b; color: #fff;
            font: 14px Nunito, "Open Sans", sans-serif; box-shadow: 0 10px 40px rgb(0 0 0 / 60%);
        }
        .mcl-dialog::backdrop { background: rgb(0 0 0 / 60%); }
        .mcl-dialog h2 { margin: 0 0 4px; font-size: 18px; }
        .mcl-dialog p { margin: 0 0 14px; color: #aaa; font-size: 13px; }
        .mcl-dialog p code, .mcl-dialog p a { color: #ddd; }
        .mcl-rows { display: grid; gap: 6px; }
        .mcl-row { display: grid; grid-template-columns: auto 20px 1fr 2.4fr 1fr auto auto auto; gap: 6px; align-items: center; }
        .mcl-row input[type=text] {
            min-width: 0; padding: 6px 8px; border: 1px solid #444; border-radius: 6px;
            background: #1b1c1e; color: #fff; font: inherit;
        }
        .mcl-row input[type=checkbox] { width: 16px; height: 16px; margin: 0; accent-color: #fff; }
        .mcl-dialog button {
            padding: 6px 10px; border: 0; border-radius: 6px; background: rgba(255,255,255,.1);
            color: #fff; font: 600 13px Nunito, "Open Sans", sans-serif; cursor: pointer;
        }
        .mcl-dialog button:hover { background: rgba(255,255,255,.2); }
        .mcl-dialog button:disabled { opacity: .3; cursor: default; }
        .mcl-dialog button.mcl-primary { background: #fff; color: #111; }
        .mcl-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .mcl-actions .mcl-spacer { flex: 1; }
        @media (max-width: 640px) {
            .mcl-row { grid-template-columns: auto 20px 1fr auto auto auto; }
            .mcl-row .mcl-url, .mcl-row .mcl-icon-input { grid-column: 3 / -1; }
        }
    `;
    document.head.append(style);

    function render() {
        moreInfo.querySelectorAll('.mcl-btn').forEach((e) => e.remove());
        for (const b of buttons) {
            if (!b.enabled || !isHttp(b.url)) continue;
            moreInfo.append(el('a', { className: 'mcl-btn', href: fill(b.url), target: '_blank', rel: 'noopener' },
                iconEl(b.icon), el('span', { textContent: b.label })));
        }
        moreInfo.append(el('button', { className: 'mcl-btn', type: 'button', title: 'Quick Links settings', onclick: openSettings },
            iconEl(GEAR, true)));
    }

    async function save(list) {
        buttons = list;
        await GM.setValue('buttons', buttons);
        render();
        registerMenu();
    }

    let menuIds = [];
    function registerMenu() {
        if (typeof GM_registerMenuCommand !== 'function') return;
        menuIds.forEach((id) => GM_unregisterMenuCommand?.(id));
        menuIds = [GM_registerMenuCommand('Settings…', openSettings)];
        buttons.forEach((b, i) => menuIds.push(GM_registerMenuCommand(`${b.enabled ? '☑' : '☐'} ${b.label}`, () => {
            const list = clone(buttons);
            list[i].enabled = !list[i].enabled;
            save(list);
        })));
    }

    function openSettings() {
        let draft = clone(buttons);
        const rows = el('div', { className: 'mcl-rows' });

        function drawRows() {
            rows.replaceChildren(...draft.map((b, i) => {
                const move = (d) => { [draft[i], draft[i + d]] = [draft[i + d], draft[i]]; drawRows(); };
                return el('div', { className: 'mcl-row' },
                    el('input', { type: 'checkbox', checked: b.enabled, title: 'Show', onchange: (e) => { b.enabled = e.target.checked; } }),
                    iconEl(b.icon),
                    el('input', { type: 'text', value: b.label, placeholder: 'Label', oninput: (e) => { b.label = e.target.value; } }),
                    el('input', { type: 'text', className: 'mcl-url', value: b.url, placeholder: 'https://…{title}…', oninput: (e) => { b.url = e.target.value.trim(); } }),
                    el('input', { type: 'text', className: 'mcl-icon-input', value: b.icon, placeholder: 'Icon', onchange: (e) => { b.icon = e.target.value.trim(); drawRows(); } }),
                    el('button', { type: 'button', textContent: '↑', title: 'Move up', disabled: i === 0, onclick: () => move(-1) }),
                    el('button', { type: 'button', textContent: '↓', title: 'Move down', disabled: i === draft.length - 1, onclick: () => move(1) }),
                    el('button', { type: 'button', textContent: '✕', title: 'Remove', onclick: () => { draft.splice(i, 1); drawRows(); } }));
            }));
        }

        const dialog = el('dialog', { className: 'mcl-dialog' },
            el('h2', { textContent: 'Quick Links' }),
            el('p', {}, 'In URLs, ', el('code', { textContent: '{title}' }), ' and ', el('code', { textContent: '{year}' }),
                ' are replaced with the movie\'s title and year. Icon: a ',
                el('a', { href: 'https://simpleicons.org/', target: '_blank', rel: 'noopener', textContent: 'Simple Icons' }),
                ' name (e.g. imdb), an image URL, or empty.'),
            rows,
            el('div', { className: 'mcl-actions' },
                el('button', { type: 'button', textContent: '+ Add button', onclick: () => {
                    draft.push({ label: 'New button', url: 'https://', icon: '', enabled: true });
                    drawRows();
                    rows.lastChild.querySelector('input[type=text]').select();
                } }),
                el('button', { type: 'button', textContent: 'Reset to defaults', onclick: () => {
                    if (confirm('Replace all buttons with the defaults?')) { draft = clone(DEFAULTS); drawRows(); }
                } }),
                el('span', { className: 'mcl-spacer' }),
                el('button', { type: 'button', textContent: 'Cancel', onclick: () => dialog.close() }),
                el('button', { type: 'button', className: 'mcl-primary', textContent: 'Save', onclick: () => {
                    const bad = draft.find((b) => !b.label.trim() || !isHttp(b.url));
                    if (bad) return alert(`"${bad.label.trim() || '(no label)'}" needs a label and a URL starting with http:// or https://`);
                    save(draft);
                    dialog.close();
                } })));

        drawRows();
        dialog.addEventListener('close', () => dialog.remove());
        document.body.append(dialog);
        dialog.showModal();
    }

    render();
    registerMenu();
})();
