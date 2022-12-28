const HubHost = window.__RUNTIME_CONFIG__.REACT_APP_HUB_HOST ? window.__RUNTIME_CONFIG__.REACT_APP_HUB_HOST : "localhost" ;
const HubPort = window.__RUNTIME_CONFIG__.REACT_APP_HUB_PORT ? window.__RUNTIME_CONFIG__.REACT_APP_HUB_PORT : "8898" ;
const HubBaseUrl = `http://${HubHost}:${HubPort}`
const HubWsUrl = `ws://${HubHost}:${HubPort}/ws`

export { HubHost, HubPort, HubBaseUrl, HubWsUrl }
