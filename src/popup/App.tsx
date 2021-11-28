import React, { useState } from 'react';

import { initPeer } from './/peer';

const { connect, send } = initPeer({
  onConnectionOpen: console.log,
  onDataReceive: console.log,
}); 

function App() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget: { value } } = e;
    setValue(value);
  }

  const handleButtonClick = () => {
    connect(value);
  }

  return (
    <div>
      <input onChange={handleChange} value={value}/>
      <button onClick={handleButtonClick}>연결</button>
    </div>
  );
}

export default App;