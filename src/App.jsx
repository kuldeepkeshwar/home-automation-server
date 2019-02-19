import React, { useState, useEffect } from 'react';

import Board from './Board';
import Emoji from './Components/Emoji';
import Loader from './Components/Loader';
import { fetchBoards } from './api';
import { useInterval } from './utils/hooks';
import UpdateBanner from './Components/UpdateBanner';
import * as ServiceWorker from './utils/service-worker';

const EmojiStyle = {
  fontSize: '3rem',
  height: '4rem',
  width: '4rem',
};
function useApp() {
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    ServiceWorker.onUpdate(() => {
      setShowBanner(true);
    });
  }, []);

  return [showBanner];
}
export default function App() {
  const [{ boards }, setBoards] = useState({ boards: {} });
  const [showBanner] = useApp();

  useInterval(() => {
    fetchBoards().then(_boards => setBoards({ boards: _boards }));
  }, 3000);
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="App">
      {showBanner && <UpdateBanner />}
      <h1 className="title">
        <Emoji style={EmojiStyle} name="home-automation" />
        {' '}
        <Emoji style={EmojiStyle} name="iot-board" />
        {' '}
        <Emoji style={EmojiStyle} name="plug" />
        {' '}
      </h1>
      {boards ? (
        Object.keys(boards).map(id => <Board key={id} data={boards[id]} />)
      ) : (
        <Loader />
      )}
    </div>
  );
}
