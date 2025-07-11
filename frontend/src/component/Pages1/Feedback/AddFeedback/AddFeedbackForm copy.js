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
import ReactQuill from "react-quill";

const quillModules = {
  toolbar: [
    [
      "bold",
      "italic",
      "underline",
      "strike",
      { script: "sub" },
      { script: "super" },
      { color: [] },
      { background: [] },
    ],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["code-block"],
  ],
};

const quillFormats = [
  "header",
  "font",
  "size",
  "list",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "link",
  "blockquote",
  "code-block",
  "align",
  "image",
];

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
    teacher_name: "",
    email: "",
    phone: "",
    about: "",
    password: "",
    state: "",
    district: "",
    address: "",

    file: null,
  };

  const [formDetails, setFormDetails] = useState(initialData);

  const [selectedState, setSelectedState] = useState("");

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };
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

  const [quillInputs, setQuillInputs] = useState([{ id: 1, question: "" }]);

  const handleAddInput = () => {
    const newId = quillInputs.length + 1;
    setQuillInputs([...quillInputs, { id: newId, question: "" }]);
  };

  const handleRemoveInput = (idToRemove) => {
    if (quillInputs.length === 1) return;
    const updatedInputs = quillInputs.filter(
      (input) => input.id !== idToRemove
    );
    setQuillInputs(updatedInputs);
  };
  console.log(quillInputs, "input");
  const handleInputChange = (id, question) => {
    const updatedInputs = quillInputs.map((input) =>
      input.id === id ? { ...input, question } : input
    );
    setQuillInputs(updatedInputs);
  };
  const handleFormSubmit = async () => {
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
    if (!formDetails.start_date) {
      toast.error("Please Choose Date");
      return;
    }
    if (!quillInputs[0].question) {
      toast.error("Please Enter Your Questions");
      return;
    }
    try {
      const data = {
        feedback: {
          course_id: selectedCourse,
          batch_id: selectedBatch,
          subject_id: selectedSubject,
          teacher_id: selectedTeacher,
          schedule_date: formDetails.start_date,
          questions: quillInputs,
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
                Feedback Details*
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Course *
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
                  Batch *
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
                  Subject *
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
                  Teacher *
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
                  Schedule Date *
                </FormLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  required
                  value={formDetails.start_date}
                  onChange={(e) =>
                    handleFormChange("start_date", e.target.value)
                  }
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              ></div>
            </div>
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Add Question’s*
              </Typography>
              <div className={`${classes.w75}`}>
                {quillInputs.map((input) => (
                  <div
                    key={input.id}
                    className={`${classes.borderradius16} ${classes.boxShadow6} ${classes.borderLeft4px} ${classes.px2} ${classes.mt2} ${classes.py1} ${classes.p2_2} `}
                  >
                    <ReactQuill
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                      value={input.question}
                      onChange={(question) =>
                        handleInputChange(input.id, question)
                      }
                      placeholder={`Q.${input.id} Type here`}
                      modules={quillModules}
                      formats={quillFormats}
                    />
                  </div>
                ))}
                <div
                  className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt0_5}`}
                >
                  <Button
                    onClick={handleAddInput}
                    style={{ marginRight: "1rem" }}
                    className={classes.addmorebtn}
                  >
                    Add More
                  </Button>
                  {quillInputs.length > 1 && (
                    <Button
                      onClick={() =>
                        handleRemoveInput(
                          quillInputs[quillInputs.length - 1].id
                        )
                      }
                      className={classes.removebtn}
                    >
                      Remove
                    </Button>
                  )}
                </div>
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
