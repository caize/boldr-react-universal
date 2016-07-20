import React from 'react';
import Helmet from 'react-helmet';
import Logo from '../../components/atm.Logo';

function Home() {
  return (
  <div>
    <Helmet title="Home" />
    <div className="row">
    <div className="col-xs-12">
    <div className="row center-xs">
      <div className="col-xs-6">
        <div className="box">
        <Logo height={ 250 } width={ 250 } />
          <p>
            Congrats you're live!
          </p>
        </div>
      </div>
      </div>
    </div>
    </div>
  </div>
  );
}

export default Home;
