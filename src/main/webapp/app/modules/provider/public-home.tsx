import React from 'react';
import { connect } from 'react-redux';
import AllRecords from 'app/modules/provider/all-records';

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

  toggleMapView = () =>
    this.setState({
      isMapView: !this.state.isMapView
    });

  render() {
    const { urlBase, siloName } = this.props;
    const { isMapView } = this.state;
    return (
      <div className="background-public">
        <div className={`all-records-container-public${isMapView ? ' map' : ''}`}>
          <AllRecords urlBase={urlBase} siloName={siloName} toggleMapView={this.toggleMapView} isMapView={isMapView} referring={false} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicHome);
