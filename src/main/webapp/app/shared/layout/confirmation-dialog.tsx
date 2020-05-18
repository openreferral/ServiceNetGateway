import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';

export interface IConfirmationDialogProps {
  question: any;
  handleClose: any;
  handleConfirm: any;
}

export class ConfirmationDialog extends React.Component<IConfirmationDialogProps> {
  confirm = event => {
    this.props.handleConfirm();
  };

  handleClose = event => {
    event.stopPropagation();
    this.props.handleClose();
  };

  render() {
    return (
      <Modal isOpen toggle={this.handleClose}>
        <ModalHeader toggle={this.handleClose}>
          <Translate contentKey="global.dialog.confirm" />
        </ModalHeader>
        <ModalBody>
          {this.props.question}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.handleClose}>
            <Translate contentKey="global.dialog.cancel" />
          </Button>
          <Button color="danger" onClick={this.confirm}>
            <Translate contentKey="global.dialog.confirm" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmationDialog;
