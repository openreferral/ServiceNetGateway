import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { getCroppedImg, getCroppedImgDimensions } from 'app/shared/util/file-utils';
import ReactCrop from 'react-image-crop';
// tslint:disable-next-line:no-submodule-imports
import 'react-image-crop/dist/ReactCrop.css';
import { Textfit } from 'react-textfit';
import './image-crop-modal.scss';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { LABEL_EXTRA_HEIGHT, LOGO_ASPECT, LOGO_HEIGHT } from 'app/shared/layout/header/header-components';
import { fitText } from 'app/shared/util/font-utils';

export const AVATAR_ASPECT = 1;
export const MAX_OUTPUT_WIDTH = 120;
export const TEXT_ASPECT = 0.25;
export const INITIAL_FONT_SIZE = 9;
export const FIT_TEXT_LONGER_THAN = 25;
export const TEXT_HEIGHT = TEXT_ASPECT * 100 + '%';

export interface IImageCropModal {
  showModal: boolean;
  handleClose: any;
  handleSubmit: Function;
  imageBase64: any;
  outputWidth?: number;
  imageAspect?: number;
  onePreview?: boolean;
  previewStyle?: any;
  title?: any;
  includeLabel?: boolean;
  label?: string;
}

export default function ImageCropModal(props: IImageCropModal) {
  const [image, setImage] = useStateWithCallbackLazy(0);
  const [avatarBase64, setAvatarBase64] = useState('');
  const [dimensions, setDimensions] = useState({ height: 0 });
  const [label, setLabel] = useState(props.label);
  const [crop, setCrop] = useState({
    aspect: props.imageAspect ? props.imageAspect : AVATAR_ASPECT
  });

  const handleSubmit = evt => {
    props.handleSubmit(avatarBase64, label);
  };

  const onCropChange = newCrop => {
    setCrop(newCrop);
  };

  const cropAndSetImage = (newCrop, newImage = image) => {
    const outputWidth = props.outputWidth ? props.outputWidth : MAX_OUTPUT_WIDTH;
    const newDimensions = getCroppedImgDimensions(newImage, newCrop, outputWidth);
    setCrop(newCrop);
    setDimensions(newDimensions);
    setAvatarBase64(getCroppedImg(newImage, newDimensions));
  };

  const onCropComplete = async currentCrop => {
    cropAndSetImage(currentCrop);
  };

  const onImageLoaded = img => {
    const newAspect = props.imageAspect ? props.imageAspect : AVATAR_ASPECT;
    const newWidth = img.width / newAspect < img.height * newAspect ? img.width : img.height * newAspect;
    const newHeight = img.width / newAspect > img.height * newAspect ? img.height : img.width / newAspect;
    const x = (img.width - newWidth) / 2;
    const y = (img.height - newHeight) / 2;
    const newCrop = { aspect: newAspect, width: newWidth, height: newHeight, x, y };
    setImage(img, newImage => {
      cropAndSetImage(newCrop, newImage);
    });
    return false;
  };

  const handleLabelChange = event => {
    setLabel(event.target.value);
  };

  const { showModal, handleClose, imageBase64, onePreview, includeLabel } = props;
  const previewStyle = props.previewStyle ? props.previewStyle : 'avatar-big d-inline mr-2';
  const title = props.title ? props.title : 'userManagement.avatar.modalTitle';
  const imageHeight = dimensions.height - (label ? dimensions.height * TEXT_ASPECT - LABEL_EXTRA_HEIGHT : 0);
  const labelComponent = label ? (
    <div
      className="flex-grow-1 text-right stretch-children d-flex"
      style={{ width: imageHeight * LOGO_ASPECT, height: LOGO_HEIGHT * TEXT_ASPECT }}
    >
      {fitText(label, FIT_TEXT_LONGER_THAN, INITIAL_FONT_SIZE)}
    </div>
  ) : null;

  return (
    <Modal isOpen={showModal} toggle={handleClose} backdrop="static" id="dismiss-page" autoFocus={false}>
      <AvForm>
        <ModalHeader id="dismiss-title" toggle={handleClose}>
          <Translate contentKey={title} />
        </ModalHeader>
        <ModalBody className="image-crop-modal">
          <Row>
            <Col md={12}>
              {imageBase64 && (
                <>
                  <ReactCrop
                    src={imageBase64}
                    crop={crop}
                    onImageLoaded={onImageLoaded}
                    onChange={onCropChange}
                    onComplete={onCropComplete}
                    ruleOfThirds
                  />
                </>
              )}
              {includeLabel && (
                <>
                  <div className="mt-3 mb-2">
                    <Translate contentKey="serviceNetApp.silo.greyLabeling" />
                  </div>
                  <input name="label" value={label} onChange={handleLabelChange} />
                </>
              )}
              <div className="mt-3 mb-2">
                <Translate contentKey="userManagement.avatar.preview" />
              </div>
              <div className="mb-1">
                <div style={{ height: imageHeight }} className="d-flex">
                  {avatarBase64 && <img alt="Avatar big preview" className={previewStyle} src={avatarBase64} />}
                  {avatarBase64 && !onePreview && <img alt="Avatar small preview" className="avatar-small d-inline" src={avatarBase64} />}
                </div>
                {labelComponent}
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            <Translate contentKey="userManagement.avatar.set" />
          </Button>
          <button type="button" onClick={handleClose} className="btn close-button">
            <Translate contentKey="userManagement.avatar.cancel" />
          </button>
        </ModalFooter>
      </AvForm>
    </Modal>
  );
}
