import type { EngineInterface, Register, SessionRateLimit } from 'claude-code'

const REFRESH_MS = 60_000
const two = (n: number) => String(n).padStart(2, '0')

function reset(iso: string | undefined): string | undefined {
  if (iso === undefined) return undefined
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? undefined : `${two(d.getHours())}:${two(d.getMinutes())}`
}

// 7d first, then 5h, then the 5h reset time, as the person asked for.
function line(limits: readonly SessionRateLimit[]): string | undefined {
  const five = limits.find(l => l.kind === 'five_hour')
  const seven = limits.find(l => l.kind === 'seven_day')
  const parts: string[] = []
  if (seven) parts.push(`7d ${Math.round(seven.percentUsed)}%`)
  if (five) parts.push(`5h ${Math.round(five.percentUsed)}%`)
  const at = reset(five?.resetsAt)
  if (at) parts.push(`Reset ${at}`)
  return parts.length === 0 ? undefined : parts.join(' | ')
}

async function show($: EngineInterface, limits: readonly SessionRateLimit[]) {
  $.ui.status(line(limits))
}

export const register: Register = on => {
  let timer: { cancel: () => void } | undefined

  on('session.start', async ($, e, next) => {
    await show($, (await $.session.usage()).rateLimits)
    timer?.cancel()
    timer = $.clock.every(REFRESH_MS, async () => {
      await show($, (await $.session.usage()).rateLimits)
    })
    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) await show($, e.rateLimits)
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await show($, (await $.session.usage()).rateLimits)
    return next(e)
  })
}
