import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

export const SideMenu = props => (
  <Menu isOpen={props.menuOpen} customCrossIcon={<FontAwesomeIcon icon="times" size="lg" style={{ width: '100%', height: '100%' }} />}>
    <div className="side-menu-container">
      <Link to={'/provider-home'} onClick={() => props.toggleMenu()}>
        <Translate contentKey="global.menu.home" />
      </Link>
      <Link to={'/about-us'} onClick={() => props.toggleMenu()}>
        <Translate contentKey="global.menu.aboutUs" />
      </Link>
      <a href={'mailto:servicenet@benetech.org'} onClick={() => props.toggleMenu()}>
        <Translate contentKey="global.menu.contact" />
      </a>
      <Link to="/feedback" onClick={() => props.toggleMenu()}>
        <Translate contentKey="global.menu.feedback" />
      </Link>
      <Link to={'/deactivated-records'} onClick={() => props.toggleMenu()}>
        <Translate contentKey="providerSite.menu.deactivatedRecords">Deactivated Records</Translate>
      </Link>
      <Link to={'/account/settings'} onClick={() => props.toggleMenu()}>
        <Translate contentKey="global.menu.account.settings">Settings</Translate>
      </Link>
      <Link to={'/account/password'} onClick={() => props.toggleMenu()}>
        <Translate contentKey="global.menu.account.password">Password</Translate>
      </Link>
      <Link to={'/logout'} onClick={() => props.toggleMenu()}>
        <Translate contentKey="global.menu.account.logout">Sign out</Translate>
      </Link>
    </div>
  </Menu>
);
