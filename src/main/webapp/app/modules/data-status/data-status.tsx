import './data-status.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import { TextFormat, Translate, translate } from 'react-jhipster';
import { fetchDataStatus } from './data-status.reducer';
import { Link } from 'react-router-dom';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IDataStatusProp extends StateProps, DispatchProps {}

// export interface IDataStatusState {}

export class DataStatus extends React.Component<IDataStatusProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchDataStatus(0);
  }

  render() {
    const { dataStatus } = this.props;
    console.log('AAAAAAAAAAAAAA');
    console.log(dataStatus);
    return (
      <Row className="justify-content-center">
        <Col md="6">
          <h3>
            <Translate contentKey="global.menu.dataStatus" />
          </h3>
          <Card>
            <CardBody className="centered-flex">
              <div className="table-responsive">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>
                        <Translate contentKey="serviceNetApp.dataStatus.providerName">Provider Name</Translate>
                      </th>
                      <th>
                        <Translate contentKey="serviceNetApp.dataStatus.dateUploaded">Date Uploaded</Translate>
                      </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {dataStatus.map((status, i) => (
                      <tr key={`entity-${i}`}>
                        <td>{status.providerName}</td>
                        <td>
                          <TextFormat type="date" value={status.lastUpdateDateTime} format={APP_DATE_FORMAT} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  dataStatus: state.dataStatus.dataStatus
});

const mapDispatchToProps = {
  fetchDataStatus
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataStatus);
