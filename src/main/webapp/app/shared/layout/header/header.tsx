import './header.scss';
import React from 'react';
import { Translate, Storage } from 'react-jhipster';
import { Navbar, Nav, NavbarToggler, Collapse } from 'reactstrap';
import MediaQuery from 'react-responsive';
import 'lazysizes';
// tslint:disable-next-line:no-submodule-imports
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import LoadingBar from 'react-redux-loading-bar';

import { Home, Brand, Upload, FeedbackButton, DataStatus } from './header-components';
import { AdminMenu, EntitiesMenu, AccountMenu, LocaleMenu, SacramentoMenu } from './menus';
import SearchBar from 'app/modules/provider/menus/search-bar';

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
  isProvider: boolean;
  match?: any;
  prependRoutesWithMatch?: boolean;
}

export interface IHeaderState {
  menuOpen: boolean;
}

export default class Header extends React.Component<IHeaderProps, IHeaderState> {
  state: IHeaderState = {
    menuOpen: false
  };

  handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    this.props.onLocaleChange(langKey);
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
    const { currentLocale, isAuthenticated, isAdmin, isSwaggerEnabled, isInProduction, isSacramento, isShelterOwner, isProvider } = this.props;

    /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

    return (
      <div id="app-header" className="header">
        {this.renderDevRibbon()}
        <LoadingBar className="loading-bar" />
        <Navbar expand="sm" fixed="top" className="navbar-light bg-white">
          <NavbarToggler aria-label="Menu" onClick={this.toggleMenu} />
          <MediaQuery maxDeviceWidth={768}>
            <div className="brand-logo">
              <div className="brand-icon ">
                <img data-src="content/images/benetech-logo.png" className="lazyload" alt="Logo" />
              </div>
            </div>
          </MediaQuery>
          <Brand {...this.props} />
          <FeedbackButton {...this.props} />
          <Collapse isOpen={this.state.menuOpen} navbar>
            <Nav id="header-tabs" className="ml-auto" navbar>
              {isProvider ? <li className="self-align-center">
                <SearchBar />
              </li> : null}
              {(!isAuthenticated || !isSacramento) && <Home {...this.props} />}
              {isAuthenticated && !isSacramento && <DataStatus />}
              {isAuthenticated && isSacramento && <SacramentoMenu isShelterOwner={isShelterOwner} />}
              {isAuthenticated && isAdmin && <EntitiesMenu />}
              {isAuthenticated && isAdmin && <Upload />}
              {isAuthenticated && isAdmin && <AdminMenu showSwagger={isSwaggerEnabled} showDatabase={!isInProduction} />}
              <LocaleMenu currentLocale={currentLocale} onClick={this.handleLocaleChange} />
              <AccountMenu {...this.props} />
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
