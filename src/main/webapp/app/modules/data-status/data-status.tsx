import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';

export interface IFeedbackProp extends StateProps, DispatchProps {}

export interface IFeedbackState {}

export class DataStatus extends React.Component<IFeedbackProp, IFeedbackState> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row className="justify-content-center">
        <Col md="6">
          <h3>
            <Translate contentKey="serviceNetApp.feedback.feedback" />
          </h3>
        </Col>
      </Row>
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
)(DataStatus);
