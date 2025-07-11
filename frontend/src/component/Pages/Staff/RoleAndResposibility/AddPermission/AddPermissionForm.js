import React from "react";
import { FormControl, Typography } from "@material-ui/core";
import useStyles from "../../../../../styles";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import ViewPermission from "./ViewPermission";

function AddPermissionForm() {
  const { state } = useLocation();
  const rowId = state.rowId;
  const rowName = state.rowName;

  const classes = useStyles();

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1}  ${classes.inputpadding} ${classes.inputborder} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Role Name
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w50}`}
              >
                <Typography
                  className={`${classes.w30} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  {rowName}
                </Typography>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>
            <ViewPermission />
          </div>
          {/* <div
            className={`${classes.dflex} ${classes.justifyflexend} ${
              classes.mt1
            } ${classes[style?.marginbottom]}`}
          >
            <Button
              onClick={handleClose}
              className={`${classes.custombtnoutline}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              className={`${classes.custombtnblue}`}
            >
              Submit
            </Button>
          </div> */}
        </FormControl>
      </div>
    </>
  );
}
export default AddPermissionForm;
