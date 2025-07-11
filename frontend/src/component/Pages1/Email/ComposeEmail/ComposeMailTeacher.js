import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  Modal,
  Backdrop,
} from "@material-ui/core";
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import ReactQuill from "react-quill";
import { Autocomplete } from "@material-ui/lab";
import ConfirmationPopup from "./ConfirmationPopup";

function ComposeMailTeacher() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };
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
  const initialData = {
    subject: "",
    message: "",
    schedule_date: "",
    schedule_time: "",
  };

  const [formDetails, setFormDetails] = useState(initialData);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [open, setOpen] = useState(false);
  const [sendLater, setSendLater] = useState(false);
  const [fetchedTemplates, setFetchedTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleSendLaterChange = (event) => {
    setSendLater(event.target.checked);
  };

  const handleCourceChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedBatch("");
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const handleTeacherChange = (event, value) => {
    setSelectedTeacher(value);
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

  const fetchTeachers = async (selectedCourse, selectedBatch) => {
    const requestData = {
      user: {
        course_id: selectedCourse,
        batch_id: selectedBatch,
      },
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch/by_all_teachers/teacher`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && response.data.teachers) {
        setTeachers(response.data.teachers);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers(selectedCourse, selectedBatch, decryptedToken);
  }, [selectedCourse, selectedBatch]);

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleTemplateMessage = (event) => {
    const value = event.target.value;
    setSelectedTemplate(value);
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      message: value.message,
    }));
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/textsms/template/textsms`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

        // Ensure that the API response contains the 'batch' property
        if (response.data && response.data.template) {
          setFetchedTemplates(response.data.template);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchTemplate();
  }, [decryptedToken]);

  const handleCancel = () => {
    navigate("/admin/email");
  };

  const handleOpenClose = () => {
    if (!formDetails.subject) {
      toast.warn("Please Enter Subject.");
      return;
    }

    if (!formDetails.message) {
      toast.warn("Please Enter Message.");
      return;
    }

    if (sendLater && !formDetails.schedule_date) {
      toast.warn("Please Enter Schedule Date.");
      return;
    }

    if (sendLater && !formDetails.schedule_time) {
      toast.warn("Please Enter Schedule Time.");
      return;
    }

    setOpen(!open);
  };

  const handleFormSubmit = async () => {
    const emailArray = selectedTeacher.length === 0
  ? teachers.map((teachers) => teachers.email)
  : selectedTeacher.map((teachers) => teachers.email);
    const data = {
      email: {
        send_later: sendLater,
        message: formDetails.message,
        subject: formDetails.subject,
        date: sendLater ? formDetails.schedule_date : null,
        time: sendLater ? formDetails.schedule_time : null,
        to: emailArray.join(", "),
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/mail/compose`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTimeout(() => {
          handleOpenClose();
          navigate("/admin/email");
        }, 2000);
        toast.success("Email Sent Successfully");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.h57vh}`}
      >
        <div className={`${classes.boxshadow3} ${classes.bgwhite}`}>
          <TableViewSearch
          // Heading={Heading}
          //  onSearch={handleSearch}
          />
        </div>
        <FormControl className={`${classes.w100} ${classes.mt1}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow4} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Recipient’s
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
              ${classes.lineheight}`}
                >
                  Course
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state_id"
                  value={selectedCourse}
                  onChange={handleCourceChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Course
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  Batch
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state_id"
                  value={selectedBatch}
                  onChange={handleBatchChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Batch
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
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Email
                </FormLabel>

                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={teachers || []}
                  getOptionLabel={(option) =>
                    `${option?.full_name} - ${option?.email}`
                  }
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick Email..."
                      {...params}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={`${option?.full_name}\n${option?.email}`}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  Template
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state_id"
                  value={selectedTemplate}
                  onChange={handleTemplateMessage}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Template
                  </MenuItem>
                  {fetchedTemplates &&
                    fetchedTemplates.map((st) => (
                      <MenuItem key={st.id} value={st}>
                        {st.name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
               <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Subject <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Type Here"
                  onChange={(e) => handleFormChange("subject", e.target.value)}
                  required
                  name="subject"
                  value={formDetails.subject}
                />
              </div>
            </div>

            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt2}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              >
                Content*
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Message
                </FormLabel>
                <ReactQuill
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                  value={formDetails.message}
                  onChange={(value) => {
                    handleFormChange("message", value);
                  }}
                  placeholder="Type here"
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
            </div>

            <div className={` ${classes.w100} ${classes.dflex}`}>
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}`}
              >
                <FormControlLabel
                  value={sendLater}
                  control={
                    <Checkbox
                      color="primary"
                      checked={sendLater}
                      onChange={handleSendLaterChange}
                    />
                  }
                  label="Send Later"
                  labelPlacement="end"
                />
              </div>
            </div>
            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Schedule Date
                </FormLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  required
                  disabled={!sendLater}
                  value={formDetails.schedule_date}
                  onChange={(e) =>
                    handleFormChange("schedule_date", e.target.value)
                  }
                  placeholder="Select Date"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Schedule Time
                </FormLabel>
                <TextField
                  type="time"
                  variant="outlined"
                  required
                  disabled={!sendLater}
                  value={formDetails.schedule_time}
                  onChange={(e) =>
                    handleFormChange("schedule_time", e.target.value)
                  }
                  placeholder="Type Here"
                />
              </div>
            </div>
            <div className={` ${classes.w100} ${classes.dflex} ${classes.mt1}`}>
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div>
                <Typography
                  className={`${classes.fontfamilyDMSans} ${classes.fontsize4}`}
                  variant="h6"
                  display="inline"
                >
                  Dynamic Tag :-{" "}
                </Typography>
                <Typography
                  className={` ${classes.fontfamilyoutfit} ${classes.fontsize6}`}
                  variant="h6"
                  display="inline"
                >
                  {`{name}, {email}, {mobile}`}
                </Typography>
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt2}`}
            >
              <Button
                onClick={handleCancel}
                className={`${classes.custombtnoutline} ${classes.mr1}`}
              >
                Cancel
              </Button>
              <Button
                  onClick={handleOpenClose}
                className={`${classes.custombtnblue}`}
              >
                Send
              </Button>
            </div>
          </div>
        </FormControl>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={`${classes.dflex} ${classes.alignitemscenter}${classes.justifycenter}`}
        open={open}
        onClose={handleOpenClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <ConfirmationPopup
          handleOpenClose={handleOpenClose}
          selectedCourse={selectedCourse}
          selectedLearner={selectedTeacher}
          learners={teachers}
          open={open}
          handleFormSubmit={handleFormSubmit}
        />
      </Modal>
    </>
  );
}
export default ComposeMailTeacher;
