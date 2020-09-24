import { Avatar } from 'app/modules/provider/avatar';
import { Translate, translate } from 'react-jhipster';
import UserRecords from 'app/modules/provider/user-records';
import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';
import AllRecords from './all-records';

export interface IHomeProps extends StateProps, DispatchProps {}

export interface IHomeState {
  isMapView: boolean;
}

export class Home extends React.Component<IHomeProps, IHomeState> {
  state = {
    isMapView: false
  };
  componentDidMount() {
    this.props.getSession();
  }

  toggleMapView = () =>
    this.setState({
      isMapView: !this.state.isMapView
    });

  header = (userLogin: string) => <div>
    <div className="hero-image">
      <div className="hero-text py-2">
        <div className="hero-avatar">
          <Avatar size="big" name={`${userLogin && userLogin.charAt(0).toUpperCase()} `} />
        </div>
        <h5 className="hello-text">
          <b>{`${translate('providerSite.hello')}${userLogin}!`}</b>
        </h5>
        <h4 className="hello-text">
          <Translate contentKey="providerSite.anyUpdates" />
        </h4>
      </div>
    </div>
  </div>

  render() {
    const { userLogin } = this.props;
    const { isMapView } = this.state;
    return (
      <div className="background">
        {!isMapView && this.header(userLogin)}
        {!isMapView &&
          <div className="user-cards-container">
            <UserRecords/>
          </div>
        }
        <div className={`all-records-container${isMapView ? ' map' : ''}`}>
          <AllRecords toggleMapView={this.toggleMapView} isMapView={isMapView} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  userLogin: authentication.account.login
});

const mapDispatchToProps = {
  getSession
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
