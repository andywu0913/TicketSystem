import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import PropTypes from 'prop-types';

import { getUserRole } from 'SRC/utils/jwt';

export default function AuthRoute(props) {
  const { allowRole = [], rejectToURL = '/', ...params } = props;
  const role = getUserRole();

  if (allowRole.includes(role)) {
    return <Route {...params} />;
  }

  return <Redirect to={rejectToURL} />;
}

AuthRoute.propTypes = {
  allowRole: PropTypes.instanceOf(Array),
  rejectToURL: PropTypes.string,
};

AuthRoute.defaultProps = {
  allowRole: [],
  rejectToURL: '/',
};
