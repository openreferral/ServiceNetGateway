import React from 'react';
import { connect } from 'react-redux';
import AllRecords from 'app/modules/provider/all-records';
import { isIOS } from 'react-device-detect';
import SingleRecordView from 'app/modules/provider/record/single-record-view';
import { IRootState } from 'app/shared/reducers';
import { toggleSingleRecordView } from 'app/modules/provider/provider-record.reducer';
import { getSiloByNameOrId } from 'app/entities/silo/silo.reducer';

export interface IPublicHomeProps extends StateProps, DispatchProps {
  siloName: string;
  urlBase: string;
}

export interface IPublicHomeState {
  isMapView: boolean;
}

class PublicHome extends React.Component<IPublicHomeProps, IPublicHomeState> {
  state = {
    isMapView: false
  };

  componentDidMount(): void {
    this.props.getSiloByNameOrId(this.props.siloName);
    this.props.toggleSingleRecordView({ orgId: null, singleRecordViewActive: false });
  }

  toggleMapView = () =>
    this.setState({
      isMapView: !this.state.isMapView
    });

  render() {
    const { urlBase, siloName, singleRecordViewActive, recordToOpen } = this.props;
    const { isMapView } = this.state;
    return (
      <>
        {singleRecordViewActive ? <SingleRecordView orgId={recordToOpen} withBackButton /> : null}
        <div
          id="home-container"
          className={`background-public${isIOS ? ' iOS' : ''} ${singleRecordViewActive ? 'd-none' : ''} overflowYAuto`}
        >
          <div className={`all-records-container-public${isMapView ? ' map' : ''}`}>
            <AllRecords urlBase={urlBase} siloName={siloName} toggleMapView={this.toggleMapView} isMapView={isMapView} referring={false} />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ providerRecord }: IRootState) => ({
  recordToOpen: providerRecord.orgId,
  singleRecordViewActive: providerRecord.singleRecordViewActive
});

const mapDispatchToProps = { toggleSingleRecordView, getSiloByNameOrId };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicHome);
