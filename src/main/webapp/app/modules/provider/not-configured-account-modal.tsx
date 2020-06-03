import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';

const NotConfiguredAccountModal = props => (
  <Modal isOpen={props.isOpened} centered toggle={props.toggle}>
    <ModalHeader toggle={props.toggle}>
      <Translate contentKey="providerSite.alert" />
    </ModalHeader>
    <ModalBody>
      <Translate contentKey="providerSite.appNotConfiguredMessage" />
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={props.toggle}>
        OK
      </Button>{' '}
    </ModalFooter>
  </Modal>
);

export default NotConfiguredAccountModal;
