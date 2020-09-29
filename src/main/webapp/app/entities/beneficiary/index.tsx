import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Beneficiary from './beneficiary';
import BeneficiaryDetail from './beneficiary-detail';
import BeneficiaryUpdate from './beneficiary-update';
import BeneficiaryDeleteDialog from './beneficiary-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BeneficiaryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BeneficiaryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BeneficiaryDetail} />
      <ErrorBoundaryRoute path={match.url} component={Beneficiary} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={BeneficiaryDeleteDialog} />
  </>
);

export default Routes;
