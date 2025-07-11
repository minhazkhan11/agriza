import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useStyles from "../../../../styles";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import UploadButtons from "../../../CustomComponent/UploadButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #C8C8C8",
    fontSize: 16,
    padding: "8px 26px 10px 12px",
    color: "#7A7A7A",
    "&:focus": {
      border: "1px solid rgba(0, 0, 0, 0.87)",
      background: "#FFF",
    },
    "&:hover": {
      border: "1px solid rgba(0, 0, 0, 0.87)",
      background: "#FFF",
    },
  },
}))(InputBase);

const AddOnlineVideoForm = () => {
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
  const [description,setDescription]=useState("");
  const navigate=useNavigate();
  const [code,setCode]=useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [onlinevideo,setOnlineVideo]=useState("");
  const [language,setLanguage]=useState("default");
  const handleCourceChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };
  const handleThumbnailImageChange = (image) => {
    setThumbnailImage(image);
    console.log(image,"image")
  };
  const handleFormSubmit = async () => {
   
    try {
      const formData = new FormData();
      if(!onlinevideo){
        toast.error("Please Enter Video Name");
        return;
      }
      if(!code){
        toast.error("Please Enter Video Code");
        return;
      }
      if(!selectedCourse){
        toast.error("Please Choose Course");
        return;
      }
      if(!selectedBatch){
        toast.error("Please Choose Batch");
        return;
      }
      if(!selectedSubject){
        toast.error("Please Choose Subject");
        return;
      }
      

      formData.append(
        "onlinevideo",
        JSON.stringify({
          name: onlinevideo,
          code: code,
          course_id: selectedCourse,
          batch_id: selectedBatch,
          subject_id: selectedSubject,
          description: description,
          language:language !== "default" ? language : "", 
        })
      );

      
      formData.append("file", thumbnailImage);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/onlinevideo/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.data.success === true) {
        toast.success("Online video added successfully!");
        setTimeout(() => {
          navigate(`/admin/addvideolecture/${response.data.onlinevideo.id}`);
        }, 2000);
      }
    } catch (error) {
      let errorMessage = "Failed to add onlinevideo. Please try again later.";

      // Check if the error response has data and message
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

      console.error("Error adding notes:", error);
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
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Video Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Video Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  value={onlinevideo}
                  required
                  placeholder="Type Here"
                  onChange={(e)=>setOnlineVideo(e.target.value)}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
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
                  onChange={(e)=>setCode(e.target.value)}

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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
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
            <div
              className={`${classes.dflex} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24} ${classes.ml1}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Language
                </FormLabel>
                <FormControl>
                  <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    MenuProps={menuProps}
                    // value={-1}
                    input={<BootstrapInput />}
                    value={language}
                    onChange={(e)=>setLanguage(e.target.value)}
                  >
                  
                    <MenuItem
                      value={"default"}
                      className={`${classes.textplaceholdercolor} `}
                    >
                      Select Here
                    </MenuItem>
                    <MenuItem value={"english"}>English</MenuItem>
                    <MenuItem value={"hindi"}>Hindi</MenuItem>
                  </Select>
                </FormControl>
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

                  onChange={(e) =>
                    setDescription( e.target.value)
                  }
                  placeholder="Type Here"
                  multiline
                  rows={5}
                />
              </div>
              <div className={`${classes.w24} ${classes.mt1_5} ${classes.ml1}`}>
                <UploadButtons
                  onImageChange={handleThumbnailImageChange}
                  thumbnailImage={thumbnailImage}
                  thumbnailImagePreview={thumbnailImagePreview}
                  setThumbnailImagePreview={setThumbnailImagePreview}
                />
              </div>
            </div>
          </div>
          
          <div
            className={`${classes.dflex} ${classes.justifyflexend}  ${classes.mt1} `}
          >
            <Button className={`${classes.custombtnoutline}`} onClick={()=>{navigate("/admin/onlinevideos")}}>Cancel</Button>
            <Button className={`${classes.custombtnblue}`}
            onClick={handleFormSubmit}>
              Save & Continue
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
};

export default AddOnlineVideoForm;
