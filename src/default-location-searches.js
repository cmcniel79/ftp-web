import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-albuquerque',
    predictionPlace: {
      address: 'Albuquerque, NM',
      origin: new LatLng(35.106766, -106.629181)
    },
  },
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
    id: 'default-new-york',
    predictionPlace: {
      address: 'New York, NY',
      origin: new LatLng(40.7648, -73.9808)
    },
  },
];
