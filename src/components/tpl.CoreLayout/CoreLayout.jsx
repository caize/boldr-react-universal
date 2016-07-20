import React, { PropTypes } from 'react';
import Logo from 'components/atm.Logo';
import '../../styles/globals.css';

const CoreLayout = ({ children }) => {
  return (
    <div>
      <Logo height={ 250 } width={ 250 } />
        { children }
    </div>
  );
};
CoreLayout.propTypes = {
  children: PropTypes.node
};

export default CoreLayout;
