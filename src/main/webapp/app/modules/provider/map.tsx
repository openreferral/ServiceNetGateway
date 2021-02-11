import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import React, { ComponentClass, FunctionComponent } from 'react';
import _ from 'lodash';
// tslint:disable-next-line:no-submodule-imports
import { MAP } from 'react-google-maps/lib/constants';

const DEFAULT_ZOOM = 10;
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

interface IPersistentMapState {
  lat: number;
  lng: number;
  zoom: number;
}

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
  loadingMap: boolean;
  initialLoad: boolean;
}

export default class PersistentMap extends React.Component<IPersistentMapProps> {
  state = {
    lat: this.props.lat || 37.7799,
    lng: this.props.lng || -122.2822,
    zoom: this.props.lat ? MY_LOCATION_ZOOM : DEFAULT_ZOOM
  };
  mapRef: any;
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.lat !== nextState.lat ||
      this.state.lng !== nextState.lng ||
      this.state.zoom !== nextState.zoom ||
      this.props.centeredAt !== nextProps.centeredAt ||
      this.props.lng !== nextProps.lng ||
      this.props.googleMapURL !== nextProps.googleMapURL ||
      !_.isEqual(this.props.records, nextProps.records) ||
      this.props.showMyLocation !== nextProps.showMyLocation
    );
  }

  componentDidUpdate(prevProps: Readonly<IPersistentMapProps>, prevState: Readonly<{}>, snapshot?: any) {
    if (prevProps.centeredAt !== this.props.centeredAt) {
      this.setState({
        lat: this.props.lat,
        lng: this.props.lng,
        zoom: MY_LOCATION_ZOOM
      });
    }
    if (prevProps.records !== this.props.records && this.props.initialLoad) {
      this.fitToMarkers();
    }
  }

  onMapLoad = mapRef => {
    if (mapRef) {
      this.mapRef = mapRef;
      const transitLayer = new window.google.maps.TransitLayer();
      transitLayer.setMap(mapRef.context[MAP]);
      if (this.props.records && this.props.initialLoad) {
        this.fitToMarkers();
      }
    }
  };

  onBoundsChanged = () => {
    const boundaries = this.mapRef.getBounds();
    this.props.onBoundariesChanged(boundaries);
  };

  onCenterChanged = () => {
    const center = this.mapRef.getCenter();
    this.setState({
      lat: center.lat(),
      lng: center.lng()
    });
  };

  onZoomChanged = () => {
    const zoom = this.mapRef.getZoom();
    this.setState({
      zoom
    });
  };

  setMapRef = mapRef => {
    if (!_.isEqual(mapRef, this.mapRef)) {
      this.onMapLoad(mapRef);
    }
  };

  fitToMarkers = () => {
    if (this.mapRef && this.mapRef.fitBounds) {
      const markerLocations = extractMarkerLocations(this.props);
      const bounds = new window.google.maps.LatLngBounds();
      markerLocations.map(coords => {
        const latLng = new window.google.maps.LatLng(coords.lat, coords.lng);
        bounds.extend(latLng);
      });
      this.mapRef.fitBounds(bounds);
    }
  };

  render() {
    const markerLocations = extractMarkerLocations(this.props);
    const props = this.props;

    return (
      <MapWrapper {...this.props} mapElement={<div className="flex-column-stretch" style={{ height: `100%` }} />}>
        <GoogleMap
          ref={mapRef => this.setMapRef(mapRef)}
          center={{ lat: this.state.lat, lng: this.state.lng }}
          zoom={this.state.zoom}
          defaultOptions={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: false, gestureHandling: 'greedy' }}
          onBoundsChanged={this.onBoundsChanged}
          onCenterChanged={this.onCenterChanged}
          onZoomChanged={this.onZoomChanged}
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
      </MapWrapper>
    );
  }
}
