import * as axios from "axios";

const hubHostPort = `${process.env.REACT_APP_HUB_HOST ? process.env.REACT_APP_HUB_HOST : "localhost"}:${process.env.REACT_APP_HUB_PORT ? process.env.REACT_APP_HUB_PORT : "8898"}`

export const KubesharkWebsocketURL = window.location.protocol === 'https:' ? `wss://${hubHostPort}/ws` : `ws://${hubHostPort}/ws`;

const apiURL = window.location.protocol === 'https:' ? `https://${hubHostPort}/` : `http://${hubHostPort}/`;

let client = null
let source = null

export default class Api {
  static instance;

  static getInstance() {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  constructor() {
    client = this.getAxiosClient();
    source = null;
  }

  getAxiosClient = () => {
    const headers = {
      Accept: "application/json"
    }
    return axios.create({
      baseURL: apiURL,
      timeout: 31000,
      headers
    });
  }

  getTrafficStats = async (startTimeMs, endTimeMs) => {
    const response = await client.get("/status/trafficStats", {
      params: {
        startTimeMs,
        endTimeMs
      }
    });
    return response.data;
  }
}
