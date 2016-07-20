import './globals.css';

import React, { PropTypes } from 'react';

const CoreLayout = ({ children }) => {
  return (
    <div style={ { padding: '10px' } }>
        { children }
    </div>
  );
};
CoreLayout.propTypes = {
  children: PropTypes.node
};

export default CoreLayout;
