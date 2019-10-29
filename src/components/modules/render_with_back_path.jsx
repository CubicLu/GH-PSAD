import React from 'react';

const renderWithBackPath = (Component, path) => {
  return props => <Component {...props} backPath={path}/>
};

export default renderWithBackPath;
