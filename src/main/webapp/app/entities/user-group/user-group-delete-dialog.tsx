import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './user-group.reducer';

export interface IUserGroupDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserGroupDeleteDialog = (props: IUserGroupDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/entity/user-group' + props.location.search);
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
    props.deleteEntity(props.userGroupEntity.id);
    handleClose();
  };

  const { userGroupEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm delete operation</ModalHeader>
      <ModalBody id="serviceNetGatewayApp.serviceNetUserGroup.delete.question">
        <Translate contentKey="serviceNetApp.userGroup.delete.question" />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-userGroup" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ userGroup }: IRootState) => ({
  userGroupEntity: userGroup.entity,
  updateSuccess: userGroup.updateSuccess
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserGroupDeleteDialog);
