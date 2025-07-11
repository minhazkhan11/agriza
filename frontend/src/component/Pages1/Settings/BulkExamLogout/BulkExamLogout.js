import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Typography,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Chip
} from "@material-ui/core";
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

function BulkExamLogout() {
  const classes = useStyles();

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };
 
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [selectedLearner, setSelectedLearner] = useState([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [learners, setLearners] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

   const handleCourceChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedBatch("");
    setSelectedLearner([]);
    setSelectedLearnerId([]);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    setSelectedLearner([]);
    setSelectedLearnerId([]);
  };

  const handleLearnerChange = (event, value) => {
    setSelectedLearner(value.map((learner) => learner));
    setSelectedLearnerId(value.map((learner) => learner.id));
  };

  const handleSelectAllChange = () => {
    const allLearners = !selectAll ? learners : [];
    setSelectedLearner(allLearners);
    const selectedIds = allLearners.map((learner) => learner.id);
    setSelectedLearnerId(selectedIds);
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/course/all/active`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

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

  const fetchBatches = async (selectedCourse) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch/by_course_id/${selectedCourse}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.batches) {
        setBatches(response.data.batches);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  useEffect(() => {
    fetchBatches(selectedCourse);
  }, [selectedCourse]);
  
  const fetchLearners = async (
    selectedCourse,
    selectedBatch
  ) => {
    const requestData = {
      user: {
        course_id: selectedCourse,
        batch_id: selectedBatch,
      },
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch/by_all_learners/learner`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && response.data.learners) {
        setLearners(response.data.learners);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching learners:", error);
    }
  };

  useEffect(() => {
    fetchLearners(selectedCourse, selectedBatch);
  }, [selectedCourse, selectedBatch]);
  
  const handleFormSubmit = () => {
    console.log("selectedLearnerId", selectedLearnerId)
    if (!selectedCourse) {
      toast.warn("Please select a course.");
      return;
    }

    const data = {
      user: {
        course_id: selectedCourse,
        batch_id: selectedBatch,
        learner_ids: selectedLearnerId,
      },
    };
    
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/examlogout/logout`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
        if (selectedLearnerId.length === 0) {
          toast.success("All learner's exam logged-out successfully");
        } else {
          toast.success("Selected learner's exam logged-out successfully");
        }
      })
      .catch((error) => {
        toast.error("Failed to update Zoom Account Config");
      });
  };

  
  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
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
                Exam Logout
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
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
                  onChange={handleCourceChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {courses &&
                    courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.course_name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Batch
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="batch"
                  value={selectedBatch}
                  onChange={handleBatchChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {batches &&
                    batches.map((batch) => (
                      <MenuItem key={batch.id} value={batch.id}>
                        {batch.batch_name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Learner
                </FormLabel>
                {/* <Autocomplete
                  multiple
                  id="tags-standard"
                  options={learners || []}
                  getOptionLabel={(option) =>
                    `${option?.full_name}`
                  }
                  value={selectedLearner}
                  onChange={handleLearnerChange}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick  Number..."
                      {...params}
                    />
                  )}
                /> */}
                <Autocomplete
                  multiple
                  id="learner-autocomplete"
                  required
                  options={learners || []}
                  disableClearable
                  disableCloseOnSelect={true}
                  value={selectedLearner}
                  onChange={(event, newValue) => {
                    setSelectedLearner(newValue);
                    const selectedIds = newValue.map((learner) => learner.id);
                    setSelectedLearnerId(selectedIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectAll}
                                  onChange={handleSelectAllChange}
                                />
                              }
                              label="Select All"
                            />
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(option, { selected }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                      }
                      label={option.full_name} // Display the full_name in the dropdown
                    />
                  )}
                  getOptionLabel={(option) => option.full_name} // Display the full_name as the selected value
                  renderTags={() => null}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  selectOnFocus
                  openOnFocus
                />
              </div>
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
              Logout
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default BulkExamLogout;
