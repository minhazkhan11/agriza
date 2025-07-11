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

function AddStaffForm({ fetchDataFromAPI }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const handleFileUpload = (e) => {};

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const initialData = {
    full_name: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    address: "",
    pincode: "",
    file: null,
    accountHoldName: "",
    branchName: "",
    accountNo: "",
    ifsc: "",
    panNo: "",
    Gst: "",
  };

  const gstInputRef = React.createRef();
  const panInputRef = React.createRef();
  const aadharInputRef = React.createRef();
  const cancelCheckInputRef = React.createRef();
  const momcancelref = React.createRef();

  const handleCancel = () => {
    navigate("/admin/dashboard");
  };

  const handleFormSubmit = async () => {
    // const selectedBusinessCategory = String(selectedBusinessCategory);
    // const selectedBusinessSubCategory = String(selectedBusinessSubCategory);
    // const selectedSupplier = String(selectedSupplier);
    // const selectedModule = String(selectedModule);
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill GST Number");
    //   return;
    // }
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill Business Name.");
    //   return;
    // }
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill Short Name.");
    //   return;
    // }
    // if (!selectedBusinessCategory.trim()) {
    //   toast.warn("Please Select Business Category.");
    //   return;
    // }
    // if (!selectedBusinessSubCategory.trim()) {
    //   toast.warn("Please Select Business Sub Category.");
    //   return;
    // }
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill PAN No ");
    //   return;
    // }
    // if (!selectedSupplier.trim()) {
    //   toast.warn("Please Select Supplier Type.");
    //   return;
    // }
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill Address ");
    //   return;
    // }
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill Pincode  ");
    //   return;
    // }
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill Website ");
    //   return;
    // }
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill Phone ");
    //   return;
    // }
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill CIN Number ");
    //   return;
    // }
    // if (!selectedBatchString.trim()) {
    //   toast.warn("Please Fill MSME Number ");
    //   return;
    // }
    // try {
    //   const formData = new FormData();
    //   const profileData = {
    //     full_name: clientName,
    //     email: formDetails.email,
    //     phone: formDetails.phone,
    //     state: selectedStateId.id,
    //     district: selectedDistrictId.id,
    //     address: formDetails.address,
    //     pincode: formDetails.pincode,
    //     account_holder_name: formDetails.accountHoldName,
    //     branch_name: formDetails.branchName,
    //     bank_account_no: formDetails.accountNo,
    //     ifsc_code: formDetails.ifsc,
    //     pan_no: formDetails.panNo,
    //     gst_no: formDetails.Gst,
    //     about: formDetails.about,
    //   };
    //   formData.append("user", JSON.stringify(profileData));
    //   formData.append("gst", selectedGSTFile);
    //   formData.append("pan", selectedPANFile);
    //   formData.append("aadhar", selectedAadharCardFile);
    //   formData.append("cheque", selectedCancelCheckFile);
    //   formData.append("mom", selectedMomFile);
    //   console.log(formData, "profileData");
    //   const response = await axios.put(
    //     `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/auth/profile/update`,
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${decryptedToken}`,
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    //   if (response.status === 200) {
    //     toast.success("Profile updated successfully!");
    //     setTimeout(() => {
    //       // fetchData();
    //       navigate("/admin/dashboard");
    //     }, 2000);
    //   } else {
    //     const errorMessage = response.data?.message || "Update failed!";
    //     toast.error(errorMessage);
    //   }
    // } catch (error) {
    //   console.error("An error occurred:", error);
    //   const errorMessage =
    //     error.response?.data?.message || "Failed to update profile.";
    //   toast.error(errorMessage);
    // }
  };

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
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Add Staff
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Email <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Phone
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Alternative Phone
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Aadhaar Number
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Designation
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Photo
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleFileUpload(e)}
                  type="file"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              ></div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              ></div>
            </div>
          </div>

          {/* handle button click event */}

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
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AddStaffForm;
