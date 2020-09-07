import React from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MediaQuery from 'react-responsive';
import ButtonPill from './shared/button-pill';

import { ORDER_DESC, ORDER_ASC, DEFAULT_SORT_ORDER } from 'app/shared/util/search-utils';

const SortActivity = props => {
  const values = props.values;
  const dropdownOpen = props.dropdownOpen;
  const toggleSort = props.toggleSort;
  const sort = props.sort;
  const order = props.order;
  const sortFunc = value => () => {
    let o = DEFAULT_SORT_ORDER;

    if (value === sort) {
      o = order === ORDER_ASC ? ORDER_DESC : ORDER_ASC;
    }
    props.sortFunc(value, o);
  };

  const menuContent = (
    <div>
      {values.map((value, i) => (
        <div role="menuitem" className="p-2 sort-menu-item" onClick={sortFunc(value)} key={`sortItem${i}`}>
          <Translate contentKey={`providerSite.sortProperties.${value}`} />{' '}
          {sort === value ? <FontAwesomeIcon icon={order === ORDER_ASC ? 'angle-up' : 'angle-down'} /> : null}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <MediaQuery maxDeviceWidth={768}>
        <ButtonPill onClick={toggleSort} translate="providerSite.sort" className="mr-1" />
        <Modal isOpen={dropdownOpen} centered toggle={toggleSort}>
          <ModalHeader>
            <Translate contentKey="providerSite.sort" />
          </ModalHeader>
          <ModalBody>{menuContent}</ModalBody>
          <ModalFooter>
            <ButtonPill onClick={toggleSort} translate="providerSite.close" />
          </ModalFooter>
        </Modal>
      </MediaQuery>
      <MediaQuery minDeviceWidth={769}>
        <Dropdown isOpen={dropdownOpen} toggle={toggleSort}>
          <DropdownToggle tag="div">
            <ButtonPill translate="providerSite.sort" className="mr-1" />
          </DropdownToggle>
          <DropdownMenu right={false}>{menuContent}</DropdownMenu>
        </Dropdown>
      </MediaQuery>
    </div>
  );
};

export default SortActivity;
