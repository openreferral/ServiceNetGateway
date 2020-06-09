import React from 'react';
import { Translate } from 'react-jhipster';
import { Card, Row, CardTitle, CardText, Col } from 'reactstrap';

const NotConfiguredAccount = () => (
  <Row className="justify-content-center m-5 p-5">
    <Col sm="6">
      <Card body>
        <CardTitle>
          <b>
            <Translate contentKey="providerSite.alert" />
          </b>
        </CardTitle>
        <CardText>
          <Translate contentKey="providerSite.appNotConfiguredMessage" />
        </CardText>
      </Card>
    </Col>
  </Row>
);

export default NotConfiguredAccount;
