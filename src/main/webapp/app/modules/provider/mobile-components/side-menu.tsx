import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

export const SideMenu = props => (
  <Menu isOpen={props.menuOpen} customCrossIcon={<FontAwesomeIcon icon="times" size="lg" style={{ width: '100%', height: '100%' }} />}>
    <Link to={'/provider-home'} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.home" />
    </Link>
    <Link to={'/about-us'} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.aboutUs" />
    </Link>
    <Link to={'/contact'} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.contact" />
    </Link>
    <Link to={'/logout'} onClick={() => props.toggleMenu()}>
      <Translate contentKey="global.menu.account.logout">Sign out</Translate>
    </Link>
  </Menu>
);
