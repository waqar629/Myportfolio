import React from 'react';
import { NavigationDots, SocialMedia } from '../components';
import { getCopy } from '../locales';

const AppWrap = (Component, idName, classNames) => function HOC(props) {
  const copy = getCopy(props.language);

  return (
    <div id={idName} className={`app__container ${classNames}`}>
      <SocialMedia />
      <div className="app__wrapper app__flex">
        <Component {...props} />
        <div className="copyright">
          <p className="copyright-text">{copy.copyright.lineOne}</p>
          <p className="copyright-text">{copy.copyright.lineTwo}</p>
        </div>
      </div>
      <NavigationDots active={idName} />
    </div>
  );
};

export default AppWrap;
