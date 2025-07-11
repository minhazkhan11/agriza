import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import { Autocomplete } from "@material-ui/lab";

function AddRackPointForm() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  // const [name, setName] = useState("");
  const [pin, setPin] = useState([]);
  const [selectedPin, setSelectedPin] = useState("");
  const [selectedPinId, setSelectedPinId] = useState("");

  const [place, setPlace] = useState([
    { rack_point: "", rack_point_distanse: "" },
  ]);

  const handleAddLink = () => {
    setPlace((prevLinks) => [
      ...prevLinks,
      { rack_point: "", rack_point_distanse: "" },
    ]);
  };

  const handleRemoveLink = (index) => {
    setPlace((prevLinks) => {
      const updatedLinks = [...prevLinks];
      updatedLinks.splice(index, 1);
      return updatedLinks;
    });
  };

  const handleFormChange = (index, fieldName, value) => {
    const updatedRows = [...place];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setPlace(updatedRows);
  };

  const handlePinChange = (event, newValue) => {
    setSelectedPin(newValue);
    setSelectedPinId(newValue.id);
  };

  const handleClose = () => {
    navigate("/rack-point-list");
  };

  const handleFormSubmit = () => {
    const selectedPinString = String(selectedPin);


    if (!selectedPinString.trim()) {
      toast.warn("Please select a Place.");
      return;
    }
    if (place.some((t) => !t.rack_point.trim())) {
      toast.warn("Please enter Rack Point Name.");
      return;
    }
    if (place.some((t) => !t.rack_point_distanse.trim())) {
      toast.warn("Please enter Rack Point Distance.");
      return;
    }


    const data = {
      place_id: selectedPinId,
      rakepoints: place,
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/rack_point/add`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        toast.success("Rack Point Created Successfully");
        setTimeout(() => {
          navigate("/rack-point-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchPin = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.place) {
        setPin(response.data.place);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPin();
  }, []);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.flexwrapwrap}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Place Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Place <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={pin || []}
                  value={selectedPin}
                  onChange={handlePinChange}
                  disableClearable
                  getOptionLabel={(option) => option.place_name}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type to pick..."
                      variant="outlined"
                      {...params}
                    />
                  )}
                  selectOnFocus
                  openOnFocus
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.w100}`}
            >
              <div
                className={`${classes.dflex} ${classes.w24} ${classes.justifyspacebetween} ${classes.flexwrapwrap}`}
              >
                <Typography
                  className={` ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  Rack Point Details
                </Typography>
              </div>

              <div
                className={`${classes.w74} ${classes.dflex}  ${classes.flexwrapwrap}`}
              >

                {place.map((link, index) => (
                  <>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mr0_5}  ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Rack Point Name{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      {/* <TextField
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Name"
                    /> */}

                      <TextField
                        onChange={(e) =>
                          handleFormChange(index, "rack_point", e.target.value)
                        }
                        value={link.rack_point}
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Name"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {place.length >= 2 && (
                                <IconButton
                                  aria-label="toggle Remove"
                                  onClick={() => handleRemoveLink(index)}
                                  edge="end"
                                >
                                  <IndeterminateCheckBoxOutlinedIcon />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mr0_5}  ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Rack Point Distance{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      {/* <TextField
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Name"
                    /> */}

                      <TextField
                        onChange={(e) =>
                          handleFormChange(
                            index,
                            "rack_point_distanse",
                            e.target.value
                          )
                        }
                        value={link.rack_point_distanse}
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Name"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {place.length >= 2 && (
                                <IconButton
                                  aria-label="toggle Remove"
                                  onClick={() => handleRemoveLink(index)}
                                  edge="end"
                                >
                                  <IndeterminateCheckBoxOutlinedIcon />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <div
                      className={`${classes.inputcontainer} ${classes.justifyflexend} ${classes.dflex}`}
                    >
                      <IconButton onClick={handleAddLink}>
                        <AddBoxOutlinedIcon />
                      </IconButton>
                    </div>
                    {place.length >= 2 && (
                      <div
                        className={`${classes.inputcontainer} ${classes.justifyflexend} ${classes.dflex}`}
                      >
                        <IconButton onClick={() => handleRemoveLink(index)}>
                          <IndeterminateCheckBoxOutlinedIcon />
                        </IconButton>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              onClick={handleClose}
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
export default AddRackPointForm;
