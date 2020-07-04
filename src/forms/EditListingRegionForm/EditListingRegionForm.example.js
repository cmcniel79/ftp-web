/* eslint-disable no-console */
import EditListingRegionForm from './EditListingRegionForm';

export const Empty = {
  component: EditListingRegionForm,
  props: {
    publicData: {},
    onSubmit: values => {
      console.log('Submit EditListingRegionForm with (unformatted) values:', values);
    },
    saveActionMsg: 'Save rules',
    updated: false,
    updateInProgress: false,
    disabled: false,
    ready: false,
  },
  group: 'forms',
};
