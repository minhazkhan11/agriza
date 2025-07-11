import React, { useState } from "react";
import {
  Button,
  FormControl,
  Divider,
  FormLabel,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@material-ui/core";
import useStyles from "../../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import AddMoreAndRemoveButton from "../../../../../CustomComponent/AddMoreAndRemoveButton";

function StaffContact({ setValue, businessEntityId }) {
  const classes = useStyles();

  const { state } = useLocation();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const bankDetails = state?.be_staff_contacts;

  const initialData =
    bankDetails && bankDetails.length > 0
      ? bankDetails.map((exp) => ({
          name: exp?.full_name || "",
          email: exp?.email || "",
          phone: exp?.phone || "",
          alternative_phone: exp?.alternative_phone || "",
          password: exp?.password || "",
          aadhar_number: exp?.aadhaar || "",
          pan: exp?.pan || "",
          role: exp?.role || "",
          be_information_id: businessEntityId,
        }))
      : [
          {
            name: "",
            email: "",
            phone: "",
            alternative_phone: "",
            password: "",
            aadhar_number: "",
            pan: "",
            role: "",
            be_information_id: businessEntityId,
          },
        ];

  const [files, setFiles] = useState({
    photo: null,
    aadhar_upload: null,
    pan_upload: null,
  });

  const [formDetails, setFormDetails] = useState(initialData);

  const handleAddRow = () => {
    setFormDetails([
      ...formDetails,
      {
        name: "",
        email: "",
        phone: "",
        alternative_phone: "",
        password: "",
        aadhar_number: "",
        pan: "",
        role: "",
        be_information_id: businessEntityId,
      },
    ]);
  };

  const handleFileUpload = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0], // Store the selected file
    }));
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

  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("staff_contacts", JSON.stringify(formDetails));
      formData.append("photo", files.photo);
      formData.append("aadhar_upload", files.aadhar_upload);
      formData.append("pan_upload", files.pan_upload);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_staff_contacts/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Staff Contact Information created successfully!");
        setTimeout(() => {
          setValue(5);
        }, 1000);
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(
          `Staff Contact Information is not created! ${response.data.message}`
        );
      }
    } catch (error) {
      // Handling errors
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Display the error message from the API response
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        // Generic error message for other types of errors
        toast.error("An unexpected error occurred while creating the exam.");
      }
      console.error("An error occurred:", error);
    }
  };

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
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            {formDetails.map((row, index) => (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                )}
                <>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                  >
                    <Typography
                      className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                      variant="h6"
                      display="inline"
                    >
                      {index === 0 && <div>Contact Information</div>}
                    </Typography>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Name
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
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Email <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "email", e.target.value)
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
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Phone <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "phone", e.target.value)
                        }
                        value={row.phone}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
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
                    ></Typography>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Alternate Phone No.{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "alternative_phone",
                            e.target.value
                          )
                        }
                        value={row.alternative_phone}
                        name="alternative_phone"
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
                        Password <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "password", e.target.value)
                        }
                        value={row.password}
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
                        Aadhar Number <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "aadhar_number",
                            e.target.value
                          )
                        }
                        value={row.aadhar_number}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
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
                    ></Typography>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        PAN Number <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "pan", e.target.value)
                        }
                        value={row.pan}
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
                        Designation{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <Select
                        labelId="category-label"
                        id="state"
                        required
                        value={row.role}
                        onChange={(e) =>
                          handleRowChange(index, "role", e.target.value)
                        }
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                      >
                        <MenuItem disabled value="">
                          <em className={classes.defaultselect}>Select Here</em>
                        </MenuItem>

                        <MenuItem value="procurement">Procurement</MenuItem>
                        <MenuItem value="salesman">Salesman</MenuItem>
                      </Select>
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Photo <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        name="photo"
                        onChange={handleFileUpload}
                        type="file"
                        variant="outlined"
                        required
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

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Aadhar Upload{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        name="aadhar_upload"
                        onChange={handleFileUpload}
                        type="file"
                        variant="outlined"
                        required
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        PAN Upload{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        name="pan_upload"
                        onChange={handleFileUpload}
                        type="file"
                        variant="outlined"
                        required
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    ></div>
                  </div>
                </>
              </React.Fragment>
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
            {/* <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Cancel
            </Button> */}
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
export default StaffContact;
