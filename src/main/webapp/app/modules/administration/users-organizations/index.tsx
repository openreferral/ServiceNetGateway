import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import UsersOrganizations from './users-organizations';
import UsersOrganizationsUpdate from './users-organizations-update';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UsersOrganizationsUpdate} />
      <ErrorBoundaryRoute path={match.url} component={UsersOrganizations} />
    </Switch>
  </>
);

export default Routes;
