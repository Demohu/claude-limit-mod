# limit

A Claude Code mod: one band above the prompt with your 5h and 7d usage limits against the clock, and the prompt cache.

## Install

At the prompt of a terminal session:

```
/plugin install limit --marketplace Demohu/claude-limit-mod
```

From a shell:

```
claude plugin install limit --marketplace Demohu/claude-limit-mod
```

## What it shows

- **5h**: share of the 5-hour limit used, with the time left as `h:mm` (`4:44`). Hover the pill for the reset time.
- **7d**: share of the 7-day limit used, no text: the percentage turns amber when over the even pace and red when more than 7 points over or at 90% used. Hover the pill for the reset weekday and time (`週三 15:30 重置`).
- **Cache**: time before the prompt cache lapses as `h:mm` (`0:52`). Amber under 10 minutes or after a miss (`未命中`), red once expired (`已過期`), grey when there is no data. Hover the pill for details.

Labels and tooltips are in Traditional Chinese by default; the `language` option accepts `zh`, `en` or `fr`.

The bar colour follows the same pace: green at or under the even pace, amber above it, red beyond 7 points or at 90% used.

## Credits

A modified copy of [token-weather-usage](https://github.com/augiefra/claude-mods/tree/main/plugins/token-weather-usage) by Eric Cologni (Apache-2.0). The context weather and cost pills are hidden and the 7-day, 5-hour and cache pills are simplified as described above. See `LICENSE` and `NOTICE`.
