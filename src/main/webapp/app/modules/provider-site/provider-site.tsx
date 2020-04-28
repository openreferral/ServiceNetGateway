import 'react-toastify/dist/ReactToastify.css';
import './provider-site.scss';
import '../../bootstrap.scss';

import React from 'react';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import ErrorBoundary from 'app/shared/error/error-boundary';
import Header from './menus/header';
import { Avatar } from './avatar';
import UserRecords from './user-records';
import { translate, Translate } from 'react-jhipster';

export interface IProviderSiteProps extends StateProps, DispatchProps {}

export class ProviderSite extends React.Component<IProviderSiteProps> {
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
    const { userLogin } = this.props;
    return (
      <div id="provider-site-view-container">
        <div className="app-container">
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
          <div>
            <div className="hero-image">
              <div className="hero-text">
                <div className="hero-avatar">
                  <Avatar size="big" name={`${userLogin.charAt(0).toUpperCase()} `} />
                </div>
                <h5 className="hello-text">
                  <b>{`${translate('providerSite.hello')}${userLogin}!`}</b>
                </h5>
                <h4 className="hello-text">
                  <Translate contentKey="providerSite.anyUpdates" />
                </h4>
              </div>
            </div>
          </div>
          <div className="user-cards-container">
            <UserRecords />
          </div>
        </div>
      </div>
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
)(ProviderSite);
