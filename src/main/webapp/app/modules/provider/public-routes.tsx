import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from 'app/modules/login/login';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PublicHome from './public-home';
import SingleRecordView from 'app/modules/provider/record/single-record-view';
import Feedback from 'app/modules/feedback/feedback';
import { AboutUs } from 'app/modules/about-us/about-us';

const Routes = ({ match, ...props }) => {
  const { siloName } = match.params;
  return (
    <div className="view-routes">
      <ErrorBoundaryRoute path={`${match.url}/login`} component={Login} />
      <Switch>
        <ErrorBoundaryRoute path={`${match.url}/about-us`} component={AboutUs} />
        <ErrorBoundaryRoute path={`${match.url}/feedback`} component={Feedback} />
        <ErrorBoundaryRoute path={`${match.url}/single-record-view/:orgId`} component={SingleRecordView} />
        <Route path={`${match.url}`} render={() => <PublicHome urlBase={match.url} siloName={siloName} />} />
      </Switch>
    </div>
  );
};

export default Routes;
