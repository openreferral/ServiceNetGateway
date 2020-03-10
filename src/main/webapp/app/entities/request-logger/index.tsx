import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import RequestLogger from './request-logger';
import RequestLoggerDetail from './request-logger-detail';
import RequestLoggerUpdate from './request-logger-update';
import RequestLoggerDeleteDialog from './request-logger-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={RequestLoggerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={RequestLoggerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={RequestLoggerDetail} />
      <ErrorBoundaryRoute path={match.url} component={RequestLogger} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={RequestLoggerDeleteDialog} />
  </>
);

export default Routes;
