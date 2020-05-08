import React from 'react';
import { Switch } from 'react-router-dom';
import PrivateRoute from 'app/shared/auth/private-route';
import Home from 'app/modules/provider/home';
import { AUTHORITIES } from 'app/config/constants';

const Routes = ({ isAdmin, match }) => (
  <Switch>
    <PrivateRoute path={`${match.url}/home`} component={Home} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]} isAdmin={isAdmin} />
  </Switch>
);

export default Routes;
