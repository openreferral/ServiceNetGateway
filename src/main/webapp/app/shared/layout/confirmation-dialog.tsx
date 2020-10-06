import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Translate } from 'react-jhipster';
import ButtonPill from 'app/modules/provider/shared/button-pill';

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
        <ModalBody>{this.props.question}</ModalBody>
        <ModalFooter>
          <ButtonPill className="button-pill-secondary" onClick={this.handleClose}>
            <Translate contentKey="global.dialog.cancel" />
          </ButtonPill>
          <ButtonPill className="button-pill-danger" onClick={this.confirm}>
            <Translate contentKey="global.dialog.confirm" />
          </ButtonPill>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmationDialog;
