import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import ClientManagement from './client-management';
import ClientManagementDetail from './client-management-detail';
import ClientManagementUpdate from './client-management-update';
import ClientManagementDeleteDialog from './client-management-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ClientManagementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:clientId/edit`} component={ClientManagementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:clientId`} component={ClientManagementDetail} />
      <ErrorBoundaryRoute path={match.url} component={ClientManagement} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:clientId/delete`} component={ClientManagementDeleteDialog} />
  </>
);

export default Routes;
