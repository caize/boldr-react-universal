import React from 'react';
import Helmet from 'react-helmet';
import styles from './style.css';

const Hero = () => {
  return (
    <div className={ styles.hero }>
    <div className="wrap">
        <h1 className={ styles.heroTag }>
          Bold<span style={ { color: 'rgb(229, 0, 80)' } }>r</span>
        </h1>
        <h3>Universal React starter project</h3>
      </div>
    </div>
  );
};

export default Hero;
