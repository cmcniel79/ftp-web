import { types as sdkTypes } from './util/sdkLoader';

const { LatLng } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
const defaultLocations = [
  {
    id: 'default-albuquerque',
    predictionPlace: {
      address: 'Albuquerque, NM',
      origin: new LatLng(35.106766, -106.629181)
    },
  },
  // {
  //   id: 'default-gallup',
  //   predictionPlace: {
  //     address: 'Gallup, NM',
  //     origin: new LatLng(35.5280783, -108.7425843)
  //   },
  // },
  {
    id: 'default-seattle',
    predictionPlace: {
      address: 'Seattle, WA',
      origin: new LatLng(47.6038321, -122.3300624)
    },
  },
  {
    id: 'default-los-angeles',
    predictionPlace: {
      address: 'Los Angeles, CA',
      origin: new LatLng(34.0536909, -118.242766)
    },
  },
  {
    id: 'default-toronto',
    predictionPlace: {
      address: 'Toronto, ON',
      origin: new LatLng(43.7001100,-79.4163000)
    },
  },
  {
    id: 'default-vancouver',
    predictionPlace: {
      address: 'Vancouver, BC',
      origin: new LatLng(49.246292, -123.116226)
    },
  },
  {
    id: 'default-winnipeg',
    predictionPlace: {
      address: 'Winnipeg, MB',
      origin: new LatLng(49.895077, -97.138451)
    },
  },
];
export default defaultLocations;
