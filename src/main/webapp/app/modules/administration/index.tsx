import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import UserManagement from './user-management';
import ClientManagement from './client-management';
import Logs from './logs/logs';
import Health from './health/health';
import Configuration from './configuration/configuration';
import Audits from './audits/audits';
import Docs from './docs/docs';
import SchedulerAdministration from './scheduler/scheduler';
import Gateway from './gateway/gateway';
import UsersOrganizations from 'app/modules/administration/users-organizations/index';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute path={`${match.url}/user-management`} component={UserManagement} />
    <ErrorBoundaryRoute path={`${match.url}/client-management`} component={ClientManagement} />
    <ErrorBoundaryRoute path={`${match.url}/organization-owners`} component={UsersOrganizations} />
    <ErrorBoundaryRoute exact path={`${match.url}/health`} component={Health} />
    <ErrorBoundaryRoute exact path={`${match.url}/docs`} component={Docs} />
    <ErrorBoundaryRoute exact path={`${match.url}/configuration`} component={Configuration} />
    <ErrorBoundaryRoute exact path={`${match.url}/scheduler`} component={SchedulerAdministration} />
    <ErrorBoundaryRoute exact path={`${match.url}/audits`} component={Audits} />
    <ErrorBoundaryRoute exact path={`${match.url}/logs`} component={Logs} />
    <ErrorBoundaryRoute exact path={`${match.url}/gateway`} component={Gateway} />
  </div>
);

export default Routes;
