import React, { useState, useEffect } from 'react';

import { initPeer } from './peer';

import { sendMessage } from './utils/chrome';


chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'peer-whiteboard') {
    port.onMessage.addListener(message => {
      console.log(message);
        // if (message === `How are you?`) {
        //     port.postMessage(`I'm fine thank you and you?`);
        // }
    });
  }
});

const peer = initPeer(); 

function App() {
  const [peerId, setPeerId] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    peer.subscribeOpen(
      (id: string) => setPeerId(id),
    );
    peer.subscribeDataReceive(({ key, payload }) => {
      sendMessage({ key, payload });
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