import React from 'react';
import { bool } from 'prop-types';
import SelectSubcategoryFilterPlain from './SelectSubcategoryFilterPlain';
import SelectSubcategoryFilterPopup from './SelectSubcategoryFilterPopup';

const SelectSubcategoryFilter = props => {
  const { showAsPopup, ...rest } = props;
  return showAsPopup ? (
    <SelectSubcategoryFilterPopup {...rest} />
  ) : (
    <SelectSubcategoryFilterPlain {...rest} />
  );
};

SelectSubcategoryFilter.defaultProps = {
  showAsPopup: false,
};

SelectSubcategoryFilter.propTypes = {
  showAsPopup: bool,
};

export default SelectSubcategoryFilter;
