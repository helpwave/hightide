async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function delayed<T>(value: T, ms: number): Promise<T> {
  await sleep(ms)
  return value
}

export const PromiseUtils = {
  sleep,
  delayed
}