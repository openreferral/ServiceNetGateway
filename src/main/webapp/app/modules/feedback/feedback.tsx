import { sendMail } from 'app/modules/feedback/feedback.reducer';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Form, Label, Input, FormGroup } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import ButtonPill from 'app/modules/provider/shared/button-pill';

export interface IFeedbackProp extends StateProps, DispatchProps {}

export interface IFeedbackState {
  message: string;
  emailAddress?: string;
}

export class Feedback extends React.Component<IFeedbackProp, IFeedbackState> {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      emailAddress: ''
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { message, emailAddress } = this.state;
    this.props.sendMail({ message, emailAddress }, () => {
      const { errorMessage } = this.props;
      if (errorMessage) {
        toast.error(translate('serviceNetApp.feedback.error'));
      } else {
        toast.success(translate('serviceNetApp.feedback.success'));
      }
    });
  };

  handleEmailChange = e => {
    this.setState({ emailAddress: e.target.value });
  };

  handleMessageChange = e => {
    this.setState({ message: e.target.value });
  };

  render() {
    return (
      <div className="m-3">
        <Row className="justify-content-center">
          <Col md="8">
            <h2>
              <Translate contentKey="serviceNetApp.feedback.feedback" />
            </h2>
            <hr
              style={{
                color: 'black',
                backgroundColor: 'black',
                height: 1
              }}
            />
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Input
                  type="textarea"
                  name="text"
                  id="message"
                  rows={10}
                  placeholder={translate('serviceNetApp.feedback.sendUsSuggestion')}
                  onChange={this.handleMessageChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">
                  <Translate contentKey="serviceNetApp.feedback.pleaseProvideEmail" />
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={translate('serviceNetApp.feedback.emailAddress')}
                  onChange={this.handleEmailChange}
                />
              </FormGroup>
              <ButtonPill className="button-pill-primary">
                <button type="submit">
                  <Translate contentKey="serviceNetApp.feedback.sendFeedback" />
                </button>
              </ButtonPill>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errorMessage: state.feedback.errorMessage
});

const mapDispatchToProps = {
  sendMail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feedback);
