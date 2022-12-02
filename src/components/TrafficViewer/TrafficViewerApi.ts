type TrafficViewerApi = {
  validateQuery: (query: unknown) => unknown
  targetStatus: () => unknown
  fetchEntries: (leftOff: unknown, direction: number, query: unknown, limit: number, timeoutMs: number) => unknown
  getEntry: (entryId: unknown, query: string) => unknown,
  replayRequest: (request: { method: string, url: string, data: string, headers: unknown }) => Promise<unknown>,
  webSocket: {
    close: () => void
  }
}

export default TrafficViewerApi
