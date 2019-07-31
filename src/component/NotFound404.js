import React from 'react';
import '../style/404.css';

const Site404 = () => {
  return (
    <div className='site-not-found'>
      <div className='supper-man'>
        <img src='http://pngimg.com/uploads/superman/superman_PNG9.png' alt='' />
      </div>
      <div className='title'>404!</div>
      <p>The Page You're Looking For Was Not Found.</p>
      <button>
        <a href='/'>Go Back Home Page</a>
      </button>
    </div>
  );
};

export default Site404;
