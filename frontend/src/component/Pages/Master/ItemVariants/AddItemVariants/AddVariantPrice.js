import React from "react";
import useStyles from "../../../../../styles";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Button, FormLabel, TextField } from "@material-ui/core";

function AddVariantPrice({ handlePopUp }) {
  const classes = useStyles();

  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.bgwhite} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.alignitemscenter} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.p1}`}
      >
        <div className={`${classes.dflex} ${classes.flexdirectioncolumn}`}>
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
          >
            Basic Price
          </FormLabel>
          <TextField
            // value={formDetails.alias}
            // onChange={(e) => handleFormChange("alias", e.target.value)}
            type="text"
            variant="outlined"
            required
            placeholder="Enter Price"
          />
        </div>
        <div
          className={`${classes.w100} ${classes.dflex} ${classes.justifyflexend}`}
        >
          <Button
            onClick={handlePopUp}
            className={`${classes.transparentbtn} ${classes.mr1} ${classes.my0_5}`}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={`${classes.bluebtn} ${classes.my0_5}`}
            // onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}
export default AddVariantPrice;
