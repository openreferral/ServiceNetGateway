import React from 'react';
import { Translate } from 'react-jhipster';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MediaQuery from 'react-responsive';
import 'lazysizes';
// tslint:disable-next-line:no-submodule-imports
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import appConfig from 'app/config/constants';

export const NavDropdown = props => (
  <UncontrolledDropdown nav inNavbar id={props.id}>
    <DropdownToggle nav caret className="d-flex align-items-center">
      <FontAwesomeIcon icon={props.icon} />
      <span className="navbar-label">{props.name}</span>
    </DropdownToggle>
    <DropdownMenu right style={props.style}>
      {props.children}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img data-src="content/images/benetech-logo.png" className="lazyload" alt="Logo" />
  </div>
);

export const Brand = props => {
  const { isSacramento, prependRoutesWithMatch, match } = props;
  let url = `/`;

  if (isSacramento) {
    url = '/shelters';
  } else if (prependRoutesWithMatch) {
    url = match.url;
  }

  return (
    <div className="d-flex align-items-center">
      <NavbarBrand tag={Link} to={url} className="brand-logo d-flex align-items-center mr-1">
        <MediaQuery minDeviceWidth={769}>
          <BrandIcon />
        </MediaQuery>
        <span className="navbar-version mt-1">{appConfig.VERSION}</span>
      </NavbarBrand>
      <NavLink exact tag={Link} to={`${prependRoutesWithMatch ? match.url : ''}/about-us`} className="pl-0">
        <span className="navbar-label text-dark about-us-link">
          <Translate contentKey="global.menu.aboutUs" />
        </span>
      </NavLink>
    </div>
  );
};

export const FeedbackButton = props =>
  (props.isSacramento || props.isProvider) && (
    <NavLink exact tag={Link} to={`${props.prependRoutesWithMatch ? props.match.url : ''}/feedback`} className="pl-0">
      <span className="navbar-label text-dark about-us-link">
        <Translate contentKey="global.menu.feedback" />
      </span>
    </NavLink>
  );

export const Home = props => {
  const { prependRoutesWithMatch, match } = props;
  const url = prependRoutesWithMatch ? match.url : `/`;
  return (
    <NavItem>
      <NavLink exact tag={Link} to={url} className="d-flex align-items-center">
        <FontAwesomeIcon icon="home" />
        <span className="navbar-label">
          <Translate contentKey="global.menu.home" />
        </span>
      </NavLink>
    </NavItem>
  );
};

export const DataStatus = props => (
  <NavItem>
    <NavLink exact tag={Link} to="/data-status" className="d-flex align-items-center">
      <FontAwesomeIcon icon="table" />
      <span className="navbar-label">
        <Translate contentKey="global.menu.dataStatus" />
      </span>
    </NavLink>
  </NavItem>
);

export const Upload = props => (
  <NavItem>
    <NavLink tag={Link} to="/upload" className="d-flex align-items-center">
      <FontAwesomeIcon icon="file-upload" />
      <span className="navbar-label">
        <Translate contentKey="global.menu.upload" />
      </span>
    </NavLink>
  </NavItem>
);
