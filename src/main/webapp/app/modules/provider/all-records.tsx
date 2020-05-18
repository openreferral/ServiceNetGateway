import React from 'react';
import { getAllProviderRecords } from './provider-record.reducer';
import { connect } from 'react-redux';
import { Col, Row, Progress } from 'reactstrap';
import _ from 'lodash';
import RecordCard from 'app/modules/provider/record/record-card';
import './provider-home.scss';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IAllRecordsProps extends StateProps, DispatchProps {}

export interface IAllRecordsState {
  itemsPerPage: number;
  activePage: number;
}

export class AllRecords extends React.Component<IAllRecordsProps, IAllRecordsState> {
  constructor(props) {
    super(props);
    this.state = {
      itemsPerPage: 6,
      activePage: 0
    };
  }

  componentDidMount() {
    const { itemsPerPage } = this.state;
    this.props.getAllProviderRecords(0, itemsPerPage, true);
  }

  getAllRecords = () => {
    const { itemsPerPage, activePage } = this.state;
    this.props.getAllProviderRecords(activePage, itemsPerPage, false);
  };

  handleLoadMore = hasReachedMaxItems => {
    if (!hasReachedMaxItems) {
      this.setState({ activePage: this.state.activePage + 1 }, () => this.getAllRecords());
    }
  };

  render() {
    const { allRecords, allRecordsTotal } = this.props;
    const hasReachedMaxItems = allRecords.length === parseInt(allRecordsTotal, 10);
    return (
      <div>
        <div className="control-line-container">
          <div className="d-flex justify-content-between">
            <b className="align-self-center">
              <Translate contentKey="providerSite.allRecords" />
            </b>
            <div className="d-flex">
              <div className="align-self-center ml-4">{allRecords && allRecords.length}</div>
              <div className="mx-2 align-self-center">
                <Progress value={((allRecords && allRecords.length) / allRecordsTotal) * 100} />
              </div>
              <div className="align-self-center">{allRecordsTotal}</div>
            </div>
          </div>
          <div className="sort-container">
            <div className="pill">
              <Translate contentKey="providerSite.sort" />
            </div>
            <div className="pill">
              <span>
                <FontAwesomeIcon icon="th" />
                {' | '}
                <FontAwesomeIcon icon="bars" />
              </span>
            </div>
            <div className="pill">
              <Translate contentKey="providerSite.filter" />
            </div>
          </div>
        </div>
        <Row noGutters>
          {_.map(allRecords, record => (
            <Col md={4}>
              <div className="mb-4">
                <RecordCard key={record.organization.id} record={record} />
              </div>
            </Col>
          ))}
          <Col />
        </Row>
        <div className="pill mb-4 text-center">
          <div
            className={`d-inline button-pill ${hasReachedMaxItems ? 'disabled' : ''}`}
            onClick={() => this.handleLoadMore(hasReachedMaxItems)}
          >
            <Translate contentKey="providerSite.loadMore" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allRecords: state.providerRecord.allRecords,
  allRecordsTotal: state.providerRecord.allRecordsTotal
});

const mapDispatchToProps = {
  getAllProviderRecords
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllRecords);
