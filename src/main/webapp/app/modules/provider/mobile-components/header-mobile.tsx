import './header-mobile.scss';
import React from 'react';
import { Translate } from 'react-jhipster';
import { NavbarBrand, Navbar, Row, Col } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingBar from 'react-redux-loading-bar';
import { Avatar } from 'app/shared/layout/header/avatar';
import { BrandIcon } from './mobile-header-components';
import { FeedbackButton, LABEL_EXTRA_HEIGHT, LOGO_ASPECT } from 'app/shared/layout/header/header-components';
import { IRootState } from 'app/shared/reducers';
import { toggleSingleRecordView } from 'app/modules/provider/provider-record.reducer';
import { connect } from 'react-redux';
import { FIT_TEXT_LONGER_THAN, INITIAL_FONT_SIZE, TEXT_ASPECT } from 'app/modules/account/settings/image-crop-modal';
import { Textfit } from 'react-textfit';
import { fitText } from 'app/shared/util/font-utils';

export interface IHeaderMobileProps extends StateProps, DispatchProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSacramento: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isSwaggerEnabled: boolean;
  currentLocale: string;
  onLocaleChange: Function;
  userLogin: string;
  isShelterOwner: boolean;
  isStaging: boolean;
  toggleMenu: Function;
  avatarBase64: string;
  isPublic?: boolean;
  match?: any;
  logoBase64?: any;
  prependRoutesWithMatch?: boolean;
  label?: string;
}

export const MOBILE_LOGO_HEIGHT = 35;
export const MOBILE_INITIAL_FONT_SIZE = 7;

export interface IHeaderMobileState {
  menuOpen: boolean;
}

export class HeaderMobile extends React.Component<IHeaderMobileProps, IHeaderMobileState> {
  state: IHeaderMobileState = {
    menuOpen: false
  };

  renderDevRibbon = () =>
    this.props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${this.props.isStaging ? 'staging' : 'dev'}`} />
        </a>
      </div>
    ) : null;

  getLogo = () => {
    const { logoBase64, label } = this.props;
    const imageHeight = MOBILE_LOGO_HEIGHT - (label ? MOBILE_LOGO_HEIGHT * TEXT_ASPECT - LABEL_EXTRA_HEIGHT : 0);
    const labelComponent = label ? (
      <div
        className="label text-right stretch-children d-flex"
        style={{ width: imageHeight * LOGO_ASPECT, height: MOBILE_LOGO_HEIGHT * TEXT_ASPECT }}
      >
        {fitText(label, FIT_TEXT_LONGER_THAN, MOBILE_INITIAL_FONT_SIZE)}
      </div>
    ) : null;
    return logoBase64 ? (
      <div className="brand-icon">
        <img alt="Logo" src={logoBase64} style={{ height: imageHeight }} />
        {labelComponent}
      </div>
    ) : (
      <BrandIcon />
    );
  };

  render() {
    const { userLogin, isSacramento, match, avatarBase64 } = this.props;
    const rootUrl = match ? match.url : '/';
    return (
      <div>
        {this.renderDevRibbon()}
        <LoadingBar className="loading-bar" />
        <Navbar fixed="top" className="navbar-light bg-white header-bar-mobile">
          <div className="container-mobile">
            <Row noGutters className="nav-bar">
              <Col xs="2" className="height-fluid">
                <div className="square" style={{ float: 'left' }}>
                  <div className="content" onClick={() => this.props.toggleMenu()}>
                    <FontAwesomeIcon icon="bars" size="lg" style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>
              </Col>
              <Col className="height-fluid d-flex justify-content-center">
                <NavbarBrand
                  tag={Link}
                  to={`${rootUrl}${isSacramento ? 'shelters' : ''}`}
                  className="brand-logo d-flex align-items-center mr-1"
                >
                  {this.getLogo()}
                </NavbarBrand>
              </Col>
              <Col xs="2">
                <div style={{ float: 'right' }}>
                  {this.props.isPublic ? (
                    <FeedbackButton {...this.props} />
                  ) : (
                    <Avatar size="small" mobile name={`${userLogin && userLogin.charAt(0).toUpperCase()} `} avatarBase64={avatarBase64} />
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  account: storeState.authentication.account
});

const mapDispatchToProps = { toggleSingleRecordView };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderMobile);
