import React from 'react';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink as Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './header-components';

const accountMenuItemsAuthenticated = (isReferralEnabled: boolean) => (
  <>
    <DropdownItem tag={Link} to="/account/settings">
      <FontAwesomeIcon icon="wrench" /> <Translate contentKey="global.menu.account.settings">Settings</Translate>
    </DropdownItem>
    {isReferralEnabled ?
      <DropdownItem tag={Link} to="/referral-history">
        <FontAwesomeIcon icon="edit" /> <Translate contentKey="providerSite.menu.beneficiaryHistory">Beneficiary History</Translate>
      </DropdownItem> : null}
    <DropdownItem tag={Link} to="/account/password">
      <FontAwesomeIcon icon="clock" /> <Translate contentKey="global.menu.account.password">Password</Translate>
    </DropdownItem>
    <DropdownItem tag={Link} to="/deactivated-records">
      <FontAwesomeIcon icon="clipboard-list" /> <Translate contentKey="providerSite.menu.deactivatedRecords">Deactivated Records</Translate>
    </DropdownItem>
    <DropdownItem tag={Link} to="/logout">
      <FontAwesomeIcon icon="sign-out-alt" /> <Translate contentKey="global.menu.account.logout">Sign out</Translate>
    </DropdownItem>
  </>
);

const accountMenuItems = (
  <>
    <DropdownItem id="login-item" tag={Link} to="/login">
      <FontAwesomeIcon icon="sign-in-alt" /> <Translate contentKey="global.menu.account.login">Sign in</Translate>
    </DropdownItem>
    <DropdownItem tag={Link} to="/register">
      <FontAwesomeIcon icon="sign-in-alt" /> <Translate contentKey="global.menu.account.register">Register</Translate>
    </DropdownItem>
  </>
);

export const AccountMenu = ({ isAuthenticated = false, userLogin, isReferralEnabled }) => (
  <NavDropdown icon="user" name={userLogin ? userLogin : translate('global.menu.account.main')} id="account-menu">
    {isAuthenticated ? accountMenuItemsAuthenticated(isReferralEnabled) : accountMenuItems}
  </NavDropdown>
);

export default AccountMenu;
