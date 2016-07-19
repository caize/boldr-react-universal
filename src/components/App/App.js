import 'normalize.css/normalize.css';
import './globals.css';

import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

function App({ children }) {
  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1>Boldr React Universal</h1>
        <strong>A starter project based off BoldrCMS</strong>
      </div>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

      </div>
      <div>
        { children }
      </div>
    </div>
  );
}
App.propTypes = {
  children: PropTypes.node
};

export default App;
