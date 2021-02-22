import './silo.scss';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './silo.reducer';
import { translate, Translate } from 'react-jhipster';
import ImageCropModal, { TEXT_ASPECT, TEXT_HEIGHT } from 'app/modules/account/settings/image-crop-modal';
import { toBase64 } from 'app/shared/util/file-utils';
import { Textfit } from 'react-textfit';
import { LABEL_EXTRA_HEIGHT, LOGO_ASPECT, LOGO_HEIGHT, LOGO_WIDTH } from 'app/shared/layout/header/header-components';

export interface ISiloUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SiloUpdate = (props: ISiloUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [logoBase64, setLogoBase64] = useState('');
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [label, setLabel] = useState(null);
  const { siloEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/silo' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(
    () => {
      if (props.updateSuccess) {
        handleClose();
      }
    },
    [props.updateSuccess]
  );

  useEffect(
    () => {
      if (!props.loading) {
        setLogoBase64(props.siloEntity.logoBase64);
        setLabel(props.siloEntity.label);
      }
    },
    [props.siloEntity]
  );

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...siloEntity,
        ...values
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  const closeLogoModal = () => {
    setShowLogoModal(false);
  };

  const onLogoSubmit = (newLogo, newLabel) => {
    setLogoBase64(newLogo);
    setLabel(newLabel);
    setShowLogoModal(false);
  };

  const handleImageFileRead = async e => {
    const file = event.target['files'] && event.target['files'][0];
    if (file) {
      const image = await toBase64(file);
      setShowLogoModal(true);
      setImageBase64(image);
    }
  };

  const imageHeight = LOGO_HEIGHT - (label ? LOGO_HEIGHT * TEXT_ASPECT - LABEL_EXTRA_HEIGHT : 0);

  const labelComponent = label ? (
    <div
      className="label text-center stretch-children d-flex"
      style={{ width: imageHeight * LOGO_ASPECT, height: LOGO_HEIGHT * TEXT_ASPECT }}
    >
      <Textfit mode="single" forceSingleModeWidth={false}>
        {label}
      </Textfit>
    </div>
  ) : null;

  return (
    <div className="silo">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="serviceNetGatewayApp.serviceNetSilo.home.createOrEditLabel">Create or edit a Silo</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : siloEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="silo-id">ID</Label>
                  <AvInput id="silo-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="silo-name">
                  Name
                </Label>
                <AvField id="silo-name" type="text" name="name" />
              </AvGroup>
              <AvGroup className="my-4">
                <Label id="activeLabel" check>
                  <AvInput id="silo-public" type="checkbox" className="form-control" name="public" />
                  <Translate contentKey="serviceNetApp.silo.isPublic">Public</Translate>
                </Label>
              </AvGroup>
              <AvGroup className="my-4">
                <Label id="activeLabel" check>
                  <AvInput id="silo-referralEnabled" type="checkbox" className="form-control" name="referralEnabled" />
                  <Translate contentKey="serviceNetApp.silo.isReferralEnabled">Referral enabled</Translate>
                </Label>
              </AvGroup>
              {logoBase64 && (
                <div className="mt-2 mb-2 brand-logo">
                  <AvField type="hidden" name="logoBase64" value={logoBase64} />
                  <img alt="Silo logo big preview" src={logoBase64} style={{ height: imageHeight }} />
                  {labelComponent}
                  <AvField type="hidden" name="label" value={label} />
                </div>
              )}
              <div className="d-flex justify-content-between mt-3 mb-3">
                <Translate contentKey="serviceNetApp.silo.uploadLogo">Upload Logo</Translate>
                <AvField name="image" type="file" accept=".jpeg, .png, .jpg" onChange={handleImageFileRead} />
              </div>
              <ImageCropModal
                title="serviceNetApp.silo.chooseLogo"
                previewStyle="d-inline mr-2"
                onePreview
                outputWidth={LOGO_WIDTH}
                imageAspect={LOGO_ASPECT}
                showModal={showLogoModal}
                handleClose={closeLogoModal}
                handleSubmit={onLogoSubmit}
                imageBase64={imageBase64}
                includeLabel
                label={label}
              />
              <Button tag={Link} id="cancel-save" to="/entity/silo" color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  siloEntity: storeState.silo.entity,
  loading: storeState.silo.loading,
  updating: storeState.silo.updating,
  updateSuccess: storeState.silo.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiloUpdate);
