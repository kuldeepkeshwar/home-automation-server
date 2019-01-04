import React, { useEffect, useState } from 'react';

import Board from './Board';
import Emoji from './Components/Emoji';
import Loader from './Components/Loader';
import { fetchBoards } from './api';

const EmojiStyle = {
  fontSize: '3rem',
  height: '4rem',
  width: '4rem',
};
function poll(fn, success, reject, interval) {
  let timer = null;
  let cancalFn = () => {};
  fn()
    .then((...args) => {
      success(...args);
      timer = setTimeout(() => {
        cancalFn = poll(fn, success, reject, interval);
      }, interval);
    })
    .catch((err) => {
      reject(err);
      timer = setTimeout(() => {
        cancalFn = poll(fn, success, reject, interval);
      }, interval);
    });
  return () => {
    clearTimeout(timer);
    cancalFn();
  };
}
export default function App() {
  const [{ boards }, setBoards] = useState({ boards: {} });
  useEffect(() => {
    const clear = poll(
      fetchBoards,
      _boards => setBoards({ boards: _boards }),
      () => {},
      1000,
    );
    return clear;
  }, []);
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="App">
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
