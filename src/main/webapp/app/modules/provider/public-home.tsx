import React from 'react';
import { connect } from 'react-redux';
import AllRecords from 'app/modules/provider/all-records';

export interface IPublicHomeProps extends StateProps, DispatchProps {
  siloName: string;
  urlBase: string;
}

class PublicHome extends React.Component<IPublicHomeProps> {
  render() {
    const { urlBase, siloName } = this.props;
    return (
      <div className="all-records-container-public">
        <AllRecords urlBase={urlBase} siloName={siloName} />
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
