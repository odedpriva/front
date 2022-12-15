interface DataModel {
  representation: string;
}

export interface ResponseModel {
  data: DataModel;
  errorMessage: string;
}

type TrafficViewerApi = {
  webSocket: {
    close: () => void
  }
}

export default TrafficViewerApi
