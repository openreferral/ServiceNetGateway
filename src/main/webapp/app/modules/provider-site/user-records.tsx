import './provider-site.scss';
import React, { Component } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MagicSliderDots from 'react-magic-slider-dots';
// tslint:disable-next-line:no-submodule-imports
import 'react-magic-slider-dots/dist/magic-dots.css';
import _ from 'lodash';
import { OrganizationCart } from 'app/modules/provider-site/organization-card/organization-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class UserRecords extends Component {
  slider: any;
  constructor(props) {
    super(props);
    this.slider = React.createRef();
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
          breakpoint: 2048,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            centerMode: true,
            centerPadding: '60px',
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
        {_.map(Array.from(Array(15).keys()), item => (
          <OrganizationCart item={item} />
        ))}
      </Slider>
    );
  }
}
