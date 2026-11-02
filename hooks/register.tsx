import type { Register, EngineInterface, SessionRateLimit } from 'claude-code'

const REFRESH_MS = 60_000
const HOUR = 3_600_000
const WINDOW_MS: Record<string, number> = { five_hour: 5 * HOUR, seven_day: 168 * HOUR }
// Within this many points above the even pace is yellow; beyond it, red.
const WARN_MARGIN = 10

const two = (n: number) => String(n).padStart(2, '0')

function resetTime(iso: string | undefined): string | undefined {
  if (iso === undefined) return undefined
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? undefined : `${two(d.getHours())}:${two(d.getMinutes())}`
}

// Percent of the window that has elapsed, i.e. the usage that would be an even pace.
function evenPace(l: SessionRateLimit): number | undefined {
  const span = WINDOW_MS[l.kind]
  if (span === undefined || l.resetsAt === undefined) return undefined
  const end = new Date(l.resetsAt).getTime()
  if (Number.isNaN(end)) return undefined
  return Math.min(100, Math.max(0, ((Date.now() - (end - span)) / span) * 100))
}

function dot(l: SessionRateLimit): string {
  const pace = evenPace(l)
  if (pace === undefined) return ''
  if (l.percentUsed <= pace) return '🟢'
  return l.percentUsed <= pace + WARN_MARGIN ? '🟡' : '🔴'
}

function cell(label: string, l: SessionRateLimit): string {
  return `${dot(l)}${label} ${Math.round(l.percentUsed)}%`
}

function line(limits: readonly SessionRateLimit[]): string | undefined {
  const five = limits.find(l => l.kind === 'five_hour')
  const seven = limits.find(l => l.kind === 'seven_day')
  const parts: string[] = []
  if (seven) parts.push(cell('7d', seven))
  if (five) parts.push(`5h ${Math.round(five.percentUsed)}%`)
  const at = resetTime(five?.resetsAt)
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
