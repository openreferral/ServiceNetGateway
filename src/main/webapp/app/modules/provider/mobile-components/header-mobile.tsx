import './header-mobile.scss';
import React from 'react';
import { Translate } from 'react-jhipster';
import { Navbar, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingBar from 'react-redux-loading-bar';
import { Avatar } from 'app/modules/provider/avatar';
import { BrandIcon } from 'app/modules/provider/menus/header-components';
import SearchBar from '../menus/search-bar';

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
    const { currentLocale, isAuthenticated, isSwaggerEnabled, isInProduction, userLogin, isSacramento } = this.props;

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
              <Col className="height-fluid">
                <div className="brand-logo">
                  <BrandIcon />
                </div>
              </Col>
              <Col xs="2" className="height-fluid">
                <div className="square" style={{ float: 'right' }}>
                  <div className="content">
                    <Avatar size="small" mobile name={`${userLogin.charAt(0).toUpperCase()}`} />
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="search">
              <Col className="height-fluid">
                <SearchBar />
              </Col>
            </Row>
          </div>
        </Navbar>
      </div>
    );
  }
}
