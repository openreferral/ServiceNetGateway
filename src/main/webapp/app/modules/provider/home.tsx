import { Avatar } from 'app/modules/provider/avatar';
import { Translate, translate } from 'react-jhipster';
import UserRecords from 'app/modules/provider/user-records';
import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';

export interface IHomeProps extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProps> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    const { userLogin } = this.props;
    return (
      <div className="background">
        <div>
          <div className="hero-image">
            <div className="hero-text">
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
        <div className="user-cards-container">
          <UserRecords />
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
