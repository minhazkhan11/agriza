import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { ReactComponent as NameIcon } from "../../../images/learnersimage/nameicon.svg";
import { ReactComponent as PhoneIcon } from "../../../images/learnersimage/phoneicon.svg";
import UploadButtons from "../../../CustomComponent/UploadButton";
import useStyles from "../../../../styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";

function EditTestSeriesForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const userId = localStorage.getItem("userId");

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [batches, setBatches] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const [formDetails, setFormDetails] = useState({
    test_series_name: "",
    code: "",
    description: "",
    start_date: "",
    start_time: "",
    language: ["en"],
    duration: "",
    total_score: "",
    no_of_question: "",
    per_question_marks: "",
  });

  // const handleFormChange = (fieldName, value) => {
  //   setFormDetails((prevFormDetails) => ({
  //     ...prevFormDetails,
  //     [fieldName]: value,
  //   }));
  // };

  const handleFormChange = (fieldName, value) => {
    let newFormDetails = { ...formDetails, [fieldName]: value };

    // Automatically calculate "Per Question Marks" when relevant fields are updated
    if (fieldName === "total_score" || fieldName === "no_of_question") {
      const totalScore = parseFloat(newFormDetails.total_score);
      const noOfQuestions = parseFloat(newFormDetails.no_of_question);

      // Ensure there are valid numbers and no division by zero
      if (!isNaN(totalScore) && !isNaN(noOfQuestions) && noOfQuestions > 0) {
        const perQuestionMarks = totalScore / noOfQuestions;
        // Fix the result to 2 decimal places or any other preference
        newFormDetails.per_question_marks = perQuestionMarks.toFixed(2);
      } else {
        // Handle cases where calculation cannot be performed
        newFormDetails.per_question_marks = ""; // Or set to a default value
      }
    }

    setFormDetails(newFormDetails);
  };

  const handleLanguageMenuToggle = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };
  const handleCancel = () => {
    navigate("/admin/testseries");
  };

  const handleThumbnailImageChange = (image) => {
    setThumbnailImage(image);
  };

  const handleFormSubmit = async () => {
    if (!formDetails.test_series_name.trim()) {
      toast.warn("Please enter test series name.");
      return;
    }

    if (!formDetails.code.trim()) {
      toast.warn("Please enter test series code.");
      return;
    }

    if (!selectedCourse) {
      toast.warn("Please select a course.");
      return;
    }

    if (!selectedBatch) {
      toast.warn("Please select a batch.");
      return;
    }

    if (!selectedSubject || selectedSubject.length === 0) {
      toast.warn("Please select at least one subject.");
      return;
    }

    if (!formDetails.language || formDetails.language.length === 0) {
      toast.warn("Please select at least one language.");
      return;
    }

    if (!formDetails.no_of_question) {
      toast.warn("Please enter the number of questions.");
      return;
    }

    if (!formDetails.total_score) {
      toast.warn("Please enter the total score.");
      return;
    }

    if (!formDetails.duration) {
      toast.warn("Please enter the duration.");
      return;
    }

    if (!formDetails.start_date) {
      toast.warn("Please select a start date.");
      return;
    }
    if (!formDetails.start_time) {
      toast.warn("Please select a start time.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "test_series",
        JSON.stringify({
          name: formDetails.test_series_name,
          code: formDetails.code,
          course_id: selectedCourse,
          batch_id: selectedBatch,
          subject: selectedSubject,
          description: formDetails.description,
          start_date: formDetails.start_date,
          start_time: formDetails.start_time,
          language: formDetails.language,
          duration: formDetails.duration,
          total_score: formDetails.total_score,
          no_of_question: formDetails.no_of_question,
        })
      );

      if (thumbnailImage) {
        formData.append("file", thumbnailImage);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success === true) {
        console.log(response.data.test_series.id);
        localStorage.setItem("userId", response.data.test_series.id);
        // toast.success("Test series added successfully!");
        navigate(`/admin/addquestiontestseries/${userId}`);
      }
    } catch (error) {
      console.error("Error adding test series:", error);
      toast.error("Failed to add test series. Please try again later.");
    }
  };

  const handleCourceChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
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
  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue.map((subject) => subject.id));
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh75}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween}`}>
              <div className={classes.w100}>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween}`}
                >
                  <Typography
                    className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    Test Series Details
                  </Typography>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w75}`}
                  >
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Test Series Name *
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                        value={formDetails.test_series_name}
                        onChange={(e) =>
                          handleFormChange("test_series_name", e.target.value)
                        }
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Code *
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                        value={formDetails.code}
                        onChange={(e) =>
                          handleFormChange("code", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <Typography
                    className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    Other Details
                  </Typography>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w75}`}
                  >
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Course <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <Select
                        labelId="category-label"
                        id="state"
                        className={classes.selectEmpty}
                        variant="outlined"
                        value={selectedCourse}
                        onChange={handleCourceChange}
                        displayEmpty
                        required
                      >
                        <MenuItem disabled value="">
                          Select Here
                        </MenuItem>
                        {courses.map((course) => (
                          <MenuItem key={course.id} value={course.id}>
                            {course.course_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Batch*
                      </FormLabel>
                      <Select
                        labelId="category-label"
                        id="state"
                        className={classes.selectEmpty}
                        variant="outlined"
                        value={selectedBatch}
                        onChange={handleBatchChange}
                        displayEmpty
                        required
                      >
                        <MenuItem disabled value="">
                          Select Here
                        </MenuItem>
                        {batches.map((batch) => (
                          <MenuItem key={batch.id} value={batch.id}>
                            {batch.batch_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <Typography
                    className={` ${classes.textcolorformhead} ${classes.w24} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  ></Typography>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w75}`}
                  >
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Subject *
                      </FormLabel>
                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={subjects}
                        getOptionLabel={(option) => option.subject_name}
                        value={subjects.filter((sub) =>
                          selectedSubject.includes(sub.id)
                        )}
                        onChange={handleSubjectChange}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="section"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick subject..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Languages *
                      </FormLabel>
                      <Select
                        labelId="language-label"
                        id="language"
                        multiple
                        open={languageMenuOpen}
                        onOpen={handleLanguageMenuToggle}
                        onClose={handleLanguageMenuToggle}
                        value={formDetails.language || []}
                        onChange={(e) => {
                          handleFormChange("language", e.target.value);
                          handleLanguageMenuToggle();
                        }}
                        renderValue={(selected) =>
                          selected
                            .map((code) =>
                              code === "en" ? "English" : "Hindi"
                            )
                            .join(", ")
                        }
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="hi">Hindi</MenuItem>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div
                  className={`${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1}`}
                >
                  <Typography
                    className={`${classes.w24}`}
                    variant="h6"
                    display="inline"
                  ></Typography>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween}  ${classes.w75}`}
                  >
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w65}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Description
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                        multiline
                        rows={6}
                        value={formDetails.description}
                        onChange={(e) =>
                          handleFormChange("description", e.target.value)
                        }
                      />
                    </div>
                    {/* Upload Button */}
                    <div className={`${classes.w32} ${classes.mt1_5}`}>
                      {/* Assuming UploadButtons is a custom component */}
                      <UploadButtons
                        onImageChange={handleThumbnailImageChange}
                        thumbnailImage={thumbnailImage}
                        thumbnailImagePreview={thumbnailImagePreview}
                        setThumbnailImagePreview={setThumbnailImagePreview}
                      />
                    </div>
                  </div>
                </div>
                {/* Questions Count, Total Score, Per Questions Marks */}
                <div
                  className={`${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1}`}
                >
                  <Typography
                    className={`${classes.w24}`}
                    variant="h6"
                    display="inline"
                  ></Typography>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.borderradius6px}  ${classes.p0_5}  ${classes.w75}`}
                  >
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Questions Count*
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                        value={formDetails.no_of_question}
                        onChange={(e) =>
                          handleFormChange("no_of_question", e.target.value)
                        }
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Total Score*
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                        value={formDetails.total_score}
                        onChange={(e) =>
                          handleFormChange("total_score", e.target.value)
                        }
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Per Questions Marks *
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        disabled
                        placeholder="Type Here"
                        value={formDetails.per_question_marks}
                        onChange={(e) =>
                          handleFormChange("per_question_marks", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* Duration in minutes, Start Date, Start Time */}
                <div
                  className={`${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1}`}
                >
                  <Typography
                    className={`${classes.w24}`}
                    variant="h6"
                    display="inline"
                  ></Typography>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.borderradius6px}  ${classes.p0_5}  ${classes.w75}`}
                  >
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Duration in minutes*
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                        value={formDetails.duration}
                        onChange={(e) =>
                          handleFormChange("duration", e.target.value)
                        }
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Start Date*
                      </FormLabel>
                      <TextField
                        type="date"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                        value={formDetails.start_date}
                        onChange={(e) =>
                          handleFormChange("start_date", e.target.value)
                        }
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Start Time *
                      </FormLabel>
                      <TextField
                        type="time"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                        value={formDetails.start_time}
                        onChange={(e) =>
                          handleFormChange("start_time", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
            >
              <Button
                onClick={handleCancel}
                className={`${classes.custombtnoutline}`}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                className={`${classes.custombtnblue}`}
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default EditTestSeriesForm;
