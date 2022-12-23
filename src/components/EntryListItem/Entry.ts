import { ProtocolInterface } from "../UI/Protocol/Protocol"

interface TCPInterface {
  ip: string;
  port: string;
  name: string;
}

export interface Entry {
  id: string;
  index?: number;
  stream: string;
  worker: string;
  proto: ProtocolInterface;
  tls: boolean;
  method?: string;
  methodQuery?: string;
  summary: string;
  summaryQuery: string;
  status?: number;
  statusQuery?: string;
  timestamp: Date;
  src: TCPInterface;
  dst: TCPInterface;
  outgoing: boolean;
  latency: number;
}
