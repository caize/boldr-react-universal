import React from 'react';
import Helmet from 'react-helmet';
import Logo from '../../components/atm.Logo';
import Hero from '../../components/org.Hero';
import styles from './Home.css';

function Home() {
  return (
  <div>
    <Helmet title="Home" />
    <Hero />
    <div className="wrap">

          <p>
            Congrats you're live!
          </p>
    </div>
  </div>
  );
}

export default Home;
