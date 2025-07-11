import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  Modal,
  Backdrop
} from "@material-ui/core";
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import { Autocomplete } from "@material-ui/lab";
import ConfirmationPopup from "./ConfirmationPopup";

function CreateSmsTeacher() {
  const CHARACTER_LIMIT = 160;
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

  const initialData = {
    campaign_name: "",
    message: "",
    schedule_date: "",
    schedule_time: "",
  };
  const [open, setOpen] = useState(false);
  const [formDetails, setFormDetails] = useState(initialData);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [fetchedTemplates, setFetchedTemplates] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState([]);
  const [selectedTeacherPhone, setSelectedTeacherPhone] = useState([]);
  const [sendLater, setSendLater] = React.useState(false);

  
  const handleOpenClose = (data) => {
    if (!formDetails.campaign_name) {
      toast.warn("Please Enter Campaign Name.");
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

  const handleSendLaterChange = (e) => {
    setSendLater(!sendLater);

    if (!e.target.checked) {
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        schedule_date: "",
        schedule_time: "",
      }));
    }
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedBatch("");
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };
  const handleTemplateMessage = (event) => {
    const value = event.target.value;
    setSelectedTemplate(value);
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      message: value.message,
    }));
  };
  const handleTeacherChange = (event, value) => {
    setSelectedTeacher(value.map((learner) => learner));
    setSelectedTeacherPhone(value.map((learner) => learner.phone));
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
    if (selectedCourse) {
      fetchBatches(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchLearners = async (
    selectedCourse,
    selectedBatch,
    decryptedToken
  ) => {
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
      fetchLearners(selectedCourse, selectedBatch, decryptedToken);
    }, [selectedCourse, selectedBatch]);

  const handleCancel = () => {
    navigate("/admin/textsms");
  };

  const handleFormSubmit = async () => {
   
    const data = {
      text: {
        type: "teacher",
        campaign_name: formDetails.campaign_name,
        message: formDetails.message,
        date: sendLater ? formDetails.schedule_date : null,
        time: sendLater ? formDetails.schedule_time : null,
        template_id: selectedTemplate.id,
        sender_name:
          selectedTeacher.length === 0
            ? teachers.map((learner) => learner.full_name)
            : selectedTeacher.map((learner) => learner.full_name),
        phone:
          selectedTeacher.length === 0
            ? teachers.map((learner) => learner.phone)
            : selectedTeacher.map((learner) => learner.phone),
        email:
          selectedTeacher.length === 0
            ? teachers.map((learner) => learner.email)
            : selectedTeacher.map((learner) => learner.email),
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/textsms/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          handleOpenClose();
          navigate("/admin/textsms");
        }, 2000);
        toast.success("SMS Sent Successfully");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.h61vh}`}
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
                Campaign Info*
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
              ${classes.lineheight}`}
                >
                  Campaign Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) =>
                    handleFormChange("campaign_name", e.target.value)
                  }
                  value={formDetails.campaign_name}
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              ></div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Teacher*
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
                  onChange={handleCourseChange}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Enter Teacher Number or leave blank for all
                </FormLabel>

                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={teachers || []}
                  getOptionLabel={(option) =>
                    `${option?.full_name} - ${option?.phone}`
                  }
                  value={teachers.filter((teacher) =>
                    selectedTeacherPhone.includes(teacher.phone)
                  )}
                  onChange={handleTeacherChange}
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
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={`${option?.full_name}\n${option?.phone}`}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween}  ${classes.mt2}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Content*
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
              ${classes.lineheight}`}
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

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  SMS Gateway
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state_id"
                  // value={selectedBatch}
                  // onChange={handleBatchChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Batch
                  </MenuItem>
                  {/* {batches &&
                    batches.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.batch_name}
                      </MenuItem>
                    ))} */}
                  <MenuItem>dov soft</MenuItem>
                </Select>
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Message <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  className={`${classes.helpertext}`}
                  value={formDetails.message}
                  onChange={(e) => handleFormChange("message", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  inputProps={{
                    maxlength: CHARACTER_LIMIT,
                    readOnly: selectedTemplate
                  }}
                  helperText={`${formDetails.message.length}/${CHARACTER_LIMIT}`}
                  placeholder="Type Here"
                  multiline
                  rows={6}
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
                  control={<Checkbox color="primary" />}
                  label="Send Later"
                  labelPlacement="end"
                  value={sendLater}
                  checked={sendLater}
                  onChange={handleSendLaterChange}
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
                  disabled={!sendLater}
                  required
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
                  disabled={!sendLater}
                  variant="outlined"
                  required
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
                className={`${classes.custombtnoutline}`}
              >
                Cancel
              </Button>
              <Button
                // onClick={handleFormSubmit}
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
export default CreateSmsTeacher;
