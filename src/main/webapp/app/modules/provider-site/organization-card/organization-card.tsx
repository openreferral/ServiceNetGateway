import './organization-card.scss';
import React from 'react';
import { Card, CardBody } from 'reactstrap';

export interface IOrganizationCard {
  item?: any;
}

export const OrganizationCart: React.FC<IOrganizationCard> = props => (
  <Card className="organization-card">
    <CardBody className="centered-flex">
      <div>{`Placeholder ${props.item}`}</div>
    </CardBody>
  </Card>
);
