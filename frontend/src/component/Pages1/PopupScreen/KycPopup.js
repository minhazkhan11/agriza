import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Fade,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  endAdornment,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../styles";
import { Avatar, Divider, IconButton } from "@material-ui/core";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import kycicon from "../../images/PopupScreenIcon/kycicon.png";
import { ReactComponent as CountryIcon} from "../../images/PopupScreenIcon/countryicon.svg";


const KycPopup = (props) => {
  const { open, handleOpenClose, fetchData, info } = props;

  const classes = useStyles();

  return (
    <>
      <Fade in={open}>
        <div
          className={`${classes.kycpopup} ${classes.p1} ${classes.lightskyblue} `}
        >
          <Typography
            className={`${classes.textcolorblue} ${classes.dflex} ${classes.justifycenter} ${classes.fontfamilyoutfit} ${classes.fontSize12} ${classes.fw600}`}
          >
            KYC Verification  
          </Typography>
          <FormControl variant="outlined" className={classes.formControl}  >
          <FormLabel>Issuing Country/Region</FormLabel>
        
      
        <Select
          native
        //   value={state.age}
        // //   onChange={handleChange}
        //   label="Age"
          inputProps={{
            name: 'age',
            id: 'outlined-age-native-simple',
            
          }}
          placeholder="United States"
        >
         
          <option aria-label="None" value="" />
          <option value={10}>Ten</option>
          <option value={20}>Twenty</option>
          <option value={30}>Thirty</option>
        </Select>
      </FormControl>
          {/* <TextField id="outlined-basic" variant="outlined"  placeholder="United States"/> */}
        </div>
      </Fade>
    </>
  );
};

export default KycPopup;
