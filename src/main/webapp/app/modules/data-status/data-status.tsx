import './data-status.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import { getPaginationItemsNumber, getSortState, IPaginationBaseState, JhiPagination, TextFormat, Translate } from 'react-jhipster';
import { fetchDataStatus } from './data-status.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';
import PageSizeSelector from 'app/entities/page-size-selector';
import { FIRST_PAGE, MAX_BUTTONS } from 'app/shared/util/pagination.constants';

export interface IDataStatusProp extends StateProps, DispatchProps {}

export interface IDataStatusState extends IPaginationBaseState {
  dropdownOpenTop: boolean;
  dropdownOpenBottom: boolean;
  itemsPerPage: number;
}

const ITEMS_PER_PAGE = 10;

export class DataStatus extends React.Component<IDataStatusProp, IDataStatusState> {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpenTop: false,
      dropdownOpenBottom: false,
      itemsPerPage: ITEMS_PER_PAGE,
      ...getSortState(this.props.dataStatus, ITEMS_PER_PAGE)
    };
  }

  componentDidMount() {
    this.props.fetchDataStatus(0, this.state.itemsPerPage);
  }

  toggleTop = () => this.setState({ dropdownOpenTop: !this.state.dropdownOpenTop });

  select = prop => () => {
    this.setState(
      {
        itemsPerPage: prop,
        activePage: FIRST_PAGE
      },
      () => this.updatePage()
    );
  };

  handlePagination = activePage => this.setState({ activePage }, () => this.updatePage());

  updatePage() {
    window.scrollTo(0, 0);
    const { activePage, itemsPerPage } = this.state;
    this.props.fetchDataStatus(activePage - 1, itemsPerPage);
  }

  render() {
    const { dataStatus, totalItems } = this.props;
    const { dropdownOpenTop, itemsPerPage, activePage } = this.state;
    return (
      <Row className="justify-content-center">
        <Col md="6">
          <h3>
            <Translate contentKey="global.menu.dataStatus" />
          </h3>

          <Card>
            <CardBody className="centered-flex">
              <PageSizeSelector
                className="paging"
                dropdownOpen={dropdownOpenTop}
                toggleSelect={this.toggleTop}
                itemsPerPage={itemsPerPage}
                selectFunc={this.select}
              />
              <JhiPagination
                items={getPaginationItemsNumber(totalItems, itemsPerPage)}
                activePage={activePage}
                onSelect={this.handlePagination}
                maxButtons={MAX_BUTTONS}
              />
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
  dataStatus: state.dataStatus.dataStatus,
  totalItems: state.dataStatus.totalItems
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
