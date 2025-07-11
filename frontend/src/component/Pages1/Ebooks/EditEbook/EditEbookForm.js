import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import UploadButtonsBook from "../../../CustomComponent/UploadButtonBook";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "../../../../styles";
import { decryptData } from "../../../../crypto";
import CloseIcon from "@material-ui/icons/Close";

function EditEbookForm() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [formDetails, setFormDetails] = useState({
    ebook_name: "",
    code: "",
    sub_heading: "",
    description: "",
    author: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [batches, setBatches] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState(null);

  const handleCourceChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
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

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/admin/ebooks");
  };

  const handleThumbnailImageChange = (image) => {
    setThumbnailImage(image);
  };

  const handleFormSubmit = async () => {
    if (!formDetails.ebook_name.trim()) {
      toast.warn("Please enter E-book name.");
      return;
    }

    if (!formDetails.code.trim()) {
      toast.warn("Please enter code.");
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
      toast.warn("Please select a subject.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "ebook",
        JSON.stringify({
          id: rowId,
          name: formDetails.ebook_name,
          code: formDetails.code,
          course_id: selectedCourse,
          batch_id: selectedBatch,
          subject: selectedSubject,
          sub_heading: formDetails.sub_heading,
          description: formDetails.description,
        })
      );

      images.forEach((image) => {
        formData.append("files", image);
      });

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebooks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      // Assuming the response includes the ebook ID and indicates success
      if (
        response.data &&
        response.data.success &&
        response.data.ebook &&
        response.data.ebook.id
      ) {
        toast.success("Ebook updated successfully!");

        // After the ebook has been successfully added and you have its ID
        const ebookId = response.data.ebook.id; // Assuming this is how you get the ebook ID

        // Navigate with a 2-second delay and pass the ebook_id in state
        setTimeout(() => {
          navigate(`/admin/ebooksuploadplans/${ebookId}`, {
            state: { ebook_id: ebookId },
          });
        }, 2000);
      } else {
        toast.error("Ebook added, but encountered an issue with navigation.");
      }
    } catch (error) {
      console.error("Error in updating ebook:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add ebook. Please try again.");
      }
    }
  };

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    const newImagePreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(newImagePreviews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, idx) => idx !== index);
    setImages(newImages);

    const newImagePreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(newImagePreviews);
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebooks/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        const ebook = response.data.ebook;

        // Setting the form details
        setFormDetails({
          ebook_name: ebook.name,
          code: ebook.code,
          sub_heading: ebook.sub_heading,
          description: ebook.description,
          author: ebook.author,
        });

        // Assuming the fetchCourses, fetchBatches, and fetchSubjects effects
        // run after this and use setSelectedCourse, setSelectedBatch, setSelectedSubject to set initial values
        setSelectedCourse(ebook.course_id);
        setSelectedBatch(ebook.batch_id);
        setSelectedSubject(ebook.subjects.map((subject) => subject.id));

        // Handling images - setting them as previews
        setImagePreviews(ebook.images);
      } else {
        toast.error("Failed to fetch ebook details.");
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
      toast.error("An error occurred while fetching ebook details.");
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
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh75}`}
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
                E-Book Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  E-Book Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  value={formDetails.ebook_name}
                  onChange={(e) =>
                    handleFormChange("ebook_name", e.target.value)
                  }
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
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
                  value={formDetails.code}
                  onChange={(e) => handleFormChange("code", e.target.value)}
                />
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24} `}
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
                        {c.course_name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24} `}
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
                    batches.map((batch) => (
                      <MenuItem key={batch.id} value={batch.id}>
                        {batch.batch_name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24} `}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight} `}
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
                    subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.subject_name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween}  ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Sub - Heading
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  value={formDetails.sub_heading}
                  onChange={(e) =>
                    handleFormChange("sub_heading", e.target.value)
                  }
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Author
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  value={formDetails.author}
                  onChange={(e) => handleFormChange("author", e.target.value)}
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween}  ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div className={` ${classes.mt1} ${classes.w75} ${classes.border1} ${classes.borderradius6px} ${classes.p0_2}`}>
                <FormLabel>Thumbnail</FormLabel>
                <div className={classes.uploadinner}>
                  <div className={classes.imagePreviewContainer}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className={classes.imagePreview}>
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          style={{ width: "100px", height: "100px" }}
                        />
                        <CloseIcon
                          className={classes.closeIcon}
                          onClick={() => removeImage(index)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Place the button outside the imagePreviewContainer to position it at the end */}
                  <div className={classes.uploadButtonContainer}>
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file-multiple"
                      multiple
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="contained-button-file-multiple">
                      <Button
                        variant="contained"
                        component="span"
                        className={classes.uploadButton}
                      >
                        Upload Images
                      </Button>
                    </label>
                  </div>
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
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight} `}
                >
                  Description
                </FormLabel>
                <TextField
                  value={formDetails.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  multiline
                  rows={6}
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

export default EditEbookForm;
