import 'react-toastify/dist/ReactToastify.css';
import './provider-shared.scss';
import '../../bootstrap.scss';

import React from 'react';
import { connect } from 'react-redux';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES, SYSTEM_ACCOUNTS } from 'app/config/constants';
import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import ErrorBoundary from 'app/shared/error/error-boundary';
import Header from 'app/shared/layout/header/header';
import HeaderMobile from 'app/modules/provider/mobile-components/header-mobile';
import { Home as MainHome } from 'app/modules/home/home';
import { RouteComponentProps } from 'react-router-dom';
import { getUser } from 'app/modules/administration/user-management/user-management.reducer';
import { SideMenu } from './mobile-components/side-menu';
import MediaQuery from 'react-responsive';
import Routes from './routes';
import Footer from 'app/shared/layout/footer/footer';

export interface IProviderSiteProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IProviderSiteState {
  menuOpen: boolean;
}

export class ProviderApp extends React.Component<IProviderSiteProps, IProviderSiteState> {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  componentDidMount() {
    this.props.getUser(this.props.account.login);
  }

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  render() {
    const { match, isAdmin, account, loggingOut } = this.props;
    const { menuOpen } = this.state;

    const HeaderComponent = (
      <div>
        <MediaQuery maxDeviceWidth={768}>
          <HeaderMobile
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
            toggleMenu={this.toggleMenu}
            avatarBase64={this.props.account.avatarBase64}
          />
        </MediaQuery>
        <MediaQuery minDeviceWidth={769}>
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
            referralCount={this.props.referralCount}
            isReferralEnabled={this.props.isReferralEnabled}
            isServiceProvider={this.props.isServiceProvider}
            avatarBase64={this.props.account.avatarBase64}
          />
        </MediaQuery>
      </div>
    );

    return (
      <div className="provider-shared provider-app" id="provider-home-view-container">
        <SideMenu menuOpen={menuOpen} toggleMenu={this.toggleMenu} isReferralEnabled={this.props.isReferralEnabled} />
        <div className="app-container" id="app-container">
          <ToastContainer
            position={toast.POSITION.TOP_LEFT as ToastPosition}
            className="toastify-container"
            toastClassName="toastify-toast"
          />
          <ErrorBoundary>{HeaderComponent}</ErrorBoundary>
          <ErrorBoundary>
            {!loggingOut && <Routes isAdmin={isAdmin} match={match} location={this.props.location} account={this.props.account} />}
          </ErrorBoundary>
        </div>
        <div className="d-none d-md-inline">
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, applicationProfile, locale, activity, providerRecord }: IRootState) => ({
  account: authentication.account,
  autosuggestOptions: MainHome.getAutosuggestOptions(activity.suggestions),
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  isSacramento: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.SACRAMENTO]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isStaging: applicationProfile.isStaging,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
  userLogin: authentication.account.login,
  isShelterOwner: authentication.account.shelters && authentication.account.shelters.length > 0,
  loggingOut: authentication.loggingOut,
  referralCount: providerRecord.referredRecords.size,
  isReferralEnabled: authentication.account.siloIsReferralEnabled,
  isServiceProvider: authentication.account.systemAccountName === SYSTEM_ACCOUNTS.SERVICE_PROVIDER
});

const mapDispatchToProps = {
  setLocale,
  getSession,
  getProfile,
  getUser
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProviderApp);
