import React from 'react';
import { AutoRepresentation } from './AutoRepresentation';

interface Props {
  id: string;
  worker: string;
  representation: string;
  color: string;
}

const EntryViewer: React.FC<Props> = ({ id, worker, representation, color }) => {
  return <AutoRepresentation
    id={id}
    worker={worker}
    representation={representation}
    color={color}
  />
};

export default EntryViewer;
