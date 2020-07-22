import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from 'app/modules/login/login';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PublicHome from './public-home';
import SingleRecordView from 'app/modules/provider/record/single-record-view';

const Routes = ({ match, ...props }) => {
  const { siloName } = match.params;
  return (
    <div className="view-routes">
      <ErrorBoundaryRoute path="/login" component={Login} />
      <Switch>
        <ErrorBoundaryRoute path={`${match.url}/single-record-view/:orgId`} component={SingleRecordView} />
        <Route path={`${match.url}`} render={() => <PublicHome urlBase={match.url} siloName={siloName} />} />
      </Switch>
    </div>
  );
};

export default Routes;
