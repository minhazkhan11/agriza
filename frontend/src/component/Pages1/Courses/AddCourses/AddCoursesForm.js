import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddCoursesForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");

  const classes = useStyles();

  const handleClose = () => {
    navigate("/admin/courses");
  };



  const handleFormSubmit = () => {

    if (!courseName.trim()) {
      toast.warn("Please enter a course name.");
      return;
    }


  const data = {
    course: {
      course_name: courseName,
    },
  };

  axios
    .post(
      `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/course/add`,
      data,
      {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      }
    )
    .then((response) => {
      toast.success("Course created successfully");
      setTimeout(() => {
        navigate("/admin/courses");
      }, 2000);
    })
    .catch((error) => {
      toast.error(error);
    });
};
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Course Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Course Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                   onChange={(e) => setCourseName(e.target.value)}
                   value={courseName}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Course Name"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>
          </div>
          <div className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}>
            <Button      onClick={handleClose} className={`${classes.custombtnoutline}`}>Cancel</Button>
            <Button
              onClick={handleFormSubmit}
              className={`${classes.custombtnblue}`}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AddCoursesForm;
