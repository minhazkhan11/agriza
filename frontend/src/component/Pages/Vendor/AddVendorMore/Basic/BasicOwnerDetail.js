import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Modal,
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
import { Link, useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import PageHeader from "../../../PageHeader";
import UploadPreview from "../../../../CustomComponent/UploadPreview";

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
];

function BasicOwnerDetail({
  style,
  handleOwnerDetailsArrayRowChange,
  row,
  rDistrictStateTehsil,
  pin,
  ownerDetailsindex,
  handleRemoveOwnerDetailsArray,
  handlePopUp,
}) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [place, setPlace] = useState([]);
  const [districtStateTehsil, setDistrictStateTehsil] = useState([]);

  const handleClose = () => {
    handleRemoveOwnerDetailsArray();
    handlePopUp();
  };

  const handleSubmit = () => {
  
    const requiredFields = [
      { key: "first_name", label: "First Name" },
      { key: "phone", label: "Phone Number" },
      { key: "email", label: "Email" },
      { key: "r_address", label: "Residential Address" },
      { key: "pincode_id", label: "Pincode" },
      { key: "place_id", label: "Place" },
    ];

    for (let field of requiredFields) {
      if (
        !row[ownerDetailsindex].first_name ||
        row[ownerDetailsindex].first_name.trim() === ""
      ) {
        toast.error(`${field.label} is required.`);
        return;
      }
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(row[ownerDetailsindex].phone)) {
      toast.error("Phone Number must be exactly 10 digits.");
      return;
    }

    if (!row[ownerDetailsindex].password) {
      toast.error("Password is required.");
      return;
    }

    if (!row[ownerDetailsindex].r_address) {
      toast.error("Address is required.");
      return;
    }

    if (!row[ownerDetailsindex].pincode_id) {
      toast.error("Pincode is required.");
      return;
    }

    if (!row[ownerDetailsindex].place_id) {
      toast.error("Place is required.");
      return;
    }

    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaarRegex.test(row[ownerDetailsindex].aadhaar)) {
      toast.error("Aadhaar Number must be exactly 12 digits.");
      return;
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const panValue = row[ownerDetailsindex]?.pan?.trim().toUpperCase(); // Safe access

    if (!panValue || !panRegex.test(panValue)) {
      toast.error("PAN Number Aadhaar Number must be exactly ABCDE1234F.");
      return;
    }

    if (!row[ownerDetailsindex].photo) {
      toast.error("Photo is required.");
      return;
    }

    if (!row[ownerDetailsindex].aadhar_upload) {
      toast.error("Aadhar Photo is required.");
      return;
    }

    if (!row[ownerDetailsindex].pan_upload) {
      toast.error("Pan Photo is required.");
      return;
    }

    toast.success("Form submitted successfully!");
    handlePopUp();
  };

  const handleImage = async (e, field) => {
    const file = e.target.files[0];

    try {
      const formData = new FormData();
      const entitytype = "be_person";

      formData.append("entitytype", entitytype);
      formData.append(field, file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/upload_to_s3bucket`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`${field} uploaded successfully!`);
        console.log("response123456", response);
        const uploadedFileUrl = response.data?.uploadedFiles?.[field] || "";

        handleOwnerDetailsArrayRowChange(
          ownerDetailsindex,
          field,
          uploadedFileUrl
        );
      } else {
        toast.error(`Upload failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error uploading ${field}`);
      console.error("Upload error:", error);
    }
  };

  const Heading = [
    {
      id: 1,
      mainheading: "Owner/Partner/Director Details",
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
    fetchPlace(row[ownerDetailsindex].pincode_id);
  }, [row[ownerDetailsindex].pincode_id]);

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
    fetchDistrictStateTehsil(row[ownerDetailsindex].pincode_id);
  }, [row[ownerDetailsindex].pincode_id]);

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
        className={`${classes.inputpadding} ${classes.mt1} ${classes.inputborder} ${classes.pagescroll} ${classes.h82vh}`}
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
                Owner/Partner/Director Name{" "}
                <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(
                    ownerDetailsindex,
                    "first_name",
                    e.target.value
                  )
                }
                value={row.first_name}
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
                Father Name
              </FormLabel>
              <TextField
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(
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
                Password <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(
                    ownerDetailsindex,
                    "password",
                    e.target.value
                  )
                }
                value={row.password}
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

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            ></div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Aadhar Number <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(
                    ownerDetailsindex,
                    "aadhaar",
                    e.target.value
                  )
                }
                value={row.aadhaar}
                name="category_name"
                type="text"
                inputProps={{
                  maxLength: 12,
                  inputMode: "numeric",
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
                PAN Number <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                value={row[ownerDetailsindex]?.pan || ""} // Safe access
                onChange={(e) =>
                  handleOwnerDetailsArrayRowChange(ownerDetailsindex, "pan", e.target.value.toUpperCase())
                }
                name="pan"
                type="text"
                inputProps={{ maxLength: 10 }}
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            ></div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Photo <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                name="photo"
                onChange={(e) => handleImage(e, "photo")}
                type="file"
                variant="outlined"
                required
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Aadhar Upload <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                name="aadhar_upload"
                onChange={(e) => handleImage(e, "aadhar_upload")}
                type="file"
                variant="outlined"
                required
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                PAN Upload <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                name="pan_upload"
                onChange={(e) => handleImage(e, "pan_upload")}
                type="file"
                variant="outlined"
                required
              />
            </div>

            <div
              className={`${classes.w30} ${classes.mt1_5} ${classes.dflex} ${classes.justifycenter}`}
            >
              <UploadPreview
                thumbnailImagePreview={
                  row[ownerDetailsindex].photo &&
                  !(typeof row[ownerDetailsindex].photo == "string")
                    ? URL.createObjectURL(row[ownerDetailsindex].photo)
                    : row[ownerDetailsindex].photo
                }
              />
            </div>

            <div
              className={`${classes.w30} ${classes.mt1_5}  ${classes.dflex} ${classes.justifycenter}`}
            >
              <UploadPreview
                thumbnailImagePreview={
                  row[ownerDetailsindex].aadhar_upload &&
                  !(typeof row[ownerDetailsindex].aadhar_upload == "string")
                    ? URL.createObjectURL(row[ownerDetailsindex].aadhar_upload)
                    : row[ownerDetailsindex].aadhar_upload
                }
              />
            </div>

            <div
              className={`${classes.w30} ${classes.mt1_5}  ${classes.dflex} ${classes.justifycenter}`}
            >
              <UploadPreview
                thumbnailImagePreview={
                  row[ownerDetailsindex].pan_upload &&
                  !(typeof row[ownerDetailsindex].pan_upload == "string")
                    ? URL.createObjectURL(row[ownerDetailsindex].pan_upload)
                    : row[ownerDetailsindex].pan_upload
                }
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
export default BasicOwnerDetail;
