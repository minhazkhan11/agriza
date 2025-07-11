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

function AddPlaceForm() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  // const [name, setName] = useState("");
  const [pin, setPin] = useState([]);
  const [selectedPin, setSelectedPin] = useState("");
  const [selectedPinId, setSelectedPinId] = useState("");

  const [place, setPlace] = useState([{ name: "" }]);

  const handleAddLink = () => {
    setPlace((prevLinks) => [
      ...prevLinks,
      { name: "" }, // Add a new empty link
    ]);
  };

  const handleRemoveLink = (index) => {
    setPlace((prevLinks) => {
      const updatedLinks = [...prevLinks];
      updatedLinks.splice(index, 1);
      return updatedLinks;
    });
  };

  const handlePinChange = (event, newValue) => {
    setSelectedPin(newValue);
    setSelectedPinId(newValue.id);
  };

  const handleClose = () => {
    navigate("/place-list");
  };

  const handleFormSubmit = () => {
    const selectedPinString = String(selectedPin);

    if (place.some((t) => !t.name.trim())) {
      toast.warn("Please enter place name.");
      return;
    }
    if (!selectedPinString.trim()) {
      toast.warn("Please select a Pin.");
      return;
    }

    let placeData = place?.map((val) => val?.name);

    const data = {
      place: {
        place_name: placeData,
        pin_id: selectedPinId,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/add`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        toast.success("Place Created Successfully");
        setTimeout(() => {
          navigate("/place-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchPin = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.pin) {
        setPin(response.data.pin);
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
                Pin Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Pin <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={pin || []}
                  value={selectedPin}
                  onChange={handlePinChange}
                  disableClearable
                  getOptionLabel={(option) => option.pin_code}
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
                  Place Details
                </Typography>
              </div>

              <div
                className={`${classes.w74} ${classes.dflex}  ${classes.flexwrapwrap}`}
              >
                {place.map((link, index) => (
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mr0_5}  ${classes.w32}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Name <span className={classes.textcolorred}>*</span>
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
                      onChange={(e) => {
                        const updatedLinks = [...place];
                        updatedLinks[index].name = e.target.value;
                        setPlace(updatedLinks);
                      }}
                      value={link.name}
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
                ))}
                <div
                  className={`${classes.inputcontainer} ${classes.justifyflexend} ${classes.dflex}`}
                >
                  <IconButton onClick={handleAddLink}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </div>
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
export default AddPlaceForm;
