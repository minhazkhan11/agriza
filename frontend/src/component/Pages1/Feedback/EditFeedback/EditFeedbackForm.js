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
import { useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";
import FormBuilder from "../AddFeedback/FormBuilder";

function EditFeedbackForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const { rowId } = useParams();
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [feedbackName, setFeedbackName] = useState("");
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [date, setDate] = useState("");

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

  const handleCourseChange = (ev) => {
    setSelectedCourse(ev.target.value);
  };
  const handleBatchChange = (ev) => {
    setSelectedBatch(ev.target.value);
  };
  const handleSubjectChange = (ev) => {
    setSelectedSubject(ev.target.value);
  };
  const handleTeacherChange = (ev) => {
    setSelectedTeacher(ev.target.value);
  };

  const [quillInputs, setQuillInputs] = useState([{ question: "" }]);
  const [feedBack, setFeedBack] = useState({});

  const fetchData = async (rowId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/feedback/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.feedback) {
        const data = response.data.feedback;

        const formattedData = data.fields?.map((val, index) => {
          const formattedVal = {
            id: val?.id,
            value: val?.label,
            type: val?.type,
            required: val?.required,
          };
          if (val.options) {
            formattedVal.options = val.options.map((opt, i) => ({
              id: opt?.id,
              value: opt?.option,
            }));
          }
          return formattedVal;
        });
        console.log("formattedData", formattedData);

        if (JSON.stringify(data) !== JSON.stringify(feedBack)) {
          setFeedBack(data);
          setFeedbackName(data?.title);
          setSelectedCourse(data?.course_id);
          setSelectedBatch(data?.batch_id);
          setSelectedSubject(data?.subject_id);
          setSelectedTeacher(data?.teacher_id);
          setDate(data?.schedule_date.substring(0, 10));
          setQuillData(formattedData);
        }
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchData(rowId);
  }, [rowId, feedBack]);

  const handleRemoveField = async (idToRemove) => {
    if (typeof idToRemove === "string") {
      setQuillData((prevState) =>
        prevState.filter((val) => val.id !== idToRemove)
      );
    } else {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/feedback/field/${idToRemove}`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

        setQuillData((prevState) =>
          prevState.filter((val) => val.id !== idToRemove)
        );
        toast.success("Field deleted successfully");
      } catch (error) {
        console.error("Error deleting field:", error);
        toast.error("Failed to delete field");
      }
    }
  };
  const handleRemoveOption = async (elId, optionId) => {
    if (typeof optionId === "string") {
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
    } else {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/feedback/field/option/${optionId}`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

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
        toast.success("Option deleted successfully");
      } catch (error) {
        console.error("Error deleting option:", error);
        toast.error("Failed to delete option");
      }
    }
  };

  const handleFormSubmit = async () => {
    if (!feedbackName) {
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
      toast.error("Please Selecte Teacher");
      return;
    }
    if (!date) {
      toast.error("Please Choose Date");
      return;
    }

    let hasValidationError = false;
    quillData.forEach((data, i) => {
      
      if (!data?.value) {
        toast.error(`Please Enter Question for Field No. ${i + 1}`);
        hasValidationError = true;
        return;
      }

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
          id: rowId,
          title: feedbackName,
          course_id: selectedCourse,
          batch_id: selectedBatch,
          subject_id: selectedSubject,
          teacher_id: selectedTeacher,
          schedule_date: date,
          fields: quillData.map((data1, index) => {
            const formattedData = {
              label: data1?.value,
              type: data1?.type,
              required: data1?.required,
            };
            if (data1?.type === "radio" || data1?.type === "checkbox") {
              formattedData.options = data1?.options?.map((opt, i) => {
                const optionObj = {
                  option: opt?.value,
                };
                if (typeof opt.id !== "string") {
                  optionObj.id = opt?.id;
                }
                return optionObj;
              });
            }
            if (typeof data1.id !== "string") {
              formattedData.id = data1?.id;
            }
            return formattedData;
          }),
        },
      };
      console.log(data, "datadata");
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/feedback`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Feedback updated Successfully");
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
                  Feedback Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Feedback Name*"
                  required
                  onChange={(e) => setFeedbackName(e.target.value)}
                  value={feedbackName}
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
                  id="course"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {courses &&
                    courses.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.course_name}
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
                  id="state"
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
                    batches.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.batch_name}
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
                  id="state"
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {subjects &&
                    subjects.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.subject_name}
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
                  id="state"
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                {/* <EditFormBuilder /> */}
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
export default EditFeedbackForm;
