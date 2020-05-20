import './header.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { Avatar } from '../avatar';

export const NavDropdown = props => (
  <UncontrolledDropdown nav inNavbar id={props.id}>
    <DropdownToggle nav caret className="d-flex align-items-center">
      <div className="self-align-center">
        <Avatar size="small" name={`${props.name.charAt(0).toUpperCase()}`} />
      </div>
      <span className="navbar-label">{props.name}</span>
    </DropdownToggle>
    <DropdownMenu right style={props.style}>
      {props.children}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/benetech-logo.png" alt="Logo" />
  </div>
);

export const Brand = props => (
  <div className="d-flex align-items-center brand-menu">
    <NavbarBrand tag={Link} to={props.isSacramento ? '/shelters' : '/'} className="brand-logo d-flex align-items-center mr-1">
      <BrandIcon />
    </NavbarBrand>
    <NavLink exact tag={Link} to="/provider-home" className="pl-0">
      <span className="navbar-label text-dark header-link">
        <Translate contentKey="global.menu.home" />
      </span>
    </NavLink>
    <NavLink exact tag={Link} to="/about-us" className="pl-0">
      <span className="navbar-label text-dark header-link">
        <Translate contentKey="global.menu.aboutUs" />
      </span>
    </NavLink>
    <a href={'mailto:servicenet@benetech.org'} className="pl-0">
      <span className="navbar-label text-dark header-link">
        <Translate contentKey="global.menu.contact" />
      </span>
    </a>
  </div>
);
