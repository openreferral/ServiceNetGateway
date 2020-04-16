import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getClient } from './client-management.reducer';
import { IRootState } from 'app/shared/reducers';

export interface IClientManagementDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ clientId: string }> {}

export class ClientManagementDetail extends React.Component<IClientManagementDetailProps> {
  componentDidMount() {
    this.props.getClient(this.props.match.params.clientId);
  }

  render() {
    const { client } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="clientManagement.detail.title">Client</Translate> [<b>{client.clientId}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <Translate contentKey="clientManagement.clientId">clientId</Translate>
          </dt>
          <dd>
            <span>{client.clientId}</span>
          </dd>
          <dt>
            <Translate contentKey="clientManagement.tokenValiditySeconds">Token validity seconds</Translate>
          </dt>
          <dd>{client.tokenValiditySeconds}</dd>
        </dl>
        <Button tag={Link} to="/admin/client-management" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  client: storeState.clientManagement.client
});

const mapDispatchToProps = { getClient };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientManagementDetail);
