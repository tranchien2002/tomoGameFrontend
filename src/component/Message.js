import React from 'react';
import '../style/Rules.css';

const Message = ({ rule, lang }) => {
  if (lang === 'en') {
    return (
      <div className='rule-layout'>
        <p className='rule'>{rule.en}</p>
      </div>
    );
  } else if (lang === 'vn') {
    return (
      <div className='rule-layout'>
        <p className='rule'>{rule.vn}</p>
      </div>
    );
  } else if (lang === 'jp') {
    return (
      <div className='rule-layout'>
        <p className='rule'>{rule.jp}</p>
      </div>
    );
  }
};

export default Message;
