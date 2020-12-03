import { Avatar } from 'app/shared/layout/header/avatar';
import { Translate, translate } from 'react-jhipster';
import UserRecords from 'app/modules/provider/user-records';
import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';
import AllRecords from './all-records';
import { cleanReferredRecords } from './provider-record.reducer';

export interface IHomeProps extends StateProps, DispatchProps {}

export interface IHomeState {
  isMapView: boolean;
}

export class Home extends React.Component<IHomeProps, IHomeState> {
  state = {
    isMapView: false
  };
  componentDidMount() {
    const { previousUserName, userName } = this.props;
    const hasUserChanged = previousUserName !== userName;
    if (hasUserChanged) {
      this.props.cleanReferredRecords();
    }
    this.props.getSession();
  }

  toggleMapView = () =>
    this.setState({
      isMapView: !this.state.isMapView
    });

  header = (userLogin: string) => (
    <div>
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
  );

  render() {
    const { userLogin } = this.props;
    const { isMapView } = this.state;
    return (
      <div className="background">
        {!isMapView && this.header(userLogin)}
        {!isMapView && (
          <div className="user-cards-container">
            <UserRecords />
          </div>
        )}
        <div className={`all-records-container${isMapView ? ' map' : ''}`}>
          <AllRecords toggleMapView={this.toggleMapView} isMapView={isMapView} referring />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, providerRecord }: IRootState) => ({
  userLogin: authentication.account.login,
  userName: authentication.account.login,
  previousUserName: providerRecord.userName
});

const mapDispatchToProps = {
  getSession,
  cleanReferredRecords
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
