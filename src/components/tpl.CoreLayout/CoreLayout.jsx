import React, { PropTypes } from 'react';
import '../../styles/globals.css';

const CoreLayout = ({ children }) => {
  return (
    <div>
        { children }
    </div>
  );
};
CoreLayout.propTypes = {
  children: PropTypes.node
};

export default CoreLayout;
