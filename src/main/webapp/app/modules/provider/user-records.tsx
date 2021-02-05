import './provider-shared.scss';
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MagicSliderDots from 'react-magic-slider-dots';
// tslint:disable-next-line:no-submodule-imports
import 'react-magic-slider-dots/dist/magic-dots.css';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RecordCard from 'app/modules/provider/record/record-card';
import { connect } from 'react-redux';
import { getProviderRecords } from './provider-record.reducer';
import { Card, CardBody, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import ButtonPill from 'app/modules/provider/shared/button-pill';
import RecordUpdatesModal from 'app/modules/provider/record-updates-modal';

export interface IUserRecordsProps extends StateProps, DispatchProps {}

const SLIDES_TO_SHOW = 3;
const PAGE_SIZE = SLIDES_TO_SHOW * 2;

interface IUserRecordsState {
  index: number;
  updatesModalOpen: boolean;
  updatesModalOrgId: string;
}

export class UserRecords extends React.Component<IUserRecordsProps, IUserRecordsState> {
  state = {
    index: 0,
    updatesModalOpen: false,
    updatesModalOrgId: ''
  };
  slider: any;
  constructor(props) {
    super(props);
    this.slider = React.createRef();
  }

  componentDidMount() {
    this.props.getProviderRecords(0, PAGE_SIZE);
    if (this.props.currentUser) {
      this.openRecord();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.claimSuccess && this.props.claimSuccess) {
      this.props.getProviderRecords(0, PAGE_SIZE);
    }
    if (prevProps.currentUser !== this.props.currentUser) {
      this.openRecord();
    }
  }

  openRecord = (delta = 0) => {
    const { organizationsWithUpdates } = this.props.currentUser;
    const { updatesModalOrgId } = this.state;
    if (organizationsWithUpdates != null && organizationsWithUpdates.length > 0) {
      let idx = 0;
      if (!!updatesModalOrgId) {
        // find the index of currently opened record + delta
        idx = organizationsWithUpdates.findIndex(org => org.id === updatesModalOrgId) + delta;
        if (idx >= organizationsWithUpdates.length) {
          // out of boundaries, open the first record
          idx = 0;
        } else if (idx < 0) {
          // open last record
          idx = organizationsWithUpdates.length - 1;
        }
      }
      this.setState({
        updatesModalOrgId: organizationsWithUpdates[idx],
        updatesModalOpen: true
      });
    } else {
      this.setState({
        updatesModalOpen: false,
        updatesModalOrgId: ''
      });
    }
  };

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  addCustomDots = dots => (
    <div>
      <div className="pagination-container">
        <div onClick={() => this.previous()}>
          <FontAwesomeIcon size="lg" icon="chevron-left" />
        </div>
        <MagicSliderDots dots={dots} numDotsToShow={5} dotWidth={30} />
        <div onClick={() => this.next()}>
          <FontAwesomeIcon size="lg" icon="chevron-right" />
        </div>
      </div>
    </div>
  );

  recordCard(index) {
    const { records } = this.props;
    const record = records[index];
    return (
      <RecordCard
        withOnlineServiceLabel
        key={index}
        record={record}
        link={record ? `record/${record.organization.id}/edit` : ''}
        owner={this.props.currentUser}
        referring={false}
      />
    );
  }

  beforeIndexChange = (oldIndex, newIndex) => {
    const { records, recordsTotal } = this.props;
    const firstIdx = newIndex - 1;
    const missingIndexes = Array.from(Array(SLIDES_TO_SHOW).keys())
      .map(i => firstIdx + i)
      .filter(index => index > 0 && index < recordsTotal && !records[index]);
    const pagesToLoad = _.sortedUniq(missingIndexes.map(index => (index / PAGE_SIZE) | 0));
    for (const page of pagesToLoad) {
      this.props.getProviderRecords(page, PAGE_SIZE);
    }
  };

  toggleUpdatesModalOpen = () => {
    this.setState({
      updatesModalOpen: !this.state.updatesModalOpen
    });
  };

  render() {
    const { recordsTotal } = this.props;
    const { updatesModalOpen, updatesModalOrgId } = this.state;
    const settings = {
      className: 'center',
      dots: true,
      arrows: false,
      speed: 500,
      slidesToShow: SLIDES_TO_SHOW,
      slidesToScroll: SLIDES_TO_SHOW,
      infinite: true,
      initialSlide: 0,
      adaptiveHeight: true,
      appendDots: this.addCustomDots,
      beforeChange: this.beforeIndexChange,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            centerMode: false
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: false
          }
        }
      ]
    };
    return (
      <>
        <RecordUpdatesModal
          orgId={updatesModalOrgId}
          modalOpen={updatesModalOpen}
          toggleModalOpen={this.toggleUpdatesModalOpen}
          openRecord={this.openRecord}
        />
        <Slider ref={c => (this.slider = c)} {...settings}>
          <Card className="record-card new-record mx-3 mb-4">
            <CardBody>
              <div className="d-flex flex-column align-items-center">
                <h1>
                  <Translate contentKey="record.newCard.title" />
                </h1>
                <ButtonPill className="button-pill-new-record d-flex align-items-center p-0">
                  <Link to={`/record-create`} className="alert-link w-100 h-100 d-flex align-items-center" style={{ color: 'white' }}>
                    <Translate contentKey="record.newCard.buttonLabel" />
                  </Link>
                </ButtonPill>
              </div>
            </CardBody>
          </Card>
          {_.map(Array.from(Array(recordsTotal).keys()), index => this.recordCard(index))}
        </Slider>
      </>
    );
  }
}

const mapStateToProps = state => ({
  records: state.providerRecord.recordsByIndex,
  recordsTotal: state.providerRecord.recordsTotal,
  currentUser: state.authentication.account,
  claimSuccess: state.organization.claimSuccess
});

const mapDispatchToProps = {
  getProviderRecords
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRecords);
