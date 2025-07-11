import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@material-ui/core";
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormBuilder from "./FormBuilder";
import uuid from "react-uuid";

function AddFeedbackForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value);
  };
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const initialData = {
    feedback_name: "",
    schedule_date: "",
  };

  const [formDetails, setFormDetails] = useState(initialData);

  const handleCourceChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };
  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const [formType, setFormType] = useState("text");
  const initialQuillData = {
    id: uuid(),
    value: null,
    type: formType,
    required: false,
  };
  const [quillData, setQuillData] = useState([initialQuillData]);

  console.log("quillData", quillData);
  console.log("formType", formType);

  const handleFormSubmit = async () => {
    if (!formDetails.feedback_name) {
      toast.error("Please Enter Feedback Name");
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
    if (!selectedTeacher) {
      toast.error("Please Select Teacher");
      return;
    }
    if (!formDetails.schedule_date) {
      toast.error("Please Choose Date");
      return;
    }
    // if (!quillData[0].value) {
    //   toast.error("Please Enter Your Questions");
    //   return;
    // }

    let hasValidationError = false;
    quillData.forEach((data, i) => {
      // Check if 'value' exists
      if (!data?.value) {
        toast.error(`Please Enter Question for Field No. ${i + 1}`);
        hasValidationError = true;
        return;
      }

      // Check for radio or checkbox type with empty options array
      if (
        (data.type === "radio" || data.type === "checkbox") &&
        (!data.options || data.options.length === 0)
      ) {
        toast.error(`Please Enter Options for Field No. ${i + 1}`);
        hasValidationError = true;
        return;
      }
    });

    if (hasValidationError) {
      return;
    }
    try {
      const data = {
        feedback: {
          title: formDetails.feedback_name,
          course_id: selectedCourse,
          batch_id: selectedBatch,
          subject_id: selectedSubject,
          teacher_id: selectedTeacher,
          schedule_date: formDetails.schedule_date,
          fields: quillData.map((data, index) => {
            const formattedData = {
              label: data?.value,
              type: data?.type,
              required: data?.required,
            };
            if (data?.type === "radio" || data?.type === "checkbox") {
              formattedData.options = data?.options?.map((opt, i) => {
                return {
                  option: opt?.value,
                };
              });
            }
            return formattedData;
          }),
        },
      };

      console.log(data, "datadata");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/feedback/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Feedback Question added Successfully");

        setTimeout(() => {
          navigate("/admin/feedback");
        }, 1000);
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleCancel = () => {
    navigate("/admin/feedback");
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

  const [teacher, setTeacher] = useState([]);
  const fetchTeacher = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/teacher`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.teachers) {
        setTeacher(response.data.teachers);
        console.log(teacher, "input");
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  const handleRemoveField = async (idToRemove) => {
    setQuillData((prevState) =>
      prevState.filter((val) => val.id !== idToRemove)
    );
  };
  const handleRemoveOption = async (elId, optionId) => {
      let newArr = quillData.map((el) => {
        if (el.id === elId) {
          let newOptions =
            el?.options && el?.options.filter((opt) => opt.id !== optionId);
          return { ...el, options: newOptions };
        } else {
          return el;
        }
      });
      setQuillData(newArr);
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
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Feedback Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Feedback Name <span className={classes.textcolorred}>*</span>{" "}
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Feedback Name*"
                  required
                  onChange={(e) =>
                    handleFormChange("feedback_name", e.target.value)
                  }
                  value={formDetails.feedback_name}
                />
              </div>
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
                  Batch <span className={classes.textcolorred}>*</span>
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Subject <span className={classes.textcolorred}>*</span>
                </FormLabel>
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
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Teacher <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="teacher"
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {teacher &&
                    teacher.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.full_name}
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
                  Schedule Date <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  required
                  value={formDetails.schedule_date}
                  onChange={(e) =>
                    handleFormChange("schedule_date", e.target.value)
                  }
                  placeholder="Type Here"
                />
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
                Add Question’s
              </Typography>
              <div className={`${classes.w75}`}>
                <FormBuilder
                  formType={formType}
                  setFormType={setFormType}
                  data={quillData}
                  setData={setQuillData}
                  handleRemoveField={handleRemoveField}
                  handleRemoveOption={handleRemoveOption}
                />
              </div>
            </div>
          </div>
          <div className={`${classes.dflex} ${classes.justifyflexend}`}>
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
        </FormControl>
      </div>
    </>
  );
}
export default AddFeedbackForm;
