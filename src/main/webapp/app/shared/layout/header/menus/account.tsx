import React from 'react';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink as Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from '../header-components';
import _ from 'lodash';

const accountMenuItemsAuthenticated = (isSacramento, isReferralEnabled, isServiceProvider) => (
  <>
    <DropdownItem tag={Link} to="/account/settings">
      <FontAwesomeIcon icon="wrench" /> <Translate contentKey="global.menu.account.settings">Settings</Translate>
    </DropdownItem>
    {isServiceProvider && isReferralEnabled ? (
      <DropdownItem tag={Link} to="/referral-history">
        <FontAwesomeIcon icon="edit" /> <Translate contentKey="providerSite.menu.beneficiaryHistory">Beneficiary History</Translate>
      </DropdownItem>
    ) : null}
    <DropdownItem tag={Link} to="/account/password">
      <FontAwesomeIcon icon="clock" /> <Translate contentKey="global.menu.account.password">Password</Translate>
    </DropdownItem>
    {isSacramento || isServiceProvider ? null : (
      <DropdownItem tag={Link} to="/hidden-matches">
        <FontAwesomeIcon icon="eye" /> <Translate contentKey="global.menu.admin.hiddenRecords">View hidden matches</Translate>
      </DropdownItem>
    )}
    {isServiceProvider && (
      <DropdownItem tag={Link} to="/deactivated-records">
        <FontAwesomeIcon icon="clipboard-list" />{' '}
        <Translate contentKey="providerSite.menu.deactivatedRecords">Deactivated Records</Translate>
      </DropdownItem>
    )}
    <DropdownItem tag={Link} to="/logout">
      <FontAwesomeIcon icon="sign-out-alt" /> <Translate contentKey="global.menu.account.logout">Sign out</Translate>
    </DropdownItem>
  </>
);

const accountMenuItems = (match, prependRoutesWithMatch = false) => {
  const siloName = _.get(match, 'params.siloName', '');
  const loginUrl = (prependRoutesWithMatch ? match.url : ``) + '/login';
  return (
    <>
      <DropdownItem id="login-item" tag={Link} to={loginUrl}>
        <FontAwesomeIcon icon="sign-in-alt" /> <Translate contentKey="global.menu.account.login">Sign in</Translate>
      </DropdownItem>
      <DropdownItem tag={Link} to={`/register${!_.isEmpty(siloName) ? `/${siloName}` : ''}`}>
        <FontAwesomeIcon icon="sign-in-alt" /> <Translate contentKey="global.menu.account.register">Register</Translate>
      </DropdownItem>
    </>
  );
};

export const AccountMenu = ({
  isAuthenticated = false,
  userLogin,
  isAdmin = false,
  isSacramento = false,
  match = {},
  prependRoutesWithMatch = false,
  isReferralEnabled = false,
  isServiceProvider = false
}) => (
  <NavDropdown
    icon="user"
    name={userLogin ? userLogin : translate('global.menu.account.main')}
    id="account-menu"
    style={{ fontWeight: 'bold' }}
    isAuthenticated={isAuthenticated}
  >
    {isAuthenticated
      ? accountMenuItemsAuthenticated(isSacramento, isReferralEnabled, isServiceProvider)
      : accountMenuItems(match, prependRoutesWithMatch)}
  </NavDropdown>
);

export default AccountMenu;
