import './hide-record-button.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'reactstrap';

interface IHideRecordButtonState {
  tooltipOpen: boolean;
}

interface IHideRecordButtonProps {
  handleHide: Function;
  id: string;
}

class HideRecordButton extends React.Component<IHideRecordButtonProps, IHideRecordButtonState> {
  state: IHideRecordButtonState = {
    tooltipOpen: false
  };
  private ref = React.createRef() as React.LegacyRef<HTMLDivElement>;

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  handleClick = event => {
    this.props.handleHide(event);
  };

  render() {
    return (
      <div className="hide-record-button">
        <div onClick={this.handleClick} className="close-icon" id={this.props.id} ref={this.ref}>
          <FontAwesomeIcon icon="times" />
        </div>
        <Tooltip
          placement="bottom"
          innerClassName="tooltip-clip-inner"
          className="tooltip-clip"
          isOpen={this.state.tooltipOpen}
          target={this.ref}
          toggle={this.toggle}
          autohide
        >
          <Translate contentKey="serviceNetApp.activity.hideRecord" />
        </Tooltip>
      </div>
    );
  }
}

export default HideRecordButton;
