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

- **5h**: share of the 5-hour limit used, with the time left. Hover the pill for the reset time.
- **7d**: share of the 7-day limit used, with a pace warning in place of the countdown: `餘裕 6%` (under the even pace), `偏快 +7%` (over), `超速 +17%` (more than 15 points over). Hover the pill for the reset countdown.
- **Cache**: time before the prompt cache lapses.

The bar colour follows the same pace: green at or under the even pace, amber above it, red beyond 15 points or at 90% used.

## Credits

A modified copy of [token-weather-usage](https://github.com/augiefra/claude-mods/tree/main/plugins/token-weather-usage) by Eric Cologni (Apache-2.0). The context weather and cost pills are hidden and the 7-day pill is changed as described above. See `LICENSE` and `NOTICE`.
