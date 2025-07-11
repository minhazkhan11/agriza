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
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


function EditBatchForm() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const { rowId } = useParams();

  const navigate = useNavigate();
  const [batchName, setBatchName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState();

  const handleClose = () => {
    navigate("/admin/batch");
  };

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const handleStateChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleFormSubmit = () => {

    if (!batchName.trim()) {
      toast.warn("Please enter a batch name.");
      return;
    }

    const data = {
      batch: {
        id: rowId,
        course_id:selectedCourse ,
        batch_name: batchName,
      },
    };

    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch`,
       data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log("Batch updated successfully", response);
        setTimeout(() => {
          navigate("/admin/batch");
        }, 2000);
        toast.success("Batch updated successfully");
      })
      .catch((error) => {
        console.error("Error changed Batch status:", error);
        toast.error("Batch is not updated");
      });
  };



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/course`, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        });

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
    if (rowId) {
      fetchDataFromAPI(rowId);
    }
  }, [rowId]);

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {

        const data = response.data.batch;

        setSelectedCourse(data.course.id);
        setBatchName(data.batch_name);
    
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };


  return (
    <>
      <ToastContainer />

    <div
      className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}`}
    >
      <FormControl className={`${classes.w100}`}>
        <div
          className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
        >
          <div
            className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
          >
            <Typography
              className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
              variant="h6"
              display="inline"
            >
              Batch Details
            </Typography>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Batch Name <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                onChange={(e) => setBatchName(e.target.value)}
                value={batchName}
                name="category_name"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
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
                onChange={(e) => handleStateChange(e)}
                displayEmpty
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
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
            ></div>
          </div>
        </div>
        <div
          className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
        >
          <Button
            className={`${classes.custombtnoutline}`}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className={`${classes.custombtnblue}`}
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </div>
      </FormControl>
    </div>
    </>
  );
}
export default EditBatchForm;
