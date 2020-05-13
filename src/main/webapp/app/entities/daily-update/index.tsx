import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import DailyUpdate from './daily-update';
import DailyUpdateDetail from './daily-update-detail';
import DailyUpdateUpdate from './daily-update-update';
import DailyUpdateDeleteDialog from './daily-update-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={DailyUpdateDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={DailyUpdateUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={DailyUpdateUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DailyUpdateDetail} />
      <ErrorBoundaryRoute path={match.url} component={DailyUpdate} />
    </Switch>
  </>
);

export default Routes;
