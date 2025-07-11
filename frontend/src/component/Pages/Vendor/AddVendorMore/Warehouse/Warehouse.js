import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
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
import { useLocation } from "react-router-dom";
import AddMoreAndRemoveButton from "../../../../CustomComponent/AddMoreAndRemoveButton";
import { Autocomplete } from "@material-ui/lab";

function Warehouse({ setValue, businessEntityId }) {
  const classes = useStyles();

  const { state } = useLocation();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const bankDetails = state?.be_warehouse_information;

  const initialData =
    bankDetails && bankDetails.length > 0
      ? bankDetails.map((exp) => ({
          name: exp?.name || "",
          address: exp?.address || "",
          latitude: exp?.latitude || "",
          longitude: exp?.longitude || "",
          pincode_id: exp?.pincode_id || "",
          place_id: exp?.place_id || "",
          ship_info: exp?.ship_info || "",
          gst_id: exp?.gst_id || "",
          be_information_id: businessEntityId,
        }))
      : [
          {
            name: "",
            address: "",
            latitude: "",
            longitude: "",
            pincode_id: "",
            place_id: "",
            ship_info: "",
            gst_id: "",
            be_information_id: businessEntityId,
          },
        ];

  const [gst, setGst] = useState([]);
  const [pin, setPin] = useState([]);
  const [place, setPlace] = useState([]);
  const [rDistrictStateTehsil, setRDistrictStateTehsil] = useState([]);
  const [formDetails, setFormDetails] = useState(initialData);

  const handleAddRow = () => {
    setFormDetails([
      ...formDetails,
      {
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        pincode_id: "",
        place_id: "",
        ship_info: "",
        gst_id: "",
        be_information_id: businessEntityId,
      },
    ]);
  };

  const handleRemoveRow = () => {
    setFormDetails((prevRows) => {
      if (prevRows.length > 1) {
        return prevRows.slice(0, -1);
      }
      return prevRows;
    });
  };

  const handleRowChange = (index, fieldName, value) => {
    const updatedRows = [...formDetails];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setFormDetails(updatedRows);
  };

  const handleClose = () => {
    setValue(4);
  };

  const handleFormSubmit = () => {
    // if (!formDetails.bank_name.trim()) {
    //   toast.warn("Please enter a name.");
    //   return;
    // }
    // if (!formDetails.branch.trim()) {
    //   toast.warn("Please enter a description.");
    //   return;
    // }

    const data = {
      warehouse_information: formDetails,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/vendor_warehouse_details/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Vendor Warehouse Updated Successfully");
        setTimeout(() => {
          setValue(4);
        }, 1000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchGST = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_gst_details/be_id/${businessEntityId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.be_gst_details) {
        setGst(response.data.be_gst_details);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchGST();
  }, []);

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

  const fetchRDistrictStateTehsil = async (index, pinId) => {
    if (!pinId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${pinId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setRDistrictStateTehsil((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.pin;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching Place: ", error);
    }
  };

  useEffect(() => {
    formDetails.forEach((data, index) => {
      if (data.pincode_id) {
        fetchRDistrictStateTehsil(index, data.pincode_id);
      }
    });
  }, [formDetails]);

  const fetchPlace = async (index, pinId) => {
    if (!pinId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${pinId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setPlace((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.place;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching Place: ", error);
    }
  };

  useEffect(() => {
    formDetails.forEach((data, index) => {
      if (data.pincode_id) {
        fetchPlace(index, data.pincode_id);
      }
    });
  }, [formDetails]);

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
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}  ${classes.maxh68}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div className={` `}>
            {formDetails.map((row, index) => (
              <div
                key={index}
                className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
              >
                {" "}
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween}`}
                >
                  <Typography
                    className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    GST Number
                  </Typography>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <Autocomplete
                      id="state-autocomplete"
                      options={gst || []}
                      onChange={(event, newValue) =>
                        handleRowChange(index, "gst_id", newValue.id)
                      }
                      disableClearable
                      value={gst.find((sub) => sub.id === row.gst_id)}
                      getOptionLabel={(option) => option.gst_number}
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
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <Typography
                    className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    Warehouse Information
                  </Typography>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Warehouse Name{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleRowChange(index, "name", e.target.value)
                      }
                      value={row.name}
                      name="category_name"
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Type Here"
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
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Warehouse Address{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleRowChange(index, "address", e.target.value)
                      }
                      value={row.address}
                      name="address"
                      type="text"
                      multiline
                      rows={4}
                      variant="outlined"
                      required
                      placeholder="Type Here"
                      // fullWidth
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
                  ></Typography>
                  {rDistrictStateTehsil[index]?.state && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        State
                      </FormLabel>

                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={rDistrictStateTehsil[index]?.state?.state_name}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={rDistrictStateTehsil[index]?.state?.state_name}
                        >
                          {rDistrictStateTehsil[index]?.state?.state_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {rDistrictStateTehsil[index]?.district && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        District
                      </FormLabel>

                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={
                          rDistrictStateTehsil[index]?.district?.district_name
                        }
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={
                            rDistrictStateTehsil[index]?.district?.district_name
                          }
                        >
                          {" "}
                          {rDistrictStateTehsil[index]?.district?.district_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {rDistrictStateTehsil[index]?.tehsil && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Tehsil
                      </FormLabel>

                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={rDistrictStateTehsil[index]?.tehsil?.tehsil_name}
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={
                            rDistrictStateTehsil[index]?.tehsil?.tehsil_name
                          }
                        >
                          {rDistrictStateTehsil[index]?.tehsil?.tehsil_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Pincode <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      id="state-autocomplete"
                      options={pin || []}
                      onChange={(event, newValue) =>
                        handleRowChange(index, "pincode_id", newValue.id)
                      }
                      disableClearable
                      value={pin.find((sub) => sub.id === row.pincode_id)}
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
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Place <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      id="state-autocomplete"
                      options={place[index] || []}
                      onChange={(event, newValue) =>
                        handleRowChange(index, "place_id", newValue.id)
                      }
                      disableClearable
                      value={place.find((sub) => sub.id === row.place_id)}
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Latitude
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleRowChange(index, "latitude", e.target.value)
                      }
                      value={row.latitude}
                      name="latitude"
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Type Here"
                      onKeyDown={(e) => {
                        if (
                          e.key !== "Backspace" &&
                          e.key !== "Delete" &&
                          !/^\d$/.test(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Longitude <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleRowChange(index, "longitude", e.target.value)
                      }
                      value={row.longitude}
                      name="category_name"
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Type Here"
                    />
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24} ${classes.mt1_5}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Above Details is also Ship To Party Detail
                    </FormLabel>
                    <RadioGroup
                      className={`${classes.radiocolor}`}
                      row
                      aria-label="is Gst"
                      name="is Gst"
                      value={row.ship_info}
                    >
                      <FormControlLabel
                        value="yes"
                        control={
                          <Radio
                            onChange={(e) =>
                              handleRowChange(index, "ship_info", "yes")
                            }
                            // onClick={() => setShipToParty("yes")}
                            // disabled
                          />
                        }
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={
                          <Radio
                            // onClick={() => setShipToParty("no")}
                            onChange={(e) =>
                              handleRowChange(index, "ship_info", "no")
                            }
                            //  disabled
                          />
                        }
                        label="No"
                      />
                    </RadioGroup>
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                  ></div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                  ></div>
                </div>
              </div>
            ))}
            {formDetails.length && (
              <div className={`${classes.dflex} ${classes.justifyflexend}`}>
                <AddMoreAndRemoveButton
                  handleAdd={handleAddRow}
                  handleRemove={handleRemoveRow}
                  data={formDetails}
                />
              </div>
            )}
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Skip
            </Button>
            <Button
              className={`${classes.custombtnblue}`}
              onClick={handleFormSubmit}
            >
              Next
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default Warehouse;
