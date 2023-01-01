const HubHost = window.__RUNTIME_CONFIG__.REACT_APP_HUB_HOST.trim() ? window.__RUNTIME_CONFIG__.REACT_APP_HUB_HOST.trim() : window.location.hostname;
const HubPort = window.__RUNTIME_CONFIG__.REACT_APP_HUB_PORT.trim() ? window.__RUNTIME_CONFIG__.REACT_APP_HUB_PORT.trim() : "8898";
const HubProto = window.__RUNTIME_CONFIG__.REACT_APP_HUB_POROTO.trim() ? window.__RUNTIME_CONFIG__.REACT_APP_HUB_POROTO.trim() : "http";
const HubWSProto = window.__RUNTIME_CONFIG__.REACT_APP_HUB_WS_PROTO.trim() ? window.__RUNTIME_CONFIG__.REACT_APP_HUB_WS_PROTO.trim() : "ws";
const HubBaseUrl = `${HubProto}://${HubHost}:${HubPort}`
const HubWsUrl = `${HubWSProto}://${HubHost}:${HubPort}/ws`

export { HubHost, HubPort, HubBaseUrl, HubWsUrl }
