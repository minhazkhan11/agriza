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
import useStyles from "./styles.js";
import axios from "axios";
import { decryptData } from "./crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function TestingForm() {
  const classes = useStyles();
  const navigate = useNavigate();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const initialData = {
    state_id: "",
    district_id: "",
  };
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [state, setState] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [formDetails, setFormDetails] = useState([
    { state_id: "", district_id: "" },
    { state_id: "", district_id: "" },
    { state_id: "", district_id: "" },
    { state_id: "", district_id: "" },
    { state_id: "", district_id: "" },
  ]);
  const handleFormSubmit = async () => {};

  const handleChange = (index, fieldName, value) => {
    const updatedRows = [...formDetails];
    updatedRows[index] = { ...updatedRows[index], [fieldName]: value };
    setFormDetails(updatedRows);

    if (fieldName === "state_id") {
      fetchDistrict(index, value);
    }
  };

  const fetchDistrict = async (index, stateId) => {
    if (!stateId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/district/state_id/${stateId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setDistrictList((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.district;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching districts: ", error);
    }
  };

  const fetchState = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/state`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      setState(response.data.state);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh75}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            {formDetails.map((row, index) => (
              <div
                key={index}
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
              >
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}`}
                  >
                    State <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Select
                    required
                    value={row.state_id}
                    onChange={(e) =>
                      handleChange(index, "state_id", e.target.value)
                    }
                    displayEmpty
                    className={classes.selectEmpty}
                    variant="outlined"
                  >
                    <MenuItem disabled value="">
                      <em className={classes.defaultselect}>Select Here</em>
                    </MenuItem>
                    {state.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.state_name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}`}
                  >
                    District <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Select
                    required
                    value={row.district_id}
                    onChange={(e) =>
                      handleChange(index, "district_id", e.target.value)
                    }
                    displayEmpty
                    className={classes.selectEmpty}
                    variant="outlined"
                  >
                    <MenuItem disabled value="">
                      <em className={classes.defaultselect}>Select Here</em>
                    </MenuItem>
                    {districtList[index] &&
                      districtList[index].map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.district_name}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <div className={`${classes.dflex} ${classes.justifyflexend}`}>
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
export default TestingForm;
