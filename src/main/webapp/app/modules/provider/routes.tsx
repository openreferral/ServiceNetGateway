import React from 'react';
import { Switch } from 'react-router-dom';
import Home from 'app/modules/provider/home';
import RecordCreate from 'app/modules/provider/record/record-create';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

const Routes = ({ isAdmin, match }) => (
  <Switch>
    <ErrorBoundaryRoute path={`${match.url}record-create`} component={RecordCreate}/>
    <ErrorBoundaryRoute path={`${match.url}`} component={Home} />
  </Switch>
);

export default Routes;
