import './refer-button.scss';

import React from 'react';
import { Col, Row } from 'reactstrap';
import { daysBetweenDates, getDateWithTime, getTimeString, getWeekday } from 'app/shared/util/date-utils';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import ButtonPill from '../shared/button-pill';
import _ from 'lodash';
import { translate } from 'react-jhipster';

export interface IOpeningHoursProp extends StateProps, DispatchProps {
  location: any;
  updateLocationData: any;
  openingHours: any;
  datesClosed: any;
  defaultOpeningHours?: any[];
}

const DAYS_IN_A_WEEK = 7;

export class OpeningHours extends React.Component<IOpeningHoursProp, {}> {
  state = {};

  componentDidMount() {
    this.parseLocation();
  }

  componentDidUpdate(prevProps: Readonly<IOpeningHoursProp>, prevState: Readonly<{}>, snapshot?: any) {
    if (prevProps.location !== this.props.location) {
      this.parseLocation();
    }
  }

  parseLocation = () => {
    this.props.updateLocationData(this.parseOpeningHours(this.props.location), this.parseDatesClosed(this.props.location));
  };

  removeDayFromOtherRows = (rowNumber, weekday) => {
    const { openingHours } = this.props;
    return openingHours.map((oh, i) => ({
      ...oh,
      activeDays: oh.activeDays ? oh.activeDays.filter(day => day !== weekday || i === rowNumber) : []
    }));
  };

  toggleDay = (rowNumber, weekdayNumber) => () => {
    const { datesClosed } = this.props;
    const openingHours = this.removeDayFromOtherRows(rowNumber, weekdayNumber);
    const row = openingHours[rowNumber] || {};
    row.activeDays = _.xor(row.activeDays || [], [weekdayNumber]);
    openingHours[rowNumber] = row;
    this.props.updateLocationData(openingHours, datesClosed);
  };

  onFromTimeChange = rowNumber => date => {
    const { openingHours, datesClosed } = this.props;
    const row = openingHours[rowNumber] || {};
    row.from = getTimeString(date);
    openingHours[rowNumber] = row;
    this.props.updateLocationData(openingHours, datesClosed);
  };

  onToTimeChange = rowNumber => date => {
    const { openingHours, datesClosed } = this.props;
    const row = openingHours[rowNumber] || {};
    row.to = getTimeString(date);
    openingHours[rowNumber] = row;
    this.props.updateLocationData(openingHours, datesClosed);
  };

  getFromTime = rowNumber => {
    const { openingHours } = this.props;
    const row = openingHours[rowNumber];
    return row ? getDateWithTime(row.from) : null;
  };

  onDateClosedChange = rowNumber => date => {
    const { openingHours, datesClosed } = this.props;
    datesClosed[rowNumber] = date;
    this.props.updateLocationData(openingHours, datesClosed);
  };

  getDateClosed = rowNumber => {
    const { datesClosed } = this.props;
    return datesClosed[rowNumber];
  };

  removeDateClosedRow = rowNumber => () => {
    const { openingHours, datesClosed } = this.props;
    datesClosed.splice(rowNumber, 1);
    this.props.updateLocationData(openingHours, datesClosed);
  };

  addDateClosedRow = () => {
    const { openingHours, datesClosed } = this.props;
    datesClosed.push(null);
    this.props.updateLocationData(openingHours, datesClosed);
  };

  getToTime = rowNumber => {
    const { openingHours } = this.props;
    const row = openingHours[rowNumber];
    return row ? getDateWithTime(row.to) : null;
  };

  hasWeekday = (openingHours, rowNumber, weekday) =>
    openingHours[rowNumber] && openingHours[rowNumber].activeDays && openingHours[rowNumber].activeDays.indexOf(weekday) >= 0;

  removeOpeningHoursRow = rowNumber => () => {
    const { openingHours, datesClosed } = this.props;
    openingHours.splice(rowNumber, 1);
    this.props.updateLocationData(openingHours, datesClosed);
  };

  addOpeningHoursRow = () => {
    const { openingHours, datesClosed } = this.props;
    openingHours.push({});
    this.props.updateLocationData(openingHours, datesClosed);
  };

  parseOpeningHours = location => {
    const { regularSchedule } = location;
    if (regularSchedule && regularSchedule.openingHours.length > 0) {
      return _.chain(regularSchedule.openingHours)
        .groupBy(oh => oh.opensAt + '-' + oh.closesAt)
        .map(rows =>
          _.reduce(
            rows,
            (row, oh) => ({
              from: oh.opensAt,
              to: oh.closesAt,
              activeDays: row.activeDays ? [...row.activeDays, oh.weekday] : [oh.weekday]
            }),
            { activeDays: [] }
          )
        )
        .value();
    }
    return this.props.defaultOpeningHours || [{}];
  };

  parseDatesClosed = location => {
    const { holidaySchedules } = location;
    if (holidaySchedules && holidaySchedules.length > 0) {
      let datesClosed = [];
      holidaySchedules.forEach(hs => {
        if (hs.closed && hs.startDate && hs.endDate) {
          datesClosed = datesClosed.concat(daysBetweenDates(hs.startDate, hs.endDate));
        }
      });
      return datesClosed;
    }
    return [null];
  };

  preview = () => {
    const { openingHours, datesClosed } = this.props;
    const ohByDay = [];
    openingHours.forEach(oh => {
      if (oh.activeDays && oh.from && oh.to) {
        oh.activeDays.forEach(day => {
          ohByDay.push({
            day,
            label: getWeekday(day, 'long') + ': ' + oh.from + '-' + oh.to
          });
        });
      }
    });
    ohByDay.sort((a, b) => a.day - b.day);
    const rows = ohByDay.map(day => day.label);
    const sortedDates = [...datesClosed].sort().reverse();
    sortedDates.forEach(dc => {
      if (dc) {
        rows.push('Closed: ' + dc.toLocaleDateString('en', { day: '2-digit', month: '2-digit', year: 'numeric' }));
      }
    });
    return rows;
  };

  render() {
    const { openingHours, datesClosed } = this.props;
    const noOhRows = openingHours.length || 1;
    const noDcRows = datesClosed.length || 1;
    return (
      <div>
        <Row className="mt-3">
          <Col>
            <div>
              <label>{translate('record.openingHours.title')}</label>
            </div>
            {Array.apply(null, { length: noOhRows }).map((x, rowNumber) => (
              <div className="d-flex align-items-baseline opening-hours flex-row flex-wrap">
                <div className="btn-group mr-2" role="group">
                  {Array.apply(null, { length: DAYS_IN_A_WEEK }).map((y, weekday) => (
                    <button
                      type="button"
                      className={`btn btn-secondary ${this.hasWeekday(openingHours, rowNumber, weekday) ? ' active' : ''}`}
                      onClick={this.toggleDay(rowNumber, weekday)}
                    >
                      {getWeekday(weekday)}
                    </button>
                  ))}
                </div>
                <div className="d-flex mr-2 align-items-baseline">
                  <DatePicker
                    className={'form-control time-picker'}
                    onChange={this.onFromTimeChange(rowNumber)}
                    showTimeSelect
                    showTimeSelectOnly
                    selected={this.getFromTime(rowNumber)}
                    dateFormat="hh:mm aa"
                  />
                  <span className="mx-1">to</span>
                  <DatePicker
                    className={'form-control time-picker'}
                    onChange={this.onToTimeChange(rowNumber)}
                    showTimeSelect
                    showTimeSelectOnly
                    selected={this.getToTime(rowNumber)}
                    dateFormat="hh:mm aa"
                  />
                </div>
                <ButtonPill className="button-pill-secondary mr-1" onClick={this.removeOpeningHoursRow(rowNumber)}>
                  {translate('record.openingHours.remove')}
                </ButtonPill>
                {rowNumber >= openingHours.length - 1 && (
                  <ButtonPill className="button-pill-secondary" onClick={this.addOpeningHoursRow}>
                    {translate('record.openingHours.add')}
                  </ButtonPill>
                )}
              </div>
            ))}
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <div>
              <label>{translate('record.openingHours.dates')}</label>
            </div>
            {Array.apply(null, { length: noDcRows }).map((x, rowNumber) => (
              <div className="d-flex align-items-baseline opening-hours flex-row flex-wrap">
                <div className="d-flex mr-2 align-items-baseline">
                  <span className="mx-1">{translate('record.openingHours.closedOn')}:</span>
                  <DatePicker
                    className={'form-control date-closed'}
                    onChange={this.onDateClosedChange(rowNumber)}
                    selected={this.getDateClosed(rowNumber)}
                  />
                </div>
                <ButtonPill className="button-pill-secondary mr-1" onClick={this.removeDateClosedRow(rowNumber)}>
                  {translate('record.openingHours.remove')}
                </ButtonPill>
                {rowNumber >= datesClosed.length - 1 && (
                  <ButtonPill className="button-pill-secondary" onClick={this.addDateClosedRow}>
                    {translate('record.openingHours.add')}
                  </ButtonPill>
                )}
              </div>
            ))}
          </Col>
        </Row>
        <Row className="my-3 opening-hours">
          <Col>
            <div>
              <label>{translate('record.openingHours.preview')}</label>
            </div>
            <div className="preview">
              {this.preview().map(line => (
                <div>{line}</div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
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
)(OpeningHours);
