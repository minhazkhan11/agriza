// TabComponent.js
import React from 'react';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import { a11yProps } from './Utils';

function CustomTab({ label, id, index, onChange, ...other }) {
  const handleChange = (event, newValue) => {
    onChange(event, newValue);
  };

  return <Tab label={label} {...a11yProps(id)} onClick={(e) => handleChange(e, index)} {...other} />
  ;
}

CustomTab.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomTab;
