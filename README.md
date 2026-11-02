# limit

A Claude Code mod that shows your 7d / 5h usage limits and the 5h reset time in the status line.

## Install

At the prompt of a terminal session:

```
/plugin install limit --marketplace Demohu/claude-limit-mod
```

From a shell:

```
claude plugin install limit --marketplace Demohu/claude-limit-mod
```

## Colour

The 7d figure gets a dot showing whether you are ahead of an even pace (the share of the 7-day window already elapsed):

- 🟢 at or under the even pace
- 🟡 up to 10 points over
- 🔴 more than 10 points over
