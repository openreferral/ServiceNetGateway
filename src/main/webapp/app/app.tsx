import 'react-toastify/dist/ReactToastify.css';
import './bootstrap.scss';
import './app.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'reactstrap';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer, ToastPosition, toast } from 'react-toastify';
import ReactGA from 'react-ga';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import PrivateRoute, { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import GoBackButton from 'app/shared/layout/go-back-button';
import { containerStyle } from 'app/shared/util/measure-widths';
import ProviderHome from 'app/modules/provider/provider-app';

export interface IAppProps extends StateProps, DispatchProps {}

export class App extends React.Component<IAppProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.getProfile();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userLogin && !prevProps.userLogin) {
      ReactGA.set({ dimension1: this.props.userLogin });
    }
  }

  render() {
    const padding = '10px';
    const app = (
      <div>
        <div className="app-container">
          <GoBackButton />
          <ToastContainer
            position={toast.POSITION.TOP_LEFT as ToastPosition}
            className="toastify-container"
            toastClassName="toastify-toast"
          />
          <ErrorBoundary>
            <Header
              isAuthenticated={this.props.isAuthenticated}
              isAdmin={this.props.isAdmin}
              currentLocale={this.props.currentLocale}
              onLocaleChange={this.props.setLocale}
              ribbonEnv={this.props.ribbonEnv}
              isStaging={this.props.isStaging}
              isInProduction={this.props.isInProduction}
              isSwaggerEnabled={this.props.isSwaggerEnabled}
              userLogin={this.props.userLogin}
              isSacramento={this.props.isSacramento}
              isShelterOwner={this.props.isShelterOwner}
            />
          </ErrorBoundary>
          <div className="container-fluid view-container" id="app-view-container">
            <Card className="jh-card" style={{ padding }}>
              <ErrorBoundary>
                <AppRoutes isAdmin={this.props.isAdmin} isSacramento={this.props.isSacramento} />
              </ErrorBoundary>
            </Card>
          </div>
          <Footer />
        </div>
      </div>
    );

    return (
      <Router>
        <div id="measure-layer" style={containerStyle} />
        <Switch>
          <PrivateRoute path="/provider" component={ProviderHome} hasAnyAuthorities={[AUTHORITIES.ADMIN]} isAdmin={this.props.isAdmin} />
          <Route path="/" render={() => app} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = ({ authentication, applicationProfile, locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  isSacramento: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.SACRAMENTO]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isStaging: applicationProfile.isStaging,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
  userLogin: authentication.account.login,
  isShelterOwner: authentication.account.shelters && authentication.account.shelters.length > 0
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
