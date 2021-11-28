
import Peer from 'peerjs';

namespace PeerFunc {
  export type onConnectionOpen = (id: string) => void,
  export type onDataReceive = ({ key, payload }: { key: string, payload: any}) => void,
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

  const connect = (id) => {
    const connection = myPeer.connect(id);
    peerConnection = connection;
    initConnection(connection, onDataReceive);
  }

  const send = ({ key, payload }) => {
    if (!peerConnection) {
      return;
    }
    
    peerConnection.send({ key, payload });
  }

  const subscribeOpen = (callback) => {
    onConnectionOpen = callback;
  }

  const subscribeDataReceive = callback => {
    onDataReceive = callback;
  }

  return {
    connect,
    send,
    subscribeOpen,
    subscribeDataReceive,
  };
}

function initConnection(connection: Peer.DataConnection, onDataReceive: PeerFunc.onDataReceive) {
  connection.on('open', () => {
    console.log('connected!', connection.peer);
  });
  connection.on('data', ({ key, payload }) => {
    if (!onDataReceive) {
      return;
    }
    
    onDataReceive({ key, payload });
  });
}
