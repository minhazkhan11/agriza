import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Fade,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  endAdornment,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";
import { Avatar, Divider, IconButton } from "@material-ui/core";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import kycicon from "../../../images/PopupScreenIcon/kycicon.png";
import ClearIcon from "@material-ui/icons/Clear";

const PopupQuizz = (props) => {
  const { open, handleOpenClose, fetchData, info } = props;

  const classes = useStyles();

  return (
    <>
      <Fade in={open}>
        <div
          className={`${classes.quizzpopup} ${classes.p1} ${classes.positionrelative} `}
        >
          <Button className={`${classes.closebtn}`}>
            <ClearIcon
              className={`${classes.textcolorwhite}`}
              onClick={() => {
                handleOpenClose();
              }}
            />
          </Button>

          <Typography
            className={`${classes.lightblackcolor} ${classes.fontfamilyDMSans} ${classes.fontsize} ${classes.fw700} ${classes.lineheight} ${classes.px0_5}`}
          >
            Publishing Details
          </Typography>
          <Divider className={`${classes.mt1} ${classes.background00577B}`} />
          <div
            className={`${classes.dflex} ${classes.justifycenter} ${classes.flexdirectioncolumn} ${classes.px0_5}`}
          >
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} ${classes.mt1}
             `}
            >
              Category
            </FormLabel>

            <TextField
              type="text"
              variant="outlined"
              required
              placeholder="Type Here"
            />
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} ${classes.mt1}
             `}
            >
              Sub-Category
            </FormLabel>

            <TextField
              type="text"
              variant="outlined"
              required
              placeholder="Type Here"
            />
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} ${classes.mt1}
             `}
            >
              Subject
            </FormLabel>

            <TextField
              type="text"
              variant="outlined"
              required
              placeholder="Type Here"
            />
          </div>
          <div
            className={`${classes.dflex} ${classes.mt2} ${classes.justifyspacebetween} ${classes.mx5} ${classes.mb25}`}
          >
            <Button
              className={`${classes.border1}  ${classes.fontFamilyJost} ${classes.fw600} ${classes.w40} ${classes.color7A7A} ${classes.borderradius0375}`}
            >
              Cancel
            </Button>
            <Button
              className={`${classes.fontFamilyJost} ${classes.fw600} ${classes.bgdarkblue} ${classes.textcolorwhite} ${classes.w54}`}
            >
              Save
            </Button>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default PopupQuizz;
