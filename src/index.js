import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { fetchBoards } from './api';
import './styles.css';
import Board from './Board';

function App() {
  const [boards, setBoards] = useState({});
  useEffect(() => {
    fetchBoards().then(_boards => setBoards(_boards));
  }, []);
  return (
    <div className="App">
      <h1>Home Automation</h1>
      {Object.keys(boards).map(id => (
        <Board key={id} data={boards[id]} />
      ))}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
