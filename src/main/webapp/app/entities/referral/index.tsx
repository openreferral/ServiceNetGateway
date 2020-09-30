import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Referral from './referral';
import ReferralDetail from './referral-detail';
import ReferralUpdate from './referral-update';
import ReferralDeleteDialog from './referral-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ReferralUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ReferralUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ReferralDetail} />
      <ErrorBoundaryRoute path={match.url} component={Referral} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ReferralDeleteDialog} />
  </>
);

export default Routes;
