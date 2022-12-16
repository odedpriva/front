import { ProtocolInterface } from "../UI/Protocol/Protocol"

interface TCPInterface {
  ip: string;
  port: string;
  name: string;
}

export interface Entry {
  proto: ProtocolInterface;
  capture: string;
  method?: string;
  methodQuery?: string;
  summary: string;
  summaryQuery: string;
  id: string;
  worker: string;
  status?: number;
  statusQuery?: string;
  timestamp: Date;
  src: TCPInterface;
  dst: TCPInterface;
  isOutgoing?: boolean;
  latency: number;
}

enum CaptureTypes {
  UndefinedCapture = "",
  Pcap = "pcap",
  Envoy = "envoy",
  Linkerd = "linkerd",
  Ebpf = "ebpf",
}

function KeyAndTcpKeyFromEntry(entry: Entry): [string, string] {
  const key = `${entry.worker}/${entry.id}`;
  const tcpKey = `${entry.worker}/${entry.id.split('-')[0]}`;
  return [key, tcpKey];
}

export { CaptureTypes , KeyAndTcpKeyFromEntry }
