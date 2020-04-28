import './header.scss';
import React from 'react';
import { Translate } from 'react-jhipster';
import { Navbar, Nav, NavbarToggler, Collapse, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchBar from './search-bar';

import LoadingBar from 'react-redux-loading-bar';

import { Brand } from './header-components';
import { AccountMenu } from './account';

export interface IHeaderProps {
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
}

export interface IHeaderState {
  menuOpen: boolean;
}

export default class Header extends React.Component<IHeaderProps, IHeaderState> {
  state: IHeaderState = {
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

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  render() {
    const { currentLocale, isAuthenticated, isSwaggerEnabled, isInProduction, userLogin, isSacramento } = this.props;

    return (
      <div>
        {this.renderDevRibbon()}
        <LoadingBar className="loading-bar" />
        <Navbar expand="sm" fixed="top" className="navbar-light bg-white header-bar">
          <NavbarToggler aria-label="Menu" onClick={this.toggleMenu} />
          <Brand isSacramento={isSacramento} />
          <div className="ml-auto right-menu invisible-non-mobile">
            <div className="self-align-center">
              <Badge className="bell-bagde" color="info">
                12
              </Badge>
              <FontAwesomeIcon className="self-align-center" size="lg" icon="bell" />
            </div>
            <div className="header-item-padding">
              <AccountMenu isAuthenticated={isAuthenticated} userLogin={userLogin} />
            </div>
          </div>

          <Collapse isOpen={this.state.menuOpen} navbar>
            <Nav id="header-tabs" className="ml-auto header-item" navbar>
              <div className="self-align-center">
                <SearchBar />
              </div>
              <div className="self-align-center">
                <Badge className="bell-bagde" color="info">
                  12
                </Badge>
                <FontAwesomeIcon className="self-align-center" size="lg" icon="bell" />
              </div>
              <div className="header-item-padding">
                <AccountMenu isAuthenticated={isAuthenticated} userLogin={userLogin} />
              </div>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
