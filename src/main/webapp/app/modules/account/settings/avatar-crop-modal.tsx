import React from 'react';
import { Translate } from 'react-jhipster';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { getCroppedImg } from 'app/shared/util/file-utils';
import ReactCrop from 'react-image-crop';
// tslint:disable-next-line:no-submodule-imports
import 'react-image-crop/dist/ReactCrop.css';

export const AVATAR_ASPECT = 1;
export const MAX_OUTPUT_WIDTH = 120;

export interface IAvatarCropModalProps {
  showModal: boolean;
  handleClose: any;
  handleSubmit: Function;
  imageBase64: any;
  outputWidth?: number;
  imageAspect?: number;
  onePreview?: boolean;
  previewStyle?: any;
}

export interface IAvatarCropModalState {
  avatarBase64: any;
  crop: any;
  image: any;
}

class AvatarCropModal extends React.Component<IAvatarCropModalProps> {
  state = {
    image: null,
    avatarBase64: null,
    crop: {
      aspect: this.props.imageAspect ? this.props.imageAspect : AVATAR_ASPECT
    }
  };

  handleSubmit = evt => {
    const { handleSubmit } = this.props;
    handleSubmit(this.state.avatarBase64);
  };

  onCropChange = crop => {
    this.setState({
      crop
    });
  };

  onCropComplete = async crop => {
    const outputWidth = this.props.outputWidth ? this.props.outputWidth : MAX_OUTPUT_WIDTH;
    this.setState({
      avatarBase64: await getCroppedImg(this.state.image, crop, outputWidth)
    });
  };

  onImageLoaded = img => {
    const imageAspect = this.props.imageAspect ? this.props.imageAspect : AVATAR_ASPECT;
    const width = img.width / imageAspect < img.height * imageAspect ? img.width : img.height * imageAspect;
    const height = img.width / imageAspect > img.height * imageAspect ? img.height : img.width / imageAspect;
    const x = (img.width - width) / 2;
    const y = (img.height - height) / 2;
    const crop = { aspect: imageAspect, width, height, x, y };
    this.setState(
      {
        image: img,
        crop
      },
      () => {
        this.onCropComplete(crop);
      }
    );
    return false;
  };

  render() {
    const { showModal, handleClose, imageBase64, onePreview } = this.props;
    const { avatarBase64, crop } = this.state;
    const previewStyle = this.props.previewStyle ? this.props.previewStyle : 'avatar-big d-inline mr-2';
    return (
      <Modal isOpen={showModal} toggle={handleClose} backdrop="static" id="dismiss-page" autoFocus={false}>
        <AvForm>
          <ModalHeader id="dismiss-title" toggle={handleClose}>
            <Translate contentKey="userManagement.avatar.modalTitle" />
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md={12}>
                {imageBase64 && (
                  <ReactCrop
                    src={imageBase64}
                    crop={crop}
                    onImageLoaded={this.onImageLoaded}
                    onChange={this.onCropChange}
                    onComplete={this.onCropComplete}
                    ruleOfThirds
                  />
                )}
                <div className="mt-3 mb-2">
                  <Translate contentKey="userManagement.avatar.preview" />
                </div>
                <div className="mb-1">
                  {avatarBase64 && <img alt="Avatar big preview" className={previewStyle} src={avatarBase64} />}
                  {avatarBase64 && !onePreview && <img alt="Avatar small preview" className="avatar-small d-inline" src={avatarBase64} />}
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
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
}

export default AvatarCropModal;
