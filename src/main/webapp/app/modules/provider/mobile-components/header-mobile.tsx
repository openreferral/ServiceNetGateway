import './header-mobile.scss';
import React from 'react';
import { Translate } from 'react-jhipster';
import { NavbarBrand, Navbar, Row, Col } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingBar from 'react-redux-loading-bar';
import { Avatar } from 'app/shared/layout/header/avatar';
import { BrandIcon } from './mobile-header-components';
import { FeedbackButton } from 'app/shared/layout/header/header-components';

export interface IHeaderMobileProps {
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
  prependRoutesWithMatch?: boolean;
}

export interface IHeaderMobileState {
  menuOpen: boolean;
}

export default class HeaderMobile extends React.Component<IHeaderMobileProps, IHeaderMobileState> {
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
                  <BrandIcon />
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
