import React from 'react';
import Helmet from 'react-helmet';

function About() {
  return (
    <div>
      <Helmet title="About" />
      <div style={ { textAlign: 'center' } }>
        Produced with ❤️
        by <a href="https://twitter.com/struesco" target="_blank">Steven Truesdell</a>
      </div>
    </div>
  );
}

export default About;
