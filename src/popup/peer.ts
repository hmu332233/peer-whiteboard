
import Peer from 'peerjs';

namespace PeerFunc {
  export type DataReceiveProps = { key: string, payload: any };
  export type onConnectionOpen = (id: string) => void;
  export type onDataReceive = ({ key, payload }: DataReceiveProps) => void;
}

export const initPeer = () => {
  const myPeer = new Peer();
  let peerConnection: Peer.DataConnection | null;
  let onConnectionOpen: PeerFunc.onConnectionOpen | null;
  let onDataReceive: PeerFunc.onDataReceive | null;

  myPeer.on('open', (id) => {
    console.log('open', id);

    if (!onConnectionOpen) {
      return;
    }
    
    onConnectionOpen(id);
  });
  
  myPeer.on('connection', (connection) => {
    peerConnection = connection;
    initConnection(connection, onDataReceive);
  });

  const connect = (id: string) => {
    const connection = myPeer.connect(id);
    peerConnection = connection;
    initConnection(connection, onDataReceive);
  }

  const send = ({ key, payload }: PeerFunc.DataReceiveProps) => {
    if (!peerConnection) {
      return;
    }
    
    peerConnection.send({ key, payload });
  }

  const subscribeOpen = (callback: PeerFunc.onConnectionOpen) => {
    onConnectionOpen = callback;
  }

  const subscribeDataReceive = (callback: PeerFunc.onDataReceive) => {
    onDataReceive = callback;
  }

  return {
    connect,
    send,
    subscribeOpen,
    subscribeDataReceive,
  };
}

function initConnection(connection: Peer.DataConnection, onDataReceive: PeerFunc.onDataReceive | null) {
  connection.on('open', () => {
    if (!onDataReceive) {
      return;
    }

    onDataReceive({ key: 'connected', payload: { id: connection.peer });
  });
  connection.on('data', ({ key, payload }) => {
    if (!onDataReceive) {
      return;
    }
    
    onDataReceive({ key, payload });
  });
}
