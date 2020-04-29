import './record-card.scss';

import React from 'react';
import { TextFormat, Translate } from 'react-jhipster';
import { IActivityRecord } from 'app/shared/model/activity-record.model';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid, faCircle } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { measureWidths, getColumnCount, containerStyle } from 'app/shared/util/measure-widths';
import { connect } from 'react-redux';
import { getUser } from 'app/modules/administration/user-management/user-management.reducer';
import { IRootState } from 'app/shared/reducers';

const REMAINDER_WIDTH = 25;

export interface IRecordCardProps extends StateProps, DispatchProps {
  record: IActivityRecord;
}

export interface IRecordCardState {
  serviceWidths: any[];
  locationWidths: any[];
}

const ServiceColumn = service => (
  <div className="pill">
    <span>{service.service.name}</span>
  </div>
);

const LocationColumn = location => (
  <div className="location">
    <span>
      <FontAwesomeIcon icon={faCircle} className="blue" /> {location.location.name}
    </span>
  </div>
);

const RemainderCount = count => <span className="remainder blue">+ {count}</span>;

const measureId = orgId => 'measure-' + orgId;

class RecordCard extends React.Component<IRecordCardProps, IRecordCardState> {
  state: IRecordCardState = {
    serviceWidths: [],
    locationWidths: []
  };

  componentDidMount() {
    if (!this.props.loadingUser && !this.props.user.id) {
      this.props.getUser(this.props.account.login);
    }
    const record = this.props.record;
    measureWidths(
      [...record.services.map(item => ServiceColumn(item)), ...record.locations.map(item => LocationColumn(item))],
      measureId(record.organization.id)
    ).then((serviceAndLocationWidths: any[]) => {
      this.setState({
        serviceWidths: serviceAndLocationWidths.slice(0, record.services.length),
        locationWidths: serviceAndLocationWidths.slice(record.services.length)
      });
    });
  }

  render() {
    const { record, user } = this.props;
    return (
      <Card className="record-card">
        <CardTitle>
          <div className="bookmark">
            {record.organization.accountId === user.systemAccountId ? (
              <FontAwesomeIcon icon={faBookmarkSolid} size={'lg'} />
            ) : (
              <FontAwesomeIcon icon={faBookmark} size={'lg'} />
            )}
          </div>
          <div className="last-update">
            <div>
              <Translate contentKey="recordCard.lastUpdate" />
              {record.lastUpdated ? (
                <TextFormat value={record.lastUpdated} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
              ) : (
                <Translate contentKey="recordCard.unknown" />
              )}
            </div>
            <div className="updated-by">
              <Translate contentKey="recordCard.by" /> {record.organization.accountName}
            </div>
          </div>
        </CardTitle>
        <CardBody>
          <div id={measureId(record.organization.id)} style={containerStyle} />
          <div className="organization-name">{record.organization.name}</div>
          <section className="services">
            {record.services.length > 0 ? (
              <AutoSizer disableHeight>
                {({ width }) => {
                  const itemCount = getColumnCount(this.state.serviceWidths, width, REMAINDER_WIDTH);
                  const overflow = itemCount < record.services.length;
                  const totalItemCount = itemCount + (overflow ? 1 : 0);
                  return (
                    <List
                      height={50}
                      itemCount={totalItemCount}
                      itemSize={width / totalItemCount}
                      layout="horizontal"
                      width={width}
                      style={{ flex: 1, class: 'pills' }}
                    >
                      {({ index }) =>
                        index === itemCount ? RemainderCount(record.services.length - itemCount) : ServiceColumn(record.services[index])
                      }
                    </List>
                  );
                }}
              </AutoSizer>
            ) : null}
          </section>
          <section className="locations">
            {record.locations.length > 0 ? (
              <AutoSizer disableHeight>
                {({ width }) => {
                  const itemCount = getColumnCount(this.state.locationWidths, width, REMAINDER_WIDTH);
                  const overflow = itemCount < record.locations.length;
                  const totalItemCount = itemCount + (overflow ? 1 : 0);
                  return (
                    <List
                      height={50}
                      itemCount={totalItemCount}
                      itemSize={width / totalItemCount}
                      layout="horizontal"
                      width={width}
                      style={{ flex: 1 }}
                    >
                      {({ index }) =>
                        index === itemCount ? RemainderCount(record.locations.length - itemCount) : LocationColumn(record.locations[index])
                      }
                    </List>
                  );
                }}
              </AutoSizer>
            ) : null}
          </section>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = (rootState: IRootState) => ({
  user: rootState.userManagement.user,
  loadingUser: rootState.userManagement.loading,
  account: rootState.authentication.account
});

const mapDispatchToProps = { getUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordCard);
