import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import useStyles from "../../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../../crypto";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { Autocomplete } from "@material-ui/lab";
import PageHeader from "../../../../PageHeader";

function EditGstOwnerDetail({
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
  setFormDetails,
  formDetails,
}) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [place, setPlace] = useState([]);
  const [districtStateTehsil, setDistrictStateTehsil] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState(
    row.persons[ownerDetailsindex].id || null
  );
  const [selectedPersonDetails, setSelectedPersonDetails] = useState([]);
  const [checkedOwner, setCheckedOwner] = useState(
    row.persons[ownerDetailsindex].is_owner_person || false
  );

  const handleClose = () => {
    handlePopUp();
  };

  console.log("rowrowrowrowrow", row, formDetails);

  const handleChange = (event) => {
    setCheckedOwner(event.target.checked);
    setDistrictStateTehsil([]);
    handleOwnerDetailsArrayRowChange(
      mainindex,
      ownerDetailsindex,
      "is_owner_person",
      event.target.checked
    );
    setFormDetails((prevBankDetails) =>
      prevBankDetails.map((bank, i) => {
        if (i === mainindex) {
          const updatedPersons = bank.persons.map((person, j) => {
            if (j === ownerDetailsindex) {
              return {
                ...person,
                first_name: "",
                father_name: "",
                email: "",
                phone: "",
                alternative_phone: "",
                is_owner_person: false,
                r_address: "",
                pincode_id: "",
                place_id: "",
              };
            }
            return person;
          });

          return {
            ...bank,
            persons: updatedPersons,
          };
        }
        return bank;
      })
    );
  };

  const handleselectePerson = (event, newValue) => {
    console.log("selectedPersonId", newValue);
    setSelectedPersonId(newValue.id);
  };

  const handleSubmit = () => {
    const requiredFields = [
      { key: "first_name", label: "Authorized Details" },
      { key: "phone", label: "Phone Number" },
      { key: "email", label: "Email" },
      { key: "password", label: "Password" },
      { key: "r_address", label: "Residential Address" },
      { key: "pincode_id", label: "Pincode" },
      { key: "place_id", label: "Place" },
    ];

    for (let field of requiredFields) {
      if (
        !row.persons[ownerDetailsindex].first_name ||
        row.persons[ownerDetailsindex].first_name.trim() === ""
      ) {
        toast.error(`${field.label} is required.`);
        return;
      }
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(row.persons[ownerDetailsindex].phone)) {
      toast.error("Phone Number must be exactly 10 digits.");
      return;
    }

    if (!checkedOwner && !row.persons[ownerDetailsindex].password) {
      toast.error("Password is required.");
      return;
    }

    if (!row.persons[ownerDetailsindex].r_address) {
      toast.error("Address is required.");
      return;
    }

    if (!row.persons[ownerDetailsindex].pincode_id) {
      toast.error("Pincode is required.");
      return;
    }

    if (!row.persons[ownerDetailsindex].place_id) {
      toast.error("Place is required.");
      return;
    }

    toast.success("Form submitted successfully!");

    handlePopUp();
  };

  const Heading = [
    {
      id: 1,
      mainheading: "Edit Key Managerial Persons Details",
    },
  ];

  const fetchPersonDetails = async (selectedPersonId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/persons/${selectedPersonId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.persons) {
        const data = response.data.persons;
        setSelectedPersonDetails(response.data.persons);

        // Update specific person in specific bank
        setFormDetails((prevBankDetails) =>
          prevBankDetails.map((bank, i) => {
            if (i === mainindex) {
              const updatedPersons = bank.persons.map((person, j) => {
                if (j === ownerDetailsindex) {
                  return {
                    ...person,
                    first_name: data.first_name || "",
                    father_name: data.father_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    alternative_phone: data.alternative_phone || "",
                    r_address: data.r_address || "",
                    pincode_id: data.pincode_id || "",
                    place_id: data.place_id || "",
                  };
                }
                return person;
              });

              return {
                ...bank,
                persons: updatedPersons,
              };
            }
            return bank;
          })
        );
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPersonDetails(selectedPersonId);
  }, [selectedPersonId]);

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
            className={`${classes.bgwhite} ${classes.dflex} ${classes.flexwrapwrap} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.pb2} ${classes.px1_5}`}
            style={{ gap: "1rem" }}
          >
            {" "}
            <div
              className={`${classes.dflex} ${classes.tablecheckbox} ${classes.flexdirectioncolumn}  ${classes.w100}`}
            >
              {console.log(
                "ownerDetailsindex1321",
                row.persons[ownerDetailsindex].is_owner_person
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={row.persons[ownerDetailsindex].is_owner_person}
                    onChange={handleChange}
                    name="checked"
                    color="primary"
                  />
                }
                label="Key Managerial Persons Details Same As Owner Details"
              />
            </div>
            {checkedOwner ? (
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
                  id="tags-standard"
                  options={person || []}
                  value={person.find((p) => p.id === selectedPersonId) || null}
                  getOptionLabel={(option) => option.first_name || ""}
                  onChange={handleselectePerson}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick..."
                      {...params}
                    />
                  )}
                />
              </div>
            ) : (
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Authorized Details{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  onChange={(e) =>
                    handleOwnerDetailsArrayRowChange(
                      mainindex,
                      ownerDetailsindex,
                      "first_name",
                      e.target.value
                    )
                  }
                  value={row.persons[ownerDetailsindex].first_name}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
            )}
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
                value={row.persons[ownerDetailsindex].father_name}
                name="category_name"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
                disabled={checkedOwner}
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
                value={row.persons[ownerDetailsindex].email}
                name="category_name"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
                disabled={checkedOwner}
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
                value={row.persons[ownerDetailsindex].phone}
                name="category_name"
                type="text"
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]{10}",
                }}
                onKeyDown={(e) => {
                  const isCtrlCmd = e.ctrlKey || e.metaKey;

                  const allowedKeys = [
                    "Backspace",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                    "Tab",
                  ];

                  // Allow Ctrl/Cmd combos: A, C, V, X
                  if (
                    isCtrlCmd &&
                    ["a", "c", "v", "x"].includes(e.key.toLowerCase())
                  ) {
                    return; // allow these combos
                  }

                  // Allow digits and all owed keys
                  if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                variant="outlined"
                required
                placeholder="Type Here"
                disabled={checkedOwner}
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
                value={row.persons[ownerDetailsindex].alternative_phone}
                name="category_name"
                type="text"
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]{10}",
                }}
                onKeyDown={(e) => {
                  const isCtrlCmd = e.ctrlKey || e.metaKey;

                  const allowedKeys = [
                    "Backspace",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                    "Tab",
                  ];

                  // Allow Ctrl/Cmd combos: A, C, V, X
                  if (
                    isCtrlCmd &&
                    ["a", "c", "v", "x"].includes(e.key.toLowerCase())
                  ) {
                    return; // allow these combos
                  }

                  // Allow digits and all owed keys
                  if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                variant="outlined"
                required
                placeholder="Type Here"
                disabled={checkedOwner}
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Passwords{" "}
                {!checkedOwner && (
                  <span className={classes.textcolorred}>*</span>
                )}
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
                value={row.persons[ownerDetailsindex].password}
                name="category_name"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
                disabled={checkedOwner}
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
                value={row.persons[ownerDetailsindex].r_address}
                name="r_address"
                type="text"
                multiline
                rows={4}
                variant="outlined"
                required
                placeholder="Type Here"
                disabled={checkedOwner}
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
                value={
                  pin?.find(
                    (sub) =>
                      sub.id === row.persons[ownerDetailsindex].pincode_id
                  ) || ""
                }
                getOptionLabel={(option) => option.pin_code}
                autoHighlight
                disabled={checkedOwner}
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
                value={
                  place?.find(
                    (sub) => sub.id === row.persons[ownerDetailsindex].place_id
                  ) || ""
                }
                getOptionLabel={(option) => option.place_name}
                autoHighlight
                disabled={checkedOwner}
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
export default EditGstOwnerDetail;
