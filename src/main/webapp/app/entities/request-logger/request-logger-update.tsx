import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './request-logger.reducer';
import { IRequestLogger } from 'app/shared/model/request-logger.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IRequestLoggerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IRequestLoggerUpdateState {
  isNew: boolean;
}

export class RequestLoggerUpdate extends React.Component<IRequestLoggerUpdateProps, IRequestLoggerUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { requestLoggerEntity } = this.props;
      const entity = {
        ...requestLoggerEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/request-logger');
  };

  render() {
    const { requestLoggerEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    const { requestParameters, requestBody, requestMethod, responseBody } = requestLoggerEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="serviceNetGatewayApp.serviceNetRequestLogger.home.createOrEditLabel">Create or edit a RequestLogger</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : requestLoggerEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="request-logger-id">ID</Label>
                    <AvInput id="request-logger-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="remoteAddrLabel" for="request-logger-remoteAddr">
                    Remote Address
                  </Label>
                  <AvField id="request-logger-remoteAddr" type="text" name="remoteAddr" />
                </AvGroup>
                <AvGroup>
                  <Label id="requestUriLabel" for="request-logger-requestUri">
                    Request URI
                  </Label>
                  <AvField id="request-logger-requestUri" type="text" name="requestUri" />
                </AvGroup>
                <AvGroup>
                  <Label id="requestMethodLabel" for="request-logger-requestMethod">
                    Request Method
                  </Label>
                  <AvInput id="request-logger-requestMethod" type="textarea" name="requestMethod" />
                </AvGroup>
                <AvGroup>
                  <Label id="requestParametersLabel" for="request-logger-requestParameters">
                    Request Parameters
                  </Label>
                  <AvInput id="request-logger-requestParameters" type="textarea" name="requestParameters" />
                </AvGroup>
                <AvGroup>
                  <Label id="requestBodyLabel" for="request-logger-requestBody">
                    Request Body
                  </Label>
                  <AvInput id="request-logger-requestBody" type="textarea" name="requestBody" />
                </AvGroup>
                <AvGroup>
                  <Label id="responseStatusLabel" for="request-logger-responseStatus">
                    Response Status
                  </Label>
                  <AvField id="request-logger-responseStatus" type="text" name="responseStatus" />
                </AvGroup>
                <AvGroup>
                  <Label id="responseBodyLabel" for="request-logger-responseBody">
                    Response Body
                  </Label>
                  <AvInput id="request-logger-responseBody" type="textarea" name="responseBody" />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/request-logger" replace color="info">
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
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  requestLoggerEntity: storeState.requestLogger.entity,
  loading: storeState.requestLogger.loading,
  updating: storeState.requestLogger.updating,
  updateSuccess: storeState.requestLogger.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestLoggerUpdate);
