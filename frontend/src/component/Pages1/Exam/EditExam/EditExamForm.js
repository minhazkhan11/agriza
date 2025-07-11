import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormHelperText,
} from "@material-ui/core";
import UploadButtons from "../../../CustomComponent/UploadButton";
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import content from "./instructioncontent";
import Autocomplete from "@material-ui/lab/Autocomplete";

function EditExamForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { rowId } = useParams();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  function convertToHtml(languageContent) {
    let htmlContent = "";

    for (let i = 0; i < languageContent.length; i++) {
      let section = languageContent[i];
      htmlContent += `<h2>${section.superhead}</h2>`;
      htmlContent += `<h3>${section.genhead}</h3>`;
      htmlContent += `<p style="color: red;">${section.rednote}</p>`;
      htmlContent += `<p>${section.agreement}</p>`;

      for (let j = 0; j < section.gencont.length; j++) {
        let item = section.gencont[j];
        htmlContent += `<div><b>${item.id}.</b> ${item.title}`;

        if (item.children) {
          htmlContent += "<ul>";
          for (let k = 0; k < item.children.length; k++) {
            let child = item.children[k];
            htmlContent += `<li>${child.title}</li>`;
          }
          htmlContent += "</ul>";
        }

        htmlContent += "</div>";
      }
    }

    return htmlContent;
  }

  const instructionsHtml = convertToHtml(content);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const initialData = {
    course_id: "",
    batch_id: "",
    exam_name: "",
    language: ["en"],
    question_count: "",
    total_score: "",
    question_shuffle: "no",
    negative_marking: "no",
    negative_marking_score: "",
    exam_instant_result: "no",
    exam_pin: "",
    exam_instructions: {
      en: convertToHtml(content.en),
      hi: convertToHtml(content.hi),
    },
    duration: "",
    start_date: "",
    start_time: "",

    file: null,
  };

  const [formDetails, setFormDetails] = useState(initialData);
  const [examName, setExamName] = useState("");

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState([]);

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState(null);

  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const handleLanguageMenuToggle = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };

  const [perQuestionMarks, setPerQuestionMarks] = useState("0");

  useEffect(() => {
    if (formDetails.question_count && formDetails.total_score) {
      const calculatedMarks =
        formDetails.total_score / formDetails.question_count;
      setPerQuestionMarks(calculatedMarks.toFixed(2));
    }
  }, [formDetails.question_count, formDetails.total_score]);

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

  const handleFormChange = (fieldName, value) => {
    if (fieldName === "language") {
      const newInstructions = { ...formDetails.exam_instructions };
      (typeof value === "string" ? value.split(",") : value).forEach((lang) => {
        if (!newInstructions[lang]) {
          newInstructions[lang] = "";
        }
      });
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        [fieldName]: typeof value === "string" ? value.split(",") : value,
        exam_instructions: newInstructions,
      }));
    } else {
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        [fieldName]: value,
      }));
    }
  };

  const handleThumbnailImageChange = (image) => {
    setThumbnailImage(image);
  };

  const handleCourceChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue.map((subject) => subject.id));
  };

  const handleCancel = () => {
    navigate("/admin/exam");
  };

  const handleFormSubmit = async () => {
    if (!examName.trim()) {
      toast.warn("Please enter an exam name.");
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

    if (!formDetails.question_count) {
      toast.warn("Please enter the number of questions.");
      return;
    }

    if (!formDetails.total_score) {
      toast.warn("Please enter the total score.");
      return;
    }

    if (!formDetails.exam_pin) {
      toast.warn("Please enter the exam pin.");
      return;
    }

    if (!formDetails.duration) {
      toast.warn("Please enter the duration of the exam.");
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
      const examData = {
        id: rowId,
        course_id: selectedCourse,
        batch_id: selectedBatch,
        subjects: selectedSubject,
        exam_name: examName,
        language: formDetails.language.map((lang) =>
          lang === "en" ? "en" : "hi"
        ),
        question_count: formDetails.question_count,
        total_score: formDetails.total_score,
        per_question_mark: perQuestionMarks,
        question_shuffle: formDetails.question_shuffle,
        negative_marking: formDetails.negative_marking,
        negative_marking_score: formDetails.negative_marking_score,
        exam_instant_result: formDetails.exam_instant_result,
        exam_pin: formDetails.exam_pin,
        exam_instruction_en: formDetails.exam_instructions.en,
        exam_instruction_hi: formDetails.exam_instructions.hi,
        duration: formDetails.duration,
        start_date: formDetails.start_date,
        start_time: formDetails.start_time,
      };

      formData.append("exam", JSON.stringify(examData));
      formData.append("file", thumbnailImage);

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Exam updated successfully!");

        setTimeout(() => {
          navigate(`/admin/addquestion/${response.data.exam.id}`);
        }, 2000);
      } else {
        toast.error(`Exam is not updated! ${response.data.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Exam is not updated!");
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

  function formatTime(timeString) {
    // Extract hours and minutes from the time string
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  }

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        const exam = response.data.exam;

        // Convert the incoming date string to a Date object
        const incomingDate = new Date(exam.start_date);

        // incomingDate.setDate(incomingDate.getDate() + 1);
        incomingDate.setDate(incomingDate.getDate());

        // Format the date to 'YYYY-MM-DD' string
        const startDate = incomingDate.toISOString().split("T")[0];
        const startTime = formatTime(exam.start_time);

        setFormDetails({
          ...formDetails,
          course_id: exam.course_id,
          batch_id: exam.batch_id,
          exam_name: exam.exam_name,
          language: exam.language.map((lang) => lang.code),
          question_count: exam.question_count,
          per_question_mark: perQuestionMarks,
          total_score: exam.total_score,
          question_shuffle: exam.question_shuffle,
          negative_marking: exam.negative_marking,
          negative_marking_score: exam.negative_marking_score.toString(),
          exam_instant_result: exam.exam_instant_result,
          exam_pin: exam.exam_pin,
          exam_instructions: {
            en: exam.exam_instruction_en,
            hi: exam.exam_instruction_hi,
          },
          duration: exam.duration,
          start_date: startDate,
          start_time: startTime,
        });

        setSelectedCourse(exam.course_id);
        setPerQuestionMarks(exam.per_question_mark);
        setSelectedBatch(exam.batch_id);
        setExamName(exam.exam_name);
        setSelectedSubject(exam.subjects.map((subject) => subject.id));
        setThumbnailImage(exam.image_url);
        setThumbnailImagePreview(exam.image_url);
      } else {
        toast.error("Failed to fetch exam details.");
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
      toast.error("An error occurred while fetching exam details.");
    }
  };

  useEffect(() => {
    if (rowId) {
      fetchDataFromAPI(rowId);
    }
  }, [rowId]);

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1}  ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.h72vh}`}
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
                *Exam Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Exam Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) => setExamName(e.target.value)}
                  value={examName}
                  placeholder="Type Here"
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
                  onChange={handleCourceChange}
                  displayEmpty
                  required
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {courses &&
                    courses.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {console.log("course_name", courses)}
                        {c.course_name}
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
                  required
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
                    batches.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.batch_name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Languages <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  labelId="language-label"
                  id="language"
                  multiple
                  open={languageMenuOpen}
                  onOpen={handleLanguageMenuToggle}
                  onClose={handleLanguageMenuToggle}
                  value={formDetails.language}
                  onChange={(e) => {
                    handleFormChange("language", e.target.value);
                    handleLanguageMenuToggle(); // Close the dropdown after selection
                  }}
                  renderValue={(selected) =>
                    selected
                      .map((code) => (code === "en" ? "English" : "Hindi"))
                      .join(", ")
                  }
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem value="hi">Hindi</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Question Count <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  type="number"
                  variant="outlined"
                  onChange={(e) =>
                    handleFormChange("question_count", e.target.value)
                  }
                  value={formDetails.question_count}
                  placeholder="Type Here"
                />
              </div>

            
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
            >
              <Typography
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                
              </Typography>
              <Typography>
                
              </Typography>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
                <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Total Score <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  onChange={(e) =>
                    handleFormChange("total_score", e.target.value)
                  }
                  value={formDetails.total_score}
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Per Question Mark 
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  value={perQuestionMarks ? `${perQuestionMarks} marks` : "N/A"}
               disabled
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
              
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Question Shuffle <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  labelId="shuffle-label"
                  id="shuffle"
                  value={formDetails.question_shuffle}
                  onChange={(e) =>
                    handleFormChange("question_shuffle", e.target.value)
                  }
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  <MenuItem value={"yes"}>Yes</MenuItem>
                  <MenuItem value={"no"}>No</MenuItem>
                </Select>
              </div>

             
            </div>

            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div className={` ${classes.w49}`}>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Negative Marking <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <Select
                      labelId="negativemarking-label"
                      id="negativemarking"
                      value={formDetails.negative_marking}
                      onChange={(e) =>
                        handleFormChange("negative_marking", e.target.value)
                      }
                      displayEmpty
                      className={classes.selectEmpty}
                      MenuProps={menuProps}
                      variant="outlined"
                    >
                      <MenuItem disabled value="">
                        <em className={classes.defaultselect}>Select Here</em>
                      </MenuItem>
                      <MenuItem value={"yes"}>Yes</MenuItem>
                      <MenuItem value={"no"}>No</MenuItem>
                    </Select>
                  </div>

                  {formDetails.negative_marking === "yes" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Negative Marking Score <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        type="float"
                        variant="outlined"
                        required
                        value={formDetails.negative_marking_score}
                        onChange={(e) =>
                          handleFormChange(
                            "negative_marking_score",
                            e.target.value
                          )
                        }
                        placeholder="Type Here"
                      />
                    </div>
                  )}

                  {formDetails.negative_marking === "no" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Negative Marking Score <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        type="number"
                        variant="outlined"
                        required
                        value={formDetails.negative_marking_score}
                        onChange={(e) =>
                          handleFormChange(
                            "negative_marking_score",
                            e.target.value
                          )
                        }
                        placeholder="Type Here"
                        disabled
                      />
                    </div>
                  )}
                </div>

                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Exam Instant Result <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <Select
                      labelId="exam-instant-result-label"
                      id="exam-instant-result"
                      value={formDetails.exam_instant_result}
                      onChange={(e) =>
                        handleFormChange("exam_instant_result", e.target.value)
                      }
                      displayEmpty
                      className={classes.selectEmpty}
                      MenuProps={menuProps}
                      variant="outlined"
                    >
                      <MenuItem disabled value="">
                        <em className={classes.defaultselect}>Select Here</em>
                      </MenuItem>

                      <MenuItem value={"no"}>No</MenuItem>
                      <MenuItem value={"with_answer"}>With Answers</MenuItem>
                      <MenuItem value={"without_answer"}>
                        Without Answers
                      </MenuItem>
                      {/* <MenuItem value={"section_wise"}>
                        Section Wise Result
                      </MenuItem> */}
                    </Select>
                  </div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Exam PIN <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      type="text"
                      variant="outlined"
                      required
                      placeholder="****"
                      value={formDetails.exam_pin}
                      onChange={(e) =>
                        handleFormChange("exam_pin", e.target.value)
                      }
                      inputProps={{ maxLength: 4 }}
                      error={formDetails.exam_pin.length !== 4}
                      helperText={
                        formDetails.exam_pin.length !== 4
                          ? "Exam PIN must be exactly 4 digits"
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={`${classes.w24} ${classes.mt1_5}`}>
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
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                {formDetails.language.map((lang) => (
                  <div key={lang}>
                    <FormLabel>
                      Enter your Exam Instructions for {lang} language:
                    </FormLabel>
                    <ReactQuill
                      value={formDetails.exam_instructions[lang]}
                      onChange={(content) => {
                        setFormDetails((prev) => ({
                          ...prev,
                          exam_instructions: {
                            ...prev.exam_instructions,
                            [lang]: content,
                          },
                        }));
                      }}
                      modules={quillModules}
                      formats={quillFormats}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                *Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Duration in minutes <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  value={formDetails.duration}
                  onChange={(e) => handleFormChange("duration", e.target.value)}
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Start Date <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  required
                  value={formDetails.start_date}
                  onChange={(e) =>
                    handleFormChange("start_date", e.target.value)
                  }
                  placeholder="Select Date"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Start Time <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="time"
                  variant="outlined"
                  required
                  value={formDetails.start_time}
                  onChange={(e) =>
                    handleFormChange("start_time", e.target.value)
                  }
                  placeholder="Type Here"
                />
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
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default EditExamForm;
