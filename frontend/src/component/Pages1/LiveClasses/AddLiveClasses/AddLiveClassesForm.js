import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useStyles from "../../../../styles";
import UploadButtons from "../../../CustomComponent/UploadButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const AddLiveClassesForm = () => {
  const classes = useStyles();
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [classCount, setClassCount] = useState("");
  const [zooMetId, setZooMetId] = useState("");
  const [zooPass, setZooPass] = useState("");
  const [type, setType] = useState("live_class");

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleCourceChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };
  const handleThumbnailImageChange = (image) => {
    setThumbnailImage(image);
    console.log(image, "image");
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
    console.log("Password visibility toggled:", !showPassword); // Debugging
  };

  const handleFormSubmit = async () => {
    const typeName = type === "live_class" ? "Live Class" : "Webinar";
    try {
      const formData = new FormData();
      if (!name) {
        toast.error(`Please Enter ${typeName} Name`);
        return;
      }
      if (!code) {
        toast.error(`Please Enter ${typeName} Code`);
        return;
      }
      if (!selectedCourse) {
        toast.error("Please Choose Course");
        return;
      }
      if (!selectedBatch) {
        toast.error("Please Choose Batch");
        return;
      }
      if (!selectedSubject) {
        toast.error("Please Choose Subject");
        return;
      }
      if (type === "live_class" && !classCount) {
        toast.error("Please Enter Class Count");
        return;
      }
      if (type === "live_class" && !startDate) {
        toast.error("Please Enter Start Date");
        return;
      }
      if (type === "live_class" && !endDate) {
        toast.error("Please Enter End Date");
        return;
      }
      if (type === "webinar" && !liveDate) {
        toast.error("Please Enter Date");
        return;
      }
      if (type === "webinar" && !startTime) {
        toast.error("Please Enter Start Time");
        return;
      }
      if (type === "webinar" && !endTime) {
        toast.error("Please Enter End Time");
        return;
      }
      if (!zooMetId) {
        toast.error("Please Enter Zoom Meeting Id");
        return;
      }
      if (!zooPass) {
        toast.error("Please Enter Zoom Meeting Password");
        return;
      }

      formData.append(
        "live_class",
        JSON.stringify({
          type: type,
          live_class_code: code,
          course_id: selectedCourse,
          batch_id: selectedBatch,
          subject_id: selectedSubject,
          description: description,
          ...(type === "live_class"
            ? {
                live_class_name: name,
                class_count: classCount,
                start_date: startDate,
                end_date: endDate,
              }
            : {
                webinar_name: name,
                date: liveDate,
                start_time: startTime,
                end_time: endTime,
              }),
          zoom_meeting_id: zooMetId,
          zoom_password: zooPass,
          notify_user: check,
        })
      );

      formData.append("file", thumbnailImage);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasses/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.data.success === true) {
        toast.success(`${typeName} added successfully!`);
        setTimeout(() => {
          if (type === "webinar") {
            navigate(`/admin/liveclasses`);
          } else {
            navigate(`/admin/liveclassesschedule/${response.data?.newliveData?.id}`);
          }
        }, 2000);
      }
    } catch (error) {
      let errorMessage = `Failed to add ${typeName}. Please try again later.`;

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data.errors)
      ) {
        // If the errors are in an array format, join them
        errorMessage = error.response.data.errors.join(", ");
      }

      console.error(`Error adding ${typeName}:`, error);
      toast.error(errorMessage);
    }
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
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchBatches(selectedCourse);
  }, [selectedCourse]);

  const fetchSubjects = async (selectedBatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/subject/by_batch/${selectedBatch}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.subjects) {
        setSubjects(response.data.subjects);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchSubjects(selectedBatch);
  }, [selectedBatch]);
  const [check, setCheck] = useState(true);
  const notify = (e) => {
    setCheck(!check);
  };
  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}  ${classes.h72vh} `}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween}  `}
            >
              <Typography
                className={`${classes.w24_5} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Type
              </Typography>
              <div
                className={`${classes.dflex} ${classes.radiobtninner}  ${classes.w37}`}
              >
                <RadioGroup
                  aria-label="type"
                  name="type"
                  value={type}
                  onChange={handleTypeChange}
                >
                  <FormControlLabel
                    value="live_class"
                    control={<Radio />}
                    label="Live Class"
                  />
                  <FormControlLabel
                    value="webinar"
                    control={<Radio />}
                    label="Webinar"
                  />
                </RadioGroup>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              ></div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24_5} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                {type === "webinar"
                  ? "Webinar Details"
                  : "Live Classes Details"}
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  value={name}
                  required
                  placeholder="Type Here"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Code <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24_5} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Course <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <FormControl>
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
                </FormControl>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Batch <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <FormControl>
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
                </FormControl>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Subject <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    labelId="category-label"
                    id="subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                  >
                    <MenuItem disabled value="">
                      <em className={classes.defaultselect}>Select Here</em>
                    </MenuItem>
                    {subjects &&
                      subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.subject_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            {type === "webinar" ? (
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
              >
                <Typography
                  className={`${classes.w24_5} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  Meeting Details
                </Typography>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Date <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <FormControl>
                    <TextField
                      type="date"
                      variant="outlined"
                      value={liveDate}
                      required
                      placeholder="Type Here"
                      onChange={(e) => setLiveDate(e.target.value)}
                    />
                  </FormControl>
                </div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Start Time <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <FormControl>
                    <TextField
                      type="time"
                      variant="outlined"
                      value={startTime}
                      required
                      placeholder="Type Here"
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </FormControl>
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    End Time <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <FormControl>
                    <TextField
                      type="time"
                      variant="outlined"
                      value={endTime}
                      required
                      placeholder="Type Here"
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </FormControl>
                </div>
              </div>
            ) : (
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
              >
                <Typography
                  className={`${classes.w24_5} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  Meeting Details
                </Typography>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Class Count <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <FormControl>
                    <TextField
                      type="number"
                      variant="outlined"
                      value={classCount}
                      required
                      placeholder="Type Here"
                      onChange={(e) => setClassCount(e.target.value)}
                    />
                  </FormControl>
                </div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Start Date <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <FormControl>
                    <TextField
                      type="date"
                      variant="outlined"
                      value={startDate}
                      required
                      placeholder="Type Here"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </FormControl>
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    End Date <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <FormControl>
                    <TextField
                      type="date"
                      variant="outlined"
                      value={endDate}
                      required
                      placeholder="Type Here"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </FormControl>
                </div>
              </div>
            )}
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24_5} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Zoom Meeting Id{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <FormControl>
                  <TextField
                    type="text"
                    variant="outlined"
                    value={zooMetId}
                    required
                    placeholder="Type Here"
                    onChange={(e) => setZooMetId(e.target.value)}
                  />
                </FormControl>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Password <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <FormControl>
                  <TextField
                    name="password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    required
                    placeholder="********"
                    value={zooPass}
                    onChange={(e) => setZooPass(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleToggleShowPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5}`}
              ></div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24_5} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Description
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type Here"
                  multiline
                  rows={5}
                />
              </div>
              <div
                className={`${classes.w24_5} ${classes.mt1_5} ${classes.ml1}`}
              >
                <UploadButtons
                  onImageChange={handleThumbnailImageChange}
                  thumbnailImage={thumbnailImage}
                  thumbnailImagePreview={thumbnailImagePreview}
                  setThumbnailImagePreview={setThumbnailImagePreview}
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24_5} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.alignitemscenter} ${classes.w24_5}`}
              >
                <Checkbox
                  defaultChecked
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onClick={(e) => notify(e)}
                />
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Notify User
                </FormLabel>
              </div>
              <div
                className={`${classes.w49} ${classes.mt1_5} ${classes.ml1}`}
              ></div>
            </div>
          </div>

          <div
            className={`${classes.dflex} ${classes.justifyflexend}  ${classes.mt1} `}
          >
            <Button
              className={`${classes.custombtnoutline}`}
              onClick={() => {
                navigate("/admin/liveclasses");
              }}
            >
              Cancel
            </Button>
            <Button
              className={`${classes.custombtnblue}`}
              onClick={handleFormSubmit}
            >
              Save & Continue
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
};

export default AddLiveClassesForm;
