import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { reactiveVarToken } from '../../GraphQLApp/reactiveVars';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log('PrivateRoute');
  const sessionStorageData = JSON.parse(sessionStorage.getItem('storageData'));
  const reactiveToken = useReactiveVar(reactiveVarToken);

  function assignRouteToApply(routeProps) {
    console.log('PrivateRoute', routeProps);
    if (reactiveToken || (sessionStorageData && sessionStorageData.token)) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/signIn' />;
    }
  }

  return <Route {...rest} render={assignRouteToApply} />;
};
