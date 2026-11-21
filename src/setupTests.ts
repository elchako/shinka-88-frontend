import '@testing-library/jest-dom/vitest'
const { webcrypto } = (globalThis as typeof globalThis & {
  process: { getBuiltinModule(name: string): { webcrypto: Crypto } }
}).process.getBuiltinModule('crypto')
import { afterEach, beforeEach, vi } from 'vitest'

// jsdom не реализует Web Locks. Только тестовая имитация штатного API Chrome;
// настоящий browser QA дополнительно проверяет navigator.locks без полифилла.
let previousLocks: PropertyDescriptor | undefined
beforeEach(() => {
  vi.stubGlobal('crypto', webcrypto)
  previousLocks = Object.getOwnPropertyDescriptor(navigator, 'locks')
  const held = new Set<string>()
  Object.defineProperty(navigator, 'locks', { configurable: true, value: {
    request: async <T>(name: string, options: LockOptions, callback: (lock: Lock | null) => T | PromiseLike<T>) => {
      if (held.has(name) && options.ifAvailable) return callback(null)
      if (held.has(name)) throw new Error('Тестовый lock требует ifAvailable')
      held.add(name)
      try { return await callback({ name, mode: 'exclusive' } as Lock) }
      finally { held.delete(name) }
    },
  } })
})
afterEach(() => {
  if (previousLocks) Object.defineProperty(navigator, 'locks', previousLocks)
  else Reflect.deleteProperty(navigator, 'locks')
  vi.unstubAllGlobals()
})
