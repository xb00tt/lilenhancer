# lilenhancer

Little userscripts that enhance websites.

## MoviesCountdown Quick Links

[`moviescountdown-links.user.js`](moviescountdown-links.user.js)

Adds search buttons next to the Simkl button on [moviescountdown.com](https://moviescountdown.com) movie pages, styled like the site's own button. Also shortens the Simkl button label to "Simkl".

Out of the box it shows **Stremio**, **MetaCritic**, **Google** and **YouTube Trailer**. For `https://moviescountdown.com/2616611/primetime`:

| Button | Opens |
|---|---|
| Stremio | `https://web.stremio.com/#/search?search=Primetime%202026` |
| MetaCritic | `https://www.metacritic.com/search/Primetime/` |
| Google | `https://google.com/search?q=Primetime+2026` |
| YouTube Trailer | `https://www.youtube.com/results?search_query=Primetime+2026+trailer` |

More presets are included but off: IMDb, Letterboxd, Rotten Tomatoes, Trakt, TMDB and Wikipedia.

### Customize

Click the gear button at the end of the row, or choose **Settings…** in the Tampermonkey menu, to:

- show or hide buttons, reorder them, edit or remove them;
- add your own: a label, a URL where `{title}` and `{year}` get replaced with the movie's title and year (URL-encoded), and an icon — a [Simple Icons](https://simpleicons.org/) name (e.g. `reddit`), an image URL, or empty;
- reset everything to the defaults.

The Tampermonkey menu also lists every button with a checkbox to switch it on or off. Settings are stored by the userscript manager, per browser.

### Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Install from [Greasy Fork](https://greasyfork.org/en/scripts/603618-moviescountdown-quick-links), or open the [raw script](https://raw.githubusercontent.com/xb00tt/lilenhancer/main/moviescountdown-links.user.js) and confirm the install.

In Chrome-based browsers, Tampermonkey needs "Allow User Scripts" turned on in the extension's details page.

### Notes

- Button icons come from [Simple Icons](https://simpleicons.org/) and the gear from [Tabler Icons](https://tabler.io/icons), both via jsDelivr.

## License

[MIT](LICENSE)
