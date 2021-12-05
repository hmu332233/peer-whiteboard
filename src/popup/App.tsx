import React, { useState, useEffect } from 'react';

import { initPeer } from './peer';

import { sendMessage } from './utils/chrome';

const peer = initPeer();

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [peerId, setPeerId] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    peer.subscribeOpen(
      (id: string) => {
        setPeerId(id);
        sendMessage({ key: 'init' });
      },
    );

    chrome.runtime.onConnect.addListener(port => {
      if (port.name === 'peer-whiteboard') {
        // port로부터 도착한 메세지를 peer로 전송
        port.onMessage.addListener(message => {
          peer.send(message);
        });

        // peer로부터 도착한 메세지를 port로 전송
        peer.subscribeDataReceive(({ key, payload }) => {
          port.postMessage({ key, payload });

          switch (key) {
            case 'connected': {
              setIsConnected(true);
              break;
            }
          }
        });
      }
    });
  }, []);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget: { value } } = e;
    setValue(value);
  }

  const handleButtonClick = () => {
    peer.connect(value);
    setIsConnected(true);
  }

  return (
    <div className="container is-flex is-flex-direction-column">
      <section className="section">
        <h1 className="title has-text-weight-bold">
          <span className="has-text-primary">Peer</span> Whiteboard</h1>
        <h2 className="subtitle is-6">
          친구와 나의 커서를 서로에게 <strong>공유!</strong>
        </h2>
      </section>
      <section className="section is-flex is-flex-direction-column">
        <div className="field">
          <label className="label">내 ID</label>
          <div className="control">
            <input className="input" value={peerId} disabled />
          </div>
        </div>
        <div className="field">
          <label className="label">친구 ID</label>
          <div className="control">
            <input className="input" onChange={handleChange} value={value} />
          </div>
        </div>
        <button className="button is-primary" onClick={handleButtonClick} disabled={isConnected}>
          {isConnected ? '연결 중' : '연결'}
        </button>
      </section>
    </div>
  );
}

export default App;