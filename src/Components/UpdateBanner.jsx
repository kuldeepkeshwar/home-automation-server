import React, { useState } from 'react';

import refreshImage from '../assets/images/refresh.svg';
import ReactGA from '../utils/ga';

function useBanner() {
  const [state, setState] = useState({ open: true });
  function clickHandler() {
    setState({
      open: false,
    });
    ReactGA.event({ category: 'Update', action: 'Update Banner' });
    setTimeout(() => {
      window.location = '/';
    }, 250);
  }
  return [state, clickHandler];
}
function Banner() {
  const [state, clickHandler] = useBanner();
  const cls = ['update'];
  if (state.open) {
    cls.push('open');
  }
  return (
    <div className={cls.join(' ')} onClick={clickHandler}>
      <div className="inner-container">
        <div className="text">New update available !</div>
        <img src={refreshImage} alt="Update Banner" />
      </div>
    </div>
  );
}

export default Banner;
