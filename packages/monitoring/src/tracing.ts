export function traceRequest(name: string, fn: () => unknown) {
  const startedAt = Date.now();
  try {
    const result = fn();
    return { result, durationMs: Date.now() - startedAt };
  } catch (error) {
    return { error, durationMs: Date.now() - startedAt };
  }
}
