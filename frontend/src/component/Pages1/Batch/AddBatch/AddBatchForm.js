import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
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

function AddBatchForm() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [batchName, setBatchName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState();

  const handleClose = () => {
    navigate("/admin/batch");
  };

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const handleStateChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleFormSubmit = () => {
    const selectedCourseString = String(selectedCourse);
    
    if (!batchName.trim()) {
      toast.warn("Please enter a batch name.");
      return;
    }

    if (!selectedCourseString.trim()) {
      toast.warn("Please Select a course.");
      return;
    }

    const data = {
      batch: {
        course_id:selectedCourse ,
        batch_name: batchName,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch/add`,
       data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {

        setTimeout(() => {
          navigate("/admin/batch");
        }, 2000);
        toast.success("Batch created successfully");
      })
      .catch((error) => {
        toast.error("Batch is not created");
      });
  };



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/course`, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        });

        // Ensure that the API response contains the 'batch' property
        if (response.data && response.data.courses) {
          setCourses(response.data.courses);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [decryptedToken]);

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
              Batch Details
            </Typography>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Batch Name <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                onChange={(e) => setBatchName(e.target.value)}
                value={batchName}
                name="category_name"
                type="text"
                variant="outlined"
                required
                placeholder="Enter Batch Name"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Course <span className={classes.textcolorred}>*</span>
              </FormLabel>

              <Select
                labelId="category-label"
                id="state"
                value={selectedCourse}
                onChange={(e) => handleStateChange(e)}
                displayEmpty
                className={classes.selectEmpty}
                MenuProps={menuProps}
                variant="outlined"
              >
                <MenuItem disabled value="">
                 Select Course
                </MenuItem>
                {courses &&
                  courses.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.course_name}
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
            ></div>
          </div>
        </div>
        <div
          className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
        >
          <Button
            className={`${classes.custombtnoutline}`}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className={`${classes.custombtnblue}`}
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </div>
      </FormControl>
    </div>
    </>
  );
}
export default AddBatchForm;
