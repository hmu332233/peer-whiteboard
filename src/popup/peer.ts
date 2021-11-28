
import Peer from 'peerjs';

type InitPeerProps = {
  onConnectionOpen: (id: string) => void,
  onDataReceive: ({ key, payload }: { key: string, payload: any}) => {},
}

export const initPeer = ({
  onConnectionOpen,
  onDataReceive,
}: InitPeerProps) => {
  const myPeer = new Peer();

  let peerConnection;
  
  myPeer.on('open', (id) => {
    console.log('open', id);
    onConnectionOpen(id);
  });
  
  myPeer.on('connection', (connection) => {
    peerConnection = connection;
    window.peerConnection  = connection
    initConnection(connection, onDataReceive);
  });

  const connect = (id) => {
    const connection = myPeer.connect(id);
    window.peerConnection  = connection
    initConnection(connection, onDataReceive);
  }

  const send = ({ key, payload }) => {
    peerConnection.send({ key, payload });
  }

  return {
    connect,
    send,
  };
}

function initConnection(connection, onDataReceive) {
  connection.on('open', (id) => {
    console.log('connected!', id);
  });
  connection.on('data', (data) => {
    const { key, payload } = data;
    onDataReceive({
      key,
      payload,
    });
  });
}