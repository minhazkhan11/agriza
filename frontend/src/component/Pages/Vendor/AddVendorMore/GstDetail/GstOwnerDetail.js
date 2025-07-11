import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import useStyles from "../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { Autocomplete } from "@material-ui/lab";
import PageHeader from "../../../PageHeader";

function GstOwnerDetail({
  handlePopUp,
  style,
  mainindex,
  handleOwnerDetailsArrayRowChange,
  handleRemoveOwnerDetailsArray,
  row,
  person,
  ownerDetailsindex,
  pin,
  personData,
}) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [place, setPlace] = useState([]);
  const [districtStateTehsil, setDistrictStateTehsil] = useState([]);

  const handleClose = () => {
    handleRemoveOwnerDetailsArray(mainindex, ownerDetailsindex);
    handlePopUp();
  };

  const handleSubmit = () => {
    const requiredFields = [
      { key: "first_name", label: "First Name" },
      { key: "phone", label: "Phone Number" },
      { key: "email", label: "Email" },
      { key: "password", label: "Password" },
      { key: "r_address", label: "Residential Address" },
      { key: "pincode_id", label: "Pincode" },
      { key: "place_id", label: "Place" },
    ];
console.log('rowrowrowrow1' , row , personData)
    for (let field of requiredFields) {
      if (
        !personData.persons[ownerDetailsindex].first_name ||
        personData.persons[ownerDetailsindex].first_name.trim() === ""
      ) {
        toast.error(`${field.label} is required.`);
        return;
      }
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(personData.persons[ownerDetailsindex].phone)) {
      toast.error("Phone Number must be exactly 10 digits.");
      return;
    }

    if (!personData.persons[ownerDetailsindex].password) {
      toast.error("Password is required.");
      return;
    }

    if (!personData.persons[ownerDetailsindex].r_address) {
      toast.error("Address is required.");
      return;
    }

    if (!personData.persons[ownerDetailsindex].pincode_id) {
      toast.error("Pincode is required.");
      return;
    }

    if (!personData.persons[ownerDetailsindex].place_id) {
      toast.error("Place is required.");
      return;
    }

    toast.success("Form submitted successfully!");
    handlePopUp();
  };

  const Heading = [
    {
      id: 1,
      mainheading: "Key Managerial Persons Details",
      path: "/product-child-category-list",
    },
  ];

  const fetchPlace = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.place) {
        setPlace(response.data.place);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPlace(personData.persons[ownerDetailsindex].pincode_id);
  }, [personData.persons[ownerDetailsindex].pincode_id]);

  const fetchDistrictStateTehsil = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.pin) {
        setDistrictStateTehsil(response.data.pin);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchDistrictStateTehsil(personData.persons[ownerDetailsindex].pincode_id);
  }, [personData.persons[ownerDetailsindex].pincode_id]);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  return (
    <div
      className={`${classes.p2} ${classes.pb0} ${classes[style?.width]} ${
        classes[style?.bgcolor]
      }`}
    >
      <PageHeader Heading={Heading} />
      <ToastContainer />
      <div
        className={` ${classes.inputpadding} ${classes.mt1} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.dflex} ${classes.flexwrapwrap} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5}`}
            style={{ gap: "1rem" }}
          >
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Authorized Details{" "}
                <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <Autocomplete
                id="free-solo-demo"
                className={classes.crossbtnhideautocom}
                freeSolo
                options={person.map((option) => option.first_name)}
                onInputChange={(event, newValue) =>
                  handleOwnerDetailsArrayRowChange(
                    mainindex,
                    ownerDetailsindex,
                    "first_name",
                    newValue
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type to pick..."
                    variant="outlined"
                  />
                )}
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Father Name
              </FormLabel>
              <TextField
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(
                    mainindex,
                    ownerDetailsindex,
                    "father_name",
                    e.target.value
                  )
                }
                value={row.father_name}
                name="category_name"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Email
              </FormLabel>
              <TextField
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(
                    mainindex,
                    ownerDetailsindex,
                    "email",
                    e.target.value
                  )
                }
                value={row.email}
                name="category_name"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Phone <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(
                    mainindex,
                    ownerDetailsindex,
                    "phone",
                    e.target.value
                  )
                }
                value={row.phone}
                name="category_name"
                type="text"
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]{10}",
                }}
                onKeyDown={(e) => {
                  if (
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    !/^\d$/.test(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Alternate Phone No.
              </FormLabel>
              <TextField
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(
                    mainindex,
                    ownerDetailsindex,
                    "alternative_phone",
                    e.target.value
                  )
                }
                value={row.alternative_phone}
                name="category_name"
                type="text"
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]{10}",
                }}
                onKeyDown={(e) => {
                  if (
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    !/^\d$/.test(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Passwords <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(
                    mainindex,
                    ownerDetailsindex,
                    "password",
                    e.target.value
                  )
                }
                value={row.password}
                name="category_name"
                type="password"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Residential Address{" "}
                <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                onChange={
                  (e) =>
                    handleOwnerDetailsArrayRowChange(
                      mainindex,
                      ownerDetailsindex,
                      "r_address",
                      e.target.value
                    ) // Handle address input change
                }
                value={row.r_address}
                name="r_address"
                type="text"
                multiline
                rows={4}
                variant="outlined"
                required
                placeholder="Type Here"
                // fullWidth
              />
            </div>

            {districtStateTehsil.state && (
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
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
                  value={districtStateTehsil.state.state_name}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                  disabled
                >
                  <MenuItem value={districtStateTehsil.state.state_name}>
                    {districtStateTehsil.state.state_name}
                  </MenuItem>
                </Select>
              </div>
            )}
            {districtStateTehsil.district && (
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
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
                  value={districtStateTehsil.district.district_name}
                  // onChange={handlePinChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                  disabled
                >
                  <MenuItem value={districtStateTehsil.district.district_name}>
                    {" "}
                    {districtStateTehsil.district.district_name}
                  </MenuItem>
                </Select>
              </div>
            )}
            {districtStateTehsil.tehsil && (
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
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
                  value={districtStateTehsil.tehsil.tehsil_name}
                  // onChange={handlePinChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                  disabled
                >
                  <MenuItem value={districtStateTehsil.tehsil.tehsil_name}>
                    {districtStateTehsil.tehsil.tehsil_name}
                  </MenuItem>
                </Select>
              </div>
            )}

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Pincode <span className={classes.textcolorred}>*</span>
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={pin || []}
                // value={selectedRPin}
                // onChange={handleRPinChange}

                onChange={(event, newValue) =>
                  handleOwnerDetailsArrayRowChange(
                    mainindex,
                    ownerDetailsindex,
                    "pincode_id",
                    newValue.id
                  )
                }
                disableClearable
                // value={pin.find((sub) => sub.id === row.pincode_id)}
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
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Place <span className={classes.textcolorred}>*</span>
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={place || []}
                // value={selectedRPin}
                // onChange={handleRPinChange}

                onChange={(event, newValue) =>
                  handleOwnerDetailsArrayRowChange(
                    mainindex,
                    ownerDetailsindex,
                    "place_id",
                    newValue.id
                  )
                }
                disableClearable
                // value={place.find((sub) => sub.id === row.place_id)}
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
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${
              classes.mt1
            } ${classes[style?.marginbottom]}`}
          >
            <Button
              onClick={handleClose}
              className={`${classes.custombtnoutline}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={`${classes.custombtnblue}`}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </div>
  );
}
export default GstOwnerDetail;
