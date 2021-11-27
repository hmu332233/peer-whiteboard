import Peer from 'peerjs';

const PEER_PREFIX = '@peer-whiteboard';

const myPeerId = 'minung';

const app = document.getElementById('app');
const myCursor = document.getElementById('my-cursor');
const peerCursor = document.getElementById('peer-cursor');

const myPeer = new Peer();
let peerConnection;

app.addEventListener("mousemove", updateDisplay, false);
app.addEventListener("mouseenter", updateDisplay, false);
app.addEventListener("mouseleave", updateDisplay, false);

function updateDisplay(event) {
  // console.log(event.pageX, event.pageY);
  myCursor.style.left = event.pageX;
  myCursor.style.top = event.pageY;

  peerConnection && peerConnection.send({ event: 'mousemove', payload: { pageX: event.pageX, pageY: event.pageY }});
}



// TODO: socket을 별도로 이용해서 모든 peer끼리 데이터를 공유할 수 있도록 하기
const peers = {
  ids: [],
  entities: {},
};

function addPeer(data) {
  const { peer } = data;
  peers.ids.push(peer);
  peers.entities[peer] = data;
}

myPeer.on('open', (id) => {
  console.log('open', id);
});

myPeer.on('connection', function(conn) {
  console.log(conn, 'connected!');
  conn.on('data', function(data){
    // console.log(data);
    const { event, payload } = data;
    const { pageX, pageY } = payload;

    peerCursor.style.left = pageX;
    peerCursor.style.top = pageY;
  });
  peerConnection = conn;
});


window.connect = (id) => {
  const conn = myPeer.connect(id);
  conn.on('open', function(){
  });
  peerConnection = conn;
  // console.log(conn)

  conn.on('data', function(data){
    // console.log(data);
    const { event, payload } = data;
    const { pageX, pageY } = payload;

    peerCursor.style.left = pageX;
    peerCursor.style.top = pageY;
  });
}

