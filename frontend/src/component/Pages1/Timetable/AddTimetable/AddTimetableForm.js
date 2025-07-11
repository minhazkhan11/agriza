import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { ReactComponent as NameIcon } from "../../../images/learnersimage/nameicon.svg";
import { ReactComponent as PhoneIcon } from "../../../images/learnersimage/phoneicon.svg";
import UploadButtons from "../../../CustomComponent/UploadButton";
import useStyles from "../../../../styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddTimetableForm() {
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
    start_date: "",
    end_date: "",
    total_days_available: "",
    total_training_days: "",
    sundays: "",
    holidays: "",
  };

  const [formDetails, setFormDetails] = useState(initialData);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    // Calculate and set the initial total days available
    calculateTotalDaysAvailable();
  }, [formDetails.start_date, formDetails.end_date]);

  const calculateTotalDaysAvailable = () => {
    const { start_date, end_date } = formDetails;
    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24); // milliseconds to days
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        total_days_available: differenceInDays.toString(),
      }));
    }
  };

  const handleCancel = () => {
    navigate("/admin/timetable");
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.batches) {
        setBatches(response?.data?.batches);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleFormSubmit = async () => {
    if (!selectedBatch) {
      toast.warn("Please select a batch.");
      return;
    }

    if (!formDetails?.start_date?.trim()) {
      toast.warn("Please choose start date.");
      return;
    }

    if (!formDetails?.end_date?.trim()) {
      toast.warn("Please choose end date.");
      return;
    }

    if (!formDetails?.total_days_available?.trim()) {
      toast.warn("Please enter total days available.");
      return;
    }
    
    
    if (formDetails?.total_training_days) {
      const totalDaysAvailable = parseInt(formDetails.total_days_available);
      const totalTrainingDays = parseInt(formDetails.total_training_days);
      console.log("totalTrainingDays", totalTrainingDays);
      if(totalTrainingDays > totalDaysAvailable ){
        toast.warn("Total training days should not be greater than total available days.");
        return;
      }
    }
    else{
      toast.warn("Please enter total training days.");
      return;
    }
    if (!formDetails?.sundays?.trim()) {
      toast.warn("Please enter sundays.");
      return;
    }
    if (!formDetails?.holidays?.trim()) {
      toast.warn("Please enter holidays.");
      return;
    }
    if (!formDetails?.total_training_days?.trim()) {
      toast.warn("Please enter total training days.");
      return;
    }

    try {
      const timetableData = {
        timetables: {
          batch_id: selectedBatch,
          start_date: formDetails.start_date,
          end_date: formDetails.end_date,
          total_days_available: formDetails.total_days_available,
          total_training_days: formDetails.total_training_days,
          sunday: formDetails.sundays,
          holiday: formDetails.holidays,
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/timetable/add`,
        timetableData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Timetable created successfully!");
        setTimeout(() => {
          navigate(
            `/admin/timetablesettings/${response?.data?.timetables?.id}`
          );
        }, 2000);
      } else {
        toast.error(`Timetable is not created! ${response.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Timetable is not created!");
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
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
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
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  End Date <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  required
                  value={formDetails.end_date}
                  onChange={(e) => handleFormChange("end_date", e.target.value)}
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
                Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Total Days Available{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  InputProps={{
                    readOnly: true,
                  }}
                  onChange={(e) =>
                    handleFormChange("total_days_available", e.target.value)
                  }
                  value={formDetails.total_days_available}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Total Training Days{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  onChange={(e) =>
                    handleFormChange("total_training_days", e.target.value)
                  }
                  value={formDetails.total_training_days}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Sundays <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  onChange={(e) => handleFormChange("sundays", e.target.value)}
                  value={formDetails.sundays}
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
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Holidays <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  onChange={(e) => handleFormChange("holidays", e.target.value)}
                  value={formDetails.holidays}
                />
              </div>

              <div className={`${classes.w24} ${classes.mt1_5}`}></div>
              <div className={`${classes.w24} ${classes.mt1_5}`}></div>
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
export default AddTimetableForm;
