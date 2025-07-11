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
import { Autocomplete } from "@material-ui/lab";

function MyProfileForm({ fetchDataFromAPI }) {
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

  const [businessCategory, setBusinessCategory] = useState([]);
  const [businessSubCategory, setBusinessSubCategory] = useState([]);

  const [supplierType, setSupplierType] = useState([]);
  const [modulerType, setModulerType] = useState([]);

  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState([]);
  const [selectedBusinessSubCategory, setSelectedBusinessSubCategory] =
    useState([]);

  const [selectedSupplierType, setSelectedSupplierType] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");

  const handleBusinessCategoryChange = (event, newValue) => {
    setSelectedBusinessCategory(newValue.map((subject) => subject.id));
  };

  const handleBusinessSubCategoryChange = (event, newValue) => {
    setSelectedBusinessSubCategory(newValue.map((subject) => subject.id));
  };

  const handleSupplierTypeChange = (event, newValue) => {
    setSelectedSupplierType(newValue.map((subject) => subject.id));
  };
  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value);
  };

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
  

  const fetchBusinessCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/category`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.category) {
        setBusinessCategory(response.data.category);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchBusinessCategory();
  }, []);

  const fetchBusinessSubCategory = async () => {
    const data = {
      sub_category: {
        business_category_ids: selectedBusinessCategory,
      },
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/sub_category/business_category_id`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      setBusinessSubCategory(response.data.sub_categories);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchBusinessSubCategory();
  }, [selectedBusinessCategory]);

  const fetchSupplierData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/supplier`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setSupplierType(response.data.supplier);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchModulerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/integrated_module_plans`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setModulerType(response.data.integrated_module_plans);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchModulerData();
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
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                My Profile

              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  GST Number <span className={classes.textcolorred}>*</span>
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
                  Business Name <span className={classes.textcolorred}>*</span>
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
                  Short Name <span className={classes.textcolorred}>*</span>
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
                  Business Category
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={businessCategory}
                  getOptionLabel={(option) => option.category_name}
                  value={businessCategory.filter((sub) =>
                    selectedBusinessCategory.includes(sub.id)
                  )}
                  onChange={handleBusinessCategoryChange}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type business category..."
                      {...params}
                    />
                  )}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Business Sub Category
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={businessSubCategory}
                  getOptionLabel={(option) => option.sub_category_name}
                  value={businessSubCategory.filter((sub) =>
                    selectedBusinessSubCategory.includes(sub.id)
                  )}
                  onChange={handleBusinessSubCategoryChange}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type business Sub category..."
                      {...params}
                    />
                  )}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  ​ PAN No <span className={classes.textcolorred}>*</span>
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
                  Supplier Type <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={supplierType}
                  getOptionLabel={(option) => option.supplier_name}
                  value={supplierType.filter((sub) =>
                    selectedSupplierType.includes(sub.id)
                  )}
                  onChange={handleSupplierTypeChange}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick supplierType..."
                      {...params}
                    />
                  )}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Module Type <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state"
                  required
                  value={selectedModule}
                  onChange={handleModuleChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {modulerType &&
                    modulerType.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.plan_name}
                      </MenuItem>
                    ))}
                </Select>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Address<span className={classes.textcolorred}>*</span>
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
                  Pincode <span className={classes.textcolorred}>*</span>
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
                  Website <span className={classes.textcolorred}>*</span>
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
                  Phone <span className={classes.textcolorred}>*</span>
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
                  CIN Number<span className={classes.textcolorred}>*</span>
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
                  MSME Number<span className={classes.textcolorred}>*</span>
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
export default MyProfileForm;
