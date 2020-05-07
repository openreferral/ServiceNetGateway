import './provider-home.scss';
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MagicSliderDots from 'react-magic-slider-dots';
// tslint:disable-next-line:no-submodule-imports
import 'react-magic-slider-dots/dist/magic-dots.css';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RecordCard from 'app/modules/home/record-card';
import { connect } from 'react-redux';
import { getProviderRecords } from './provider-record.reducer';

export interface IUserRecordsProps extends StateProps, DispatchProps {}

export class UserRecords extends React.Component<IUserRecordsProps> {
  slider: any;
  constructor(props) {
    super(props);
    this.slider = React.createRef();
  }

  componentDidMount() {
    this.props.getProviderRecords();
  }

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

  render() {
    const { records } = this.props;
    const settings = {
      className: 'center',
      dots: true,
      arrows: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      infinite: true,
      initialSlide: 0,
      adaptiveHeight: false,
      appendDots: this.addCustomDots,
      responsive: [
        {
          breakpoint: 2048,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            centerMode: true,

            initialSlide: 1
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

    return (
      <Slider ref={c => (this.slider = c)} {...settings}>
        {_.map(records, record => (
          <RecordCard key={record.organization.id} record={record} />
        ))}
      </Slider>
    );
  }
}

const mapStateToProps = state => ({
  records: state.providerRecord.records
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
