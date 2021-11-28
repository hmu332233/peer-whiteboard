import { initPeer } from './popup/peer';

const peer = initPeer();

peer.subscribeOpen(console.log);
peer.subscribeDataReceive(console.log);