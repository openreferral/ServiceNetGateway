import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IDailyUpdate } from 'app/shared/model/ServiceNet/daily-update.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './daily-update.reducer';

export interface IDailyUpdateDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DailyUpdateDeleteDialog = (props: IDailyUpdateDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('entity/daily-update' + props.location.search);
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
    props.deleteEntity(props.dailyUpdateEntity.id);
  };

  const { dailyUpdateEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm delete operation</ModalHeader>
      <ModalBody id="serviceNetGatewayApp.serviceNetDailyUpdate.delete.question">
        Are you sure you want to delete this DailyUpdate?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-dailyUpdate" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ dailyUpdate }: IRootState) => ({
  dailyUpdateEntity: dailyUpdate.entity,
  updateSuccess: dailyUpdate.updateSuccess
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyUpdateDeleteDialog);
