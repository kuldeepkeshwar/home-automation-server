import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { fetchBoards } from './api';
import './styles.css';
import Board from './Board';
import Emoji from './Components/Emoji';

const EmojiStyle = {
  fontSize: '3rem',
  height: '4rem',
  width: '4rem',
};
function App() {
  const [boards, setBoards] = useState({});
  useEffect(() => {
    fetchBoards().then(_boards => setBoards(_boards));
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
      {Object.keys(boards).map(id => (
        <Board key={id} data={boards[id]} />
      ))}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
