import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IBeneficiary } from 'app/shared/model/ServiceNet/beneficiary.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './beneficiary.reducer';

export interface IBeneficiaryDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BeneficiaryDeleteDialog = (props: IBeneficiaryDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/entity/beneficiary');
  };

  useEffect(
    () => {
      if (props.updateSuccess) {
        handleClose();
      }
    },
    [props.updateSuccess]
  );

  const confirmDelete = () => {
    props.deleteEntity(props.beneficiaryEntity.id);
  };

  const { beneficiaryEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm delete operation</ModalHeader>
      <ModalBody id="serviceNetGatewayApp.beneficiary.delete.question">Are you sure you want to delete this Beneficiary?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-beneficiary" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ beneficiary }: IRootState) => ({
  beneficiaryEntity: beneficiary.entity,
  updateSuccess: beneficiary.updateSuccess
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BeneficiaryDeleteDialog);
