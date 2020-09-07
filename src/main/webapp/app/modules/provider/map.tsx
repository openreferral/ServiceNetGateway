import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import React, { ComponentClass, FunctionComponent } from 'react';
import _ from 'lodash';
// tslint:disable-next-line:no-submodule-imports
import { MAP } from 'react-google-maps/lib/constants';

const ICON_MARKER_SVG_PATH = 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z';

const withLatLong = (
  wrappedComponent: string | ComponentClass<any> | FunctionComponent<any>
): string | React.ComponentClass<any> | React.FunctionComponent<any> => wrappedComponent;

const extractMarkerLocations = props => {
  const markerLocations = [];
  if (props.records) {
    props.records.map(record => {
      const orgId = record.id;
      if (record.location) {
        markerLocations.push({ orgId, lat: record.location.latitude, lng: record.location.longitude });
      }
    });
  }
  return markerLocations;
};
const MapWrapper = withScriptjs(withGoogleMap(withLatLong(props => props.children)));

interface IPersistentMapProps {
  lat: any;
  lng: any;
  containerElement: any;
  showMyLocation: boolean;
  googleMapURL: string;
  records: any[];
  onBoundariesChanged: any;
  onMarkerClick: any;
}

export default class PersistentMap extends React.Component<IPersistentMapProps> {
  mapRef: any;
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.lat !== nextProps.lat
      || this.props.lng !== nextProps.lng
      || this.props.googleMapURL !== nextProps.googleMapURL
      || !_.isEqual(this.props.records, nextProps.records)
      || this.props.showMyLocation !== nextProps.showMyLocation;
  }

  onMapLoad = mapRef => {
    if (mapRef) {
      const transitLayer = new window.google.maps.TransitLayer();
      transitLayer.setMap(mapRef.context[MAP]);
    }
  };

  onBoundsChanged = () => {
    const boundaries = this.mapRef.getBounds();
    this.props.onBoundariesChanged(boundaries);
  }

  setMapRef = mapRef => {
    if (!_.isEqual(mapRef, this.mapRef)) {
      this.mapRef = mapRef;
      this.onMapLoad(this.mapRef);
    }
  }

  render() {
    const markerLocations = extractMarkerLocations(this.props);
    const props = this.props;

    return <MapWrapper {...this.props} mapElement={<div style={{ height: `100%` }} />} >
      <GoogleMap
        ref={mapRef => this.setMapRef(mapRef)}
        defaultZoom={2}
        defaultCenter={{ lat: props.lat || 38.5816, lng: props.lng || -121.4944 }}
        defaultOptions={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: false }}
        onBoundsChanged={this.onBoundsChanged}
      >
        {markerLocations.map((marker, idx) => (
          <Marker
            key={`${marker.lat}-${marker.lng}-${idx}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => props.onMarkerClick(marker)}
          />
        ))}
        {props.showMyLocation && (
          <Marker
            position={{ lat: props.lat, lng: props.lng }}
            icon={{
              path: ICON_MARKER_SVG_PATH,
              strokeColor: 'white',
              fillColor: 'blue',
              fillOpacity: 1
            }}
          />
        )}
      </GoogleMap>
    </MapWrapper>;
  }
}
