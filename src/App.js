import React, { useState } from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';

import Main from './components/Main';

function App() {
  const [spacing] = React.useState(5);
  return (
    <RecoilRoot>
      <div>
        <Main />
      </div>
    </RecoilRoot>
  );
}

export default App;
