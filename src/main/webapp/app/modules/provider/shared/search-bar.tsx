import React from 'react';
import '../provider-shared.scss';
import './search-bar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';

export interface ISearchBarProp extends StateProps, DispatchProps {
  onSwitchFocus?: any;
  onSearch: any;
  onReset: any;
  width?: string;
}

export interface ISearchBarState {
  text: string;
}

export class SearchBar extends React.Component<ISearchBarProp, ISearchBarState> {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  componentDidMount() {
    this.props.onReset();
  }

  updateText = event => {
    this.setState({
      text: event.target.value
    });
  };

  search = event => {
    if (event !== null) {
      event.preventDefault();
    }
    this.props.onSearch(this.state.text);
  };

  reset = () => {
    this.setState({
      text: ''
    });
    this.props.onReset();
  };

  onFocus = e => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      if (this.props.onSwitchFocus) {
        this.props.onSwitchFocus(true);
      }
    }
  };

  onBlur = e => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      if (this.props.onSwitchFocus) {
        this.props.onSwitchFocus(false);
      }
    }
  };

  render() {
    const { width } = this.props;
    return (
      <div className="search-bar">
        <form className="search-from" style={{ width: width ? width : null }} onSubmit={this.search}>
          <div className="search-button">
            <span className="search-button search-icon" onClick={this.search}>
              <FontAwesomeIcon className="self-align-center" size="xs" icon="search" />
            </span>
          </div>
          <div className="search-input-container">
            <input
              id="search"
              className="search-input"
              type="search"
              value={this.state.text}
              placeholder={translate('providerSite.searchPlaceholder')}
              onChange={this.updateText}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
            <label className="sr-only" htmlFor="search">
              {translate('providerSite.searchPlaceholder')}
            </label>
          </div>
          <div className="search-button">
            <span className="search-button search-icon" onClick={this.reset}>
              <FontAwesomeIcon className="self-align-center" size="xs" icon="times" />
            </span>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(SearchBar);
