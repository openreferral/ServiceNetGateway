import React from 'react';
import { Translate } from 'react-jhipster';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MediaQuery from 'react-responsive';
import 'lazysizes';
// tslint:disable-next-line:no-submodule-imports
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import { Avatar } from './avatar';

export const NavDropdown = props => (
  <UncontrolledDropdown nav inNavbar id={props.id}>
    <DropdownToggle nav caret className="d-flex align-items-center">
      {props.isAuthenticated ? (
        <div className="self-align-center">
          <Avatar size="small" name={`${props.name.charAt(0).toUpperCase()}`} avatarBase64={props.avatarBase64} />
        </div>
      ) : (
        <FontAwesomeIcon icon={props.icon} />
      )}
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

const getLogo = props =>
  props && props.logoBase64 ? (
    <div className="brand-icon">
      <img alt="Avatar big preview" src={props.logoBase64} />
    </div>
  ) : (
    <BrandIcon />
  );

export const BrandMenu = props => {
  let homeUrl = '/';
  let nabBrandUrl = '/';
  if (props.isSacramento) {
    homeUrl = '/shelters';
    nabBrandUrl = '/shelters';
  } else if (props.isServiceProvider) {
    homeUrl = '/provider-home';
    nabBrandUrl = '/provider-home';
  } else if (props.isPublic && !props.isAuthenticated) {
    homeUrl = props.match.url;
    nabBrandUrl = props.match.url;
  }

  const onHomeLinkClick = () => props.toggleSingleRecordView({ orgId: null, singleRecordViewActive: false });

  return (
    <div className="d-flex align-items-center brand-menu">
      <NavbarBrand tag={Link} to={nabBrandUrl} className="brand-logo d-flex align-items-center mr-1" onClick={onHomeLinkClick}>
        <MediaQuery minDeviceWidth={769}>{getLogo(props)}</MediaQuery>
      </NavbarBrand>
      <NavLink exact tag={Link} to={homeUrl} className="pl-0" onClick={onHomeLinkClick}>
        <span className="navbar-label text-dark header-link">
          <Translate contentKey="global.menu.home" />
        </span>
      </NavLink>
      {props.isServiceProvider && props.isReferralEnabled ? (
        <NavLink exact tag={Link} to="/referral-history" className="pl-0">
          <span className="navbar-label text-dark header-link">
            <Translate contentKey="providerSite.menu.beneficiaryHistory">Beneficiary History</Translate>
          </span>
        </NavLink>
      ) : null}
      <NavLink exact tag={Link} to="/feedback" className="pl-0">
        <span className="navbar-label text-dark header-link">
          <Translate contentKey="global.menu.feedback" />
        </span>
      </NavLink>
    </div>
  );
};

export const HomeButton = props =>
  (props.isSacramento || props.isPublic) && (
    <NavLink exact tag={Link} to={`${props.prependRoutesWithMatch ? props.match.url : ''}`} className="px-0">
      <span className={`navbar-label text-dark mx-1 ${props.isPublic ? 'header-link' : ''}`}>
        <Translate contentKey="global.menu.home" />
      </span>
    </NavLink>
  );

export const FeedbackButton = props =>
  (props.isSacramento || props.isPublic) && (
    <NavLink exact tag={Link} to={`${props.prependRoutesWithMatch ? props.match.url : ''}/feedback`} className="px-0">
      <span className={`navbar-label text-dark ${props.isPublic ? 'header-link' : ''}`}>
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
