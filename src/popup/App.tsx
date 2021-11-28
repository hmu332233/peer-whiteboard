import React, { useState, useEffect } from 'react';

import { initPeer } from './peer';

import { sendMessage } from './utils/chrome';

const peer = initPeer(); 

function App() {
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
  }

  return (
    <div>
      <span>사용자 ID: {peerId}</span>
      <input onChange={handleChange} value={value}/>
      <button onClick={handleButtonClick}>연결</button>
    </div>
  );
}

export default App;