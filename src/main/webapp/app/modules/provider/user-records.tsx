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
import RecordCard from 'app/modules/provider/record/record-card';
import { connect } from 'react-redux';
import { getProviderRecords } from './provider-record.reducer';
import { Card, CardBody, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';

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
      adaptiveHeight: true,
      appendDots: this.addCustomDots,
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
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: false
          }
        }
      ]
    };

    return (
      <Slider ref={c => (this.slider = c)} {...settings}>
        <Card className="record-card new-record mx-3 mb-4">
          <CardBody>
            <div>
              <h1>
                <Translate contentKey="record.newCard.title" />
              </h1>
              <Link to={`/record-create`} className="alert-link">
                <Button>
                  <Translate contentKey="record.newCard.buttonLabel" />
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
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
