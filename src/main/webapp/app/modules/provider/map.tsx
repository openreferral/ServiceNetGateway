import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import React, { ComponentClass, FunctionComponent } from 'react';
import _ from 'lodash';
// tslint:disable-next-line:no-submodule-imports
import { MAP } from 'react-google-maps/lib/constants';

const DEFAULT_ZOOM = 2;
const MY_LOCATION_ZOOM = 12;
const LOCATION_MARKER_SIZE = 22;
const LOCATION_MARKER_URL = '/content/images/location-marker.png';

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
  lat: number;
  lng: number;
  containerElement: any;
  showMyLocation: boolean;
  googleMapURL: string;
  records: any[];
  onBoundariesChanged: any;
  onMarkerClick: any;
  centeredAt: any;
}

export default class PersistentMap extends React.Component<IPersistentMapProps> {
  mapRef: any;
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.lat !== nextProps.lat
      || this.props.centeredAt !== nextProps.centeredAt
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
        center={{ lat: props.lat || 38.5816, lng: props.lng || -121.4944 }}
        zoom={props.lat ? MY_LOCATION_ZOOM : DEFAULT_ZOOM}
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
              url: LOCATION_MARKER_URL,
              scaledSize: new google.maps.Size(LOCATION_MARKER_SIZE, LOCATION_MARKER_SIZE),
              anchor: new google.maps.Point(LOCATION_MARKER_SIZE / 2, LOCATION_MARKER_SIZE / 2)
            }}
          />
        )}
      </GoogleMap>
    </MapWrapper>;
  }
}
