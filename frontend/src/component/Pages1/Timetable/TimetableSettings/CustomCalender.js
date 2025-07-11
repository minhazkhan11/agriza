import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useStyles from '../../../../styles';

function CustomCalender() {
const classes = useStyles();  
  const [value, onChange] = useState(new Date());
  return (
    <div>
      <Calendar
      className={`${classes.customcalender}`}
       onChange={onChange} value={value} />
    </div>
  );
};

export default CustomCalender;