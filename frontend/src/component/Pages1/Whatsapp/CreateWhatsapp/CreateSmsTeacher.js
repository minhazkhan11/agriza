import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
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
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import { Autocomplete } from "@material-ui/lab";
import ReactQuill from "react-quill";

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
];

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

function CreateSmsTeacher() {
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
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [sendLater, setSendLater] = React.useState(false);

  const handleSendLaterChange = () => {
    setSendLater(!sendLater);
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/admin/whatsapp");
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedBatch("");
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

  const handleFormSubmit = async () => {};

  // const Heading = [
  //   {
  //     id: 1,
  //     inputlable: "Enter Course",
  //     inputplaceholder: "Search By Course Name",
  //     exportimport: "yes",
  //   },
  // ];

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
                  Campaign Name
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  // onChange={(e) => setClientName(e.target.value)}
                  // value={clientName}
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              ></div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Enter Teacher Number or leave blank for all
                </FormLabel>

                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={top100Films}
                  getOptionLabel={(option) => option.title}
                  // value={subjects.filter((sub) =>
                  //   selectedSubject.includes(sub.id)
                  // )}
                  // onChange={handleSubjectChange}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick Number..."
                      {...params}
                    />
                  )}
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
                  // value={selectedBatch}
                  // onChange={handleBatchChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Template
                  </MenuItem>
                  {/* {batches &&
                    batches.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.batch_name}
                      </MenuItem>
                    ))} */}
                  <MenuItem>sjdhf</MenuItem>
                </Select>
              </div>
            </div>

            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Content*
              </Typography>
              <div className={`${classes.w75}`}>
                <div
                  className={`${classes.borderradius16} ${classes.boxShadow6} ${classes.borderLeft4px} ${classes.px2} ${classes.mt2} ${classes.py1} ${classes.p2_2} `}
                >
                  <ReactQuill
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                    // value={input.question}
                    // onChange={(question) =>
                    //   handleInputChange(input.id, question)
                    // }
                    placeholder={`Type here`}
                    modules={quillModules}
                    formats={quillFormats}
                  />
                </div>
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
                  disabled={!sendLater}
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
                  value={formDetails.start_time}
                  onChange={(e) =>
                    handleFormChange("start_time", e.target.value)
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
                onClick={handleFormSubmit}
                className={`${classes.custombtnblue}`}
              >
                send
              </Button>
            </div>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default CreateSmsTeacher;
