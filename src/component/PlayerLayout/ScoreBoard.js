import React from 'react';
import '../App.css';

const ScoreBoard = ({ wincount }) => {
  return (
    <div className='score_board'>
      <h2>Your Score</h2>
      <h3>{wincount}/10</h3>
    </div>
  );
};

export default ScoreBoard;
