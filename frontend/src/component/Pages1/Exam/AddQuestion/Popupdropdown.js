import React, { useState } from "react";
import { Button, Fade, FormLabel, MenuItem, Select } from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";
import ClearIcon from "@material-ui/icons/Clear";

const Popupdropdown = (props) => {
  const { open, handleOpenClose, fetchData, info } = props;

  const classes = useStyles();
  const [subject, setSubject] = useState("");

  const handleChange = (event) => {
    setSubject(event.target.value);
  };
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  return (
    <>
      <Fade in={open}>
        <div
          className={`${classes.dropdownpopup} ${classes.p1} ${classes.positionrelative} `}
        >
          <Button className={`${classes.closebtn}`}>
            <ClearIcon
              className={`${classes.textcolorwhite}`}
              onClick={() => {
                handleOpenClose();
              }}
            />
          </Button>
          <div className={`${classes.px2} ${classes.py1}`}>
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize5} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
              Select Subject
            </FormLabel>
            <br />
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={subject}
              onChange={handleChange}
              displayEmpty
              MenuProps={menuProps}
              variant="outlined"
              style={{ width: "100%" }}
            >
              <MenuItem value="">
                <em>Hindi</em>
              </MenuItem>
              <MenuItem value={10}>English</MenuItem>
              <MenuItem value={10}>Biology</MenuItem>
            </Select>
            <div className={`${classes.mt2}`}>
              <Button className={`${classes.custombtnblue} ${classes.w100}`}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default Popupdropdown;
