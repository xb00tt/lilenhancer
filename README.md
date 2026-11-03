# lilenhancer

Little userscripts that enhance websites.

## MoviesCountdown Quick Links

[`moviescountdown-links.user.js`](moviescountdown-links.user.js)

Adds **Stremio**, **MetaCritic**, **Google** and **YouTube Trailer** buttons next to the Simkl button on [moviescountdown.com](https://moviescountdown.com) movie pages, styled like the site's own button. Also shortens the Simkl button label to "Simkl".

Each button searches for the movie's title (plus release year, except MetaCritic). For `https://moviescountdown.com/2616611/primetime`:

| Button | Opens |
|---|---|
| Stremio | `https://web.stremio.com/#/search?search=Primetime%202026` |
| MetaCritic | `https://www.metacritic.com/search/Primetime/` |
| Google | `https://google.com/search?q=Primetime+2026` |
| YouTube Trailer | `https://www.youtube.com/results?search_query=Primetime+2026+trailer` |

### Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Install from [Greasy Fork](https://greasyfork.org/en/scripts/603618-moviescountdown-quick-links), or open the [raw script](https://raw.githubusercontent.com/xb00tt/lilenhancer/main/moviescountdown-links.user.js) and confirm the install.

In Chrome-based browsers, Tampermonkey needs "Allow User Scripts" turned on in the extension's details page.

### Notes

- Button icons come from [Simple Icons](https://simpleicons.org/) via jsDelivr.
- Icon/text centring uses CSS `text-box`; in Firefox, which lacks it, icons sit about half a pixel off.

## License

[MIT](LICENSE)
