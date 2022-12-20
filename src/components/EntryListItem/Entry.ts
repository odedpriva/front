import { ProtocolInterface } from "../UI/Protocol/Protocol"

interface TCPInterface {
  ip: string;
  port: string;
  name: string;
}

export interface Entry {
  proto: ProtocolInterface;
  tls: boolean;
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

function KeyAndTcpKeyFromEntry(entry: Entry): [string, string] {
  const key = `${entry.worker}/${entry.id}`;
  const tcpKey = `${entry.worker}/${entry.id.split('-')[0]}`;
  return [key, tcpKey];
}

export { KeyAndTcpKeyFromEntry }
