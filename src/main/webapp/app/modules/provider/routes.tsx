import React from 'react';
import { Switch } from 'react-router-dom';
import Home from 'app/modules/provider/home';
import RecordCreate from 'app/modules/provider/record/record-create';
import SingleRecordView from 'app/modules/provider/record/single-record-view';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import RecordEdit from 'app/modules/provider/record/record-edit';
import { AboutUs } from 'app/modules/about-us/about-us';
import Settings from 'app/modules/account/settings/settings';
import Password from 'app/modules/account/password/password';
import DeactivatedRecords from 'app/modules/provider/deactivated/deactivated-records';
import NotConfiguredAccount from 'app/modules/provider/not-configured-account';

const Routes = ({ isAdmin, match, location, account }) => {
  const hasUserSilo = account && account.siloId !== null;
  const isLoggingOut = location && (location.state && location.state.loggingOut);

  return (
    <div>
      <Switch>
        <ErrorBoundaryRoute path={`${match.url}about-us`} component={AboutUs} />
        <ErrorBoundaryRoute path={`${match.url}account/settings`} component={Settings} />
        <ErrorBoundaryRoute path={`${match.url}account/password`} component={Password} />
        {!isLoggingOut && !hasUserSilo && <ErrorBoundaryRoute path={`${match.url}`} component={NotConfiguredAccount} />}
        <ErrorBoundaryRoute path={`${match.url}record-create`} component={RecordCreate} />
        <ErrorBoundaryRoute path={`${match.url}single-record-view/:orgId`} component={SingleRecordView} />
        <ErrorBoundaryRoute path={`${match.url}record/:id/edit`} component={RecordEdit} />
        <ErrorBoundaryRoute path={`${match.url}deactivated-records`} component={DeactivatedRecords} />
        <ErrorBoundaryRoute path={`${match.url}`} component={Home} />
      </Switch>
    </div>
  );
};

export default Routes;
