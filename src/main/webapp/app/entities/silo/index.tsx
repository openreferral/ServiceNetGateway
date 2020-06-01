import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Silo from './silo';
import SiloDetail from './silo-detail';
import SiloUpdate from './silo-update';
import SiloDeleteDialog from './silo-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={SiloDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={SiloUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={SiloUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={SiloDetail} />
      <ErrorBoundaryRoute path={match.url} component={Silo} />
    </Switch>
  </>
);

export default Routes;
