import Peer from 'peerjs';

const PEER_PREFIX = '@peer-whiteboard';

const myPeerId = 'minung';


const myPeer = new Peer();

// TODO: socket을 별도로 이용해서 모든 peer끼리 데이터를 공유할 수 있도록 하기
const peers = {};

myPeer.on('open', (id) => {
  console.log('open', id);
});

myPeer.on('connection', function(conn) {
  console.log(conn, 'connected!');
  conn.on('data', function(data){
    console.log(data);
  });
});


let conn;

window.test = (id) => {
  // 타인과 연결
  conn = myPeer.connect(id);
  // on open will be launch when you successfully connect to PeerServer
  conn.on('open', function(){
    // here you have conn.id
    conn.send('hi!');
  });
}