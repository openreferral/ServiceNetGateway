import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './request-logger.reducer';
import { IRequestLogger } from 'app/shared/model/request-logger.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRequestLoggerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class RequestLoggerDetail extends React.Component<IRequestLoggerDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { requestLoggerEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            RequestLogger [<b>{requestLoggerEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="remoteAddr">Remote Address</span>
            </dt>
            <dd>{requestLoggerEntity.remoteAddr}</dd>
            <dt>
              <span id="requestUri">Request URI</span>
            </dt>
            <dd>{requestLoggerEntity.requestUri}</dd>
            <dt>
              <span id="requestMethod">Request Method</span>
            </dt>
            <dd>{requestLoggerEntity.requestMethod}</dd>
            <dt>
              <span id="requestParameters">Request Parameters</span>
            </dt>
            <dd>{requestLoggerEntity.requestParameters}</dd>
            <dt>
              <span id="requestBody">Request Body</span>
            </dt>
            <dd>{requestLoggerEntity.requestBody}</dd>
            <dt>
              <span id="responseStatus">Response Status</span>
            </dt>
            <dd>{requestLoggerEntity.responseStatus}</dd>
            <dt>
              <span id="responseBody">Response Body</span>
            </dt>
            <dd>{requestLoggerEntity.responseBody}</dd>
          </dl>
          <Button tag={Link} to="/entity/request-logger" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/request-logger/${requestLoggerEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ requestLogger }: IRootState) => ({
  requestLoggerEntity: requestLogger.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestLoggerDetail);
