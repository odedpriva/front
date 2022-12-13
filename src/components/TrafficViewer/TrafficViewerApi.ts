interface DataModel {
  representation: string;
}

export interface ResponseModel {
  data: DataModel;
  errorMessage: string;
}

type TrafficViewerApi = {
  replayRequest: (request: { method: string, url: string, data: string, headers: unknown }) => Promise<ResponseModel>,
  webSocket: {
    close: () => void
  }
}

export default TrafficViewerApi
