import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const ProviderHomeLinks = props => (
  <>
    <Link to={`/provider-home`} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.home" />
    </Link>
    <Link to={`/feedback`} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.feedback" />
    </Link>
    <Link to={`/referral`} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.referral">Referral</Translate>
    </Link>
    <Link to={`/referral-history`} onClick={() => props.toggleMenu()}>
      <Translate contentKey="providerSite.menu.beneficiaryHistory">Beneficiary History</Translate>
    </Link>
    <Link to={`/deactivated-records`} onClick={() => props.toggleMenu()}>
      <Translate contentKey="providerSite.menu.deactivatedRecords">Deactivated Records</Translate>
    </Link>
    <Link to={`/account/settings`} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.account.settings">Settings</Translate>
    </Link>
    <Link to={`/account/password`} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.account.password">Password</Translate>
    </Link>
    <Link to={`/about-us`} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.aboutUs" />
    </Link>
    <Link to={`/logout`} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.account.logout">Sign out</Translate>
    </Link>
  </>
);

const PublicHomeLinks = props => {
  const root = props.match ? props.match.url : '';
  const siloName = _.get(props.match, 'params.siloName', '');
  return (
    <>
      <Link to={root} onClick={() => props.toggleMenu()}>
        <Translate contentKey="global.menu.home" />
      </Link>
      {props.isAuthenticated ? (
        <Link to={`/logout`} onClick={() => props.toggleMenu()}>
          <Translate contentKey="global.menu.account.logout">Sign out</Translate>
        </Link>
      ) : (
        <>
          <Link to={`${root}/login`} onClick={() => props.toggleMenu()}>
            <Translate contentKey="global.menu.account.login">Sign in</Translate>
          </Link>
          <Link to={`/register${!_.isEmpty(siloName) ? `/${siloName}` : ''}`}>
            <Translate contentKey="global.menu.account.register">Register</Translate>
          </Link>
        </>
      )}
    </>
  );
};

export const SideMenu = props => (
  <Menu isOpen={props.menuOpen} customCrossIcon={<FontAwesomeIcon icon="times" size="lg" style={{ width: '100%', height: '100%' }} />}>
    <div className="side-menu-container">{props.isPublic ? <PublicHomeLinks {...props} /> : <ProviderHomeLinks {...props} />}</div>
  </Menu>
);
