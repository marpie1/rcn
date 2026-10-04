// Watch Mech's shared notebook ("state") without changing it.
//
// Every block gets its own view of the one state object: a Proxy that reports
// each read, write and delete, tagged with the block that did it. Blocks pass
// state on to the blocks indented under them; when a child receives its
// parent's view, it is unwrapped and re-wrapped with the child's own tag, so
// even a CLICK body that runs minutes later is credited to the right block.

// Mech's own plumbing, not notebook entries.
const SKIP = new Set(['context', 'api', 'debug'])

export function makeTracer(onEvent) {
  const raw = new WeakMap()   // view -> the real state object

  function unwrap(state) {
    return raw.get(state) || state
  }

  function wrap(state, who) {
    const target = unwrap(state)
    const note = (kind, key, value) => {
      if (typeof key != 'string' || SKIP.has(key)) return
      onEvent({ kind, key, who, value, at: Date.now() })
    }
    const view = new Proxy(target, {
      get(t, k, r) {
        if (typeof k == 'string' && !SKIP.has(k)) note(k in t ? 'read' : 'miss', k, t[k])
        return Reflect.get(t, k, r)
      },
      has(t, k) {
        const here = Reflect.has(t, k)
        if (!here) note('miss', k)
        return here
      },
      set(t, k, v, r) {
        const ok = Reflect.set(t, k, v, r)
        note('write', k, v)
        return ok
      },
      deleteProperty(t, k) {
        const ok = Reflect.deleteProperty(t, k)
        note('delete', k)
        return ok
      },
    })
    raw.set(view, target)
    return view
  }

  return { wrap, unwrap }
}

// Swap each block's emit for one that hands it a traced view and says when it
// starts and stops. Mutates the given blocks table, which must be our own
// bundled copy of Ward's, never the live plugin's.
export function instrument(blocks, tracer, onBlock) {
  for (const [op, block] of Object.entries(blocks)) {
    if (block.__traced) continue
    const emit = block.emit
    blocks[op] = {
      __traced: true,
      emit(stuff) {
        const who = (stuff.elem && stuff.elem.id) || op
        onBlock({ phase: 'start', who, op, command: stuff.command })
        stuff.state = tracer.wrap(stuff.state, who)
        let result
        try {
          result = emit(stuff)
        } catch (err) {
          onBlock({ phase: 'end', who, op, error: err.message })
          throw err
        }
        Promise.resolve(result).then(
          () => onBlock({ phase: 'end', who, op }),
          err => onBlock({ phase: 'end', who, op, error: err && err.message }),
        )
        return result
      },
    }
  }
  return blocks
}

// A short, safe description of a state value for a tooltip.
export function preview(value, limit = 160) {
  if (value == null) return String(value)
  if (typeof value == 'string') return value.length > limit ? value.slice(0, limit) + '…' : value
  if (Array.isArray(value)) return `${value.length} item${value.length == 1 ? '' : 's'}`
  if (typeof value == 'object') {
    let s
    try { s = JSON.stringify(value) } catch { s = '{…}' }
    return s.length > limit ? s.slice(0, limit) + '…' : s
  }
  return String(value)
}
