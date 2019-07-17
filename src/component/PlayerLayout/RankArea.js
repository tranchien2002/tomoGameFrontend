import React from 'react';
import { Col } from 'reactstrap';
import ScoreBoard from './ScoreBoard';

import '../../style/App.css';

const RankArea = ({ rank, wincount }) => {
  return (
    <Col className='box_color' xs='4'>
      <ScoreBoard wincount={wincount} />
      <div className='rank'>
        <div className='ranking_title'>
          <h2>Ranking</h2>
        </div>
        <div className='person_rank_box'>
          {rank.map((rank) => (
            <div key={rank.account} className='person_rank'>
              <p className='user_account'>
                <span className='ellipsis'>{rank.account}</span>
                <span className='indent'>{rank.account}</span>
              </p>
              <p>{rank.correct}/10</p>
            </div>
          ))}
        </div>
      </div>
    </Col>
  );
};

export default RankArea;
