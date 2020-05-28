import React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { getDeactivatedProviderRecords, reactivateRecord } from './deactivated-records.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';

export interface IDeactivatedRecordsProps extends StateProps, DispatchProps {}

export class DeactivatedRecords extends React.Component<IDeactivatedRecordsProps> {
  componentDidMount() {
    this.props.getDeactivatedProviderRecords();
  }

  reactivateRecord = id => {
    this.props.reactivateRecord(id);
  };

  render() {
    const { deactivatedRecords } = this.props;
    return (
      <div className="px-1 px-lg-5">
        <Table size="sm">
          <thead>
            <tr>
              <th>
                <Translate contentKey="providerSite.deactivatedRecords.name">Name</Translate>
              </th>
              <th>
                <Translate contentKey="providerSite.deactivatedRecords.lastUpdated">Last Updated</Translate>
              </th>
              <th>
                <Translate contentKey="providerSite.deactivatedRecords.deactivatedDate">Deactivated Date</Translate>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {deactivatedRecords &&
              deactivatedRecords.map((record, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <div>{record.name}</div>
                  </td>
                  <td>
                    <div>
                      <TextFormat value={record.updatedAt} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                    </div>
                  </td>
                  <td>
                    <div>
                      <TextFormat value={record.deactivatedAt} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                    </div>
                  </td>
                  <td>
                    <Button color="success" onClick={() => this.reactivateRecord(record.id)}>
                      <Translate contentKey="providerSite.deactivatedRecords.activate" />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  deactivatedRecords: state.deactivatedRecords.deactivatedRecords
});

const mapDispatchToProps = {
  getDeactivatedProviderRecords,
  reactivateRecord
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeactivatedRecords);
