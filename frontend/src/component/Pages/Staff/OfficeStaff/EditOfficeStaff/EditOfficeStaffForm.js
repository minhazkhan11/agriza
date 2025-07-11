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
import useStyles from "../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import UploadPreview from "../../../../CustomComponent/UploadPreview";

const initialData = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  pan: "",
  aadhaar: "",
  alternative_phone: "",
  menu_plan_id: "",
  r_address: "",
  father_name: "",
  pincode: "",
  business_area_zone: "",
  business_area_id: [],
  warehouse_id: [],
  vendor_id: [],
  gst_id: [],
  customer_id: [],
  Effective_date_change: "",
};

function EditOfficeStaffForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { state } = useLocation();
  const rowId = state;
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const assigned_to = JSON.parse(sessionStorage?.getItem("assigned_to"));

  const [formDetails, setFormDetails] = useState(initialData);

  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [selectedBusinessArea, setSelectedBusinessArea] = useState("");
  const [selectedBusinessAreaId, setSelectedBusinessAreaId] = useState("");

  const [warehouse, setWarehouse] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState([]);

  const [gst, setGst] = useState([]);
  const [selectedAdminGst, setSelectedAdminGst] = useState([]);
  const [selectedAdminGstId, setSelectedAdminGstId] = useState([]);

  const [vendor, setVendor] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState([]);

  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState([]);

  const [territory, setTerritory] = useState([]);

  const [area, setArea] = useState([]);

  const [region, setRegion] = useState([]);

  const [zone, setZone] = useState([]);

  const [districtStateTehsil, setDistrictStateTehsil] = useState([]);

  const [pin, setPin] = useState([]);
  const [selectedPin, setSelectedPin] = useState("");
  const [selectedPinId, setSelectedPinId] = useState("");

  const [place, setPlace] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  const [files, setFiles] = useState({
    photo: null,
    aadhar_upload: null,
    pan_upload: null,
  });

  const handlePinChange = (event, newValue) => {
    setSelectedPin(newValue);
    setSelectedPinId(newValue.id);
  };

  const handlePlaceChange = (event, newValue) => {
    setSelectedPlace(newValue);
    setSelectedPlaceId(newValue.id);
  };

  const handleFileUpload = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0], // Store the selected file
    }));
  };

  const handleBusinessArea = (event) => {
    setSelectedBusinessArea(event.target.value);
    setSelectedBusinessAreaId("");
  };

  const handleBusinessAreaId = (event, newValue) => {
    setSelectedBusinessAreaId(newValue.map((subject) => subject.id));
  };

  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
    setSelectedRoleId(newValue.id);
    setSelectedAdminGst([]);
    setSelectedAdminGstId([]);
    setSelectedWarehouse([]);
    setSelectedWarehouseId([]);
    setSelectedVendor([]);
    setSelectedVendorId([]);
    setSelectedCustomer([]);
    setSelectedCustomerId([]);
  };

  const handleWarehouseChange = (event, newValue) => {
    setSelectedWarehouse(newValue);
    setSelectedWarehouseId(newValue.map((subject) => subject.id));
  };

  const handleVendorChange = (event, newValue) => {
    setSelectedVendor(newValue);
    setSelectedVendorId(newValue.map((subject) => subject.id));
  };

  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
    setSelectedCustomerId(newValue.map((subject) => subject.id));
  };

  const handleAdminGstChange = (event, newValue) => {
    setSelectedAdminGst(newValue);
    setSelectedAdminGstId(newValue.map((subject) => subject.id));
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleClose = () => {
    navigate("/staff-list");
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/staff/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.user;
        setFormDetails({
          ...formDetails,
          full_name: data.first_name,
          father_name: data.father_name,
          phone: data.phone,
          email: data.email,
          r_address: data.r_address,
          pincode: data.pincode,
          place_id: data.place,
          aadhaar: data.aadhaar,
          pan: data.pan,
          alternative_phone: data.alternative_phone,
          menu_plan_id: data.menu_plan_id,
        });

        setSelectedPinId(data.pincode_id.id);
        setSelectedPin(data.pincode_id);
        setSelectedPlaceId(data.place_id.id);
        setSelectedPlace(data.place_id);
        setSelectedRole(data.menu_plan_id);
        setSelectedRoleId(data.menu_plan_id.id);
        setFiles({
          photo: data.staff_photo,
          aadhar_upload: data.aadhar_upload,
          pan_upload: data.pan_upload,
        });
        setSelectedWarehouse(data?.assigned_data?.warehouse_id);

        const selectedWarehouseIds = data?.assigned_data?.warehouse_id?.map(
          (area) => area.id
        );
        setSelectedWarehouseId(selectedWarehouseIds);

        setSelectedAdminGst(data?.assigned_data?.gst_id);

        const selectedGstIds = data?.assigned_data?.gst_id?.map(
          (area) => area.id
        );
        setSelectedAdminGstId(selectedGstIds);

        setSelectedVendor(data?.assigned_data?.vendor_id);
        const selectedVendorIds = data?.assigned_data?.vendor_id?.map(
          (area) => area.id
        );
        setSelectedVendorId(data?.assigned_data?.vendor_id);

        setSelectedCustomer(data?.assigned_data?.customer_id);
        const selectedCustomerIds = data?.assigned_data?.customer_id?.map(
          (area) => area.id
        );
        setSelectedCustomerId(data?.assigned_data?.customer_id);

        const selectedIds = data?.assigned_data?.business_area_id?.map(
          (area) => area.id
        );
        setSelectedBusinessAreaId(selectedIds);
        setSelectedBusinessArea(data?.assigned_data?.business_area_zone);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    if (rowId) {
      fetchDataFromAPI(rowId);
    }
  }, [rowId]);

  const handleFormSubmit = async () => {
    const roleString = String(selectedRoleId);
    const ValidatePin = String(selectedPinId);
    const ValidatePlace = String(selectedPlaceId);

    if (!formDetails.full_name.trim()) {
      toast.warn("Please Enter a Name.");
      return;
    }
    if (!formDetails.father_name.trim()) {
      toast.warn("Please Enter a father name.");
      return;
    }
    if (!formDetails.phone.trim()) {
      toast.warn("Please Enter a phone.");
      return;
    }
    if (!formDetails.email.trim()) {
      toast.warn("Please Enter a email.");
      return;
    }
    if (!formDetails.password.trim()) {
      toast.warn("Please Enter a password.");
      return;
    }
    if (!formDetails.r_address.trim()) {
      toast.warn("Please Enter a Residential Address .");
      return;
    }
    if (!ValidatePin.trim()) {
      toast.warn("Please Select a Pincode.");
      return;
    }
    if (!ValidatePlace.trim()) {
      toast.warn("Please Select a Pincode.");
      return;
    }
    if (!formDetails.aadhaar.trim()) {
      toast.warn("Please Enter a Aadhaar Number .");
      return;
    }
    if (!formDetails.pan.trim()) {
      toast.warn("Please Enter a Pan Number .");
      return;
    }
    if (!roleString.trim()) {
      toast.warn("Please Select a role.");
      return;
    }

    try {
      const formData = new FormData();
      const userData = {
        id: rowId,
        first_name: formDetails.full_name,
        father_name: formDetails.father_name,
        phone: formDetails.phone,
        email: formDetails.email,
        password: formDetails.password,
        r_address: formDetails.r_address,
        pincode_id: selectedPinId,
        place_id: selectedPlaceId,
        aadhaar: formDetails.aadhaar,
        pan: formDetails.pan,
        menu_plan_id: selectedRoleId,
        alternative_phone: formDetails.alternative_phone,
        business_area_zone: selectedBusinessArea,
        business_area_id: selectedBusinessAreaId,
        warehouse_id: selectedWarehouseId,
        vendor_id: selectedVendorId,
        gst_id: selectedAdminGstId,
        customer_id: selectedCustomerId,
        Effective_date_change: "",
        be_information_id: assigned_to?.be_information_id || null,
      };

      formData.append("user", JSON.stringify(userData));
      formData.append("staff_photo", files.photo);
      formData.append("pan_upload", files.pan_upload);
      formData.append("aadhar_upload", files.aadhar_upload);

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/staff/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Staff Update successfully!");
        setTimeout(() => {
          navigate(`/staff-list`);
        }, 2000);
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(
          `Staff is not Update successfully! ${response.data.message}`
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
        toast.error("An unexpected error occurred while Updating the Staff.");
      }
      console.error("An error occurred:", error);
    }
  };

  const fetchGST = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_gst_details/be_id/${assigned_to?.be_information_id}`,
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

  console.log("gstgstgstgstgst", gst);

  const fetchVendor = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_vendor/be/vendor`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.be_information) {
        setVendor(response.data.be_information);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_customer/be/customer`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.be_information) {
        setCustomer(response.data.be_information);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchRole = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/menu_plan`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.menu_plan) {
        setRole(response.data.menu_plan);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchWarehouse = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_warehouse_information`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.warehouse_information) {
        setWarehouse(response.data.warehouse_information);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

  const fetchTerritory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_area_teritari`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.product_areas) {
        setTerritory(response.data.product_areas);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchTerritory();
  }, []);

  const fetchArea = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_area`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.business_areaData) {
        setArea(response.data.business_areaData);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchArea();
  }, []);

  const fetchRegion = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_area_region`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.regionArray) {
        setRegion(response.data.regionArray);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchRegion();
  }, []);

  const fetchZone = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_area_zone`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.business_area_zone) {
        setZone(response.data.business_area_zone);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchZone();
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

  const fetchDistrictStateTehsil = async (selectedPinId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${selectedPinId}`,
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
    fetchDistrictStateTehsil(selectedPinId);
  }, [selectedPinId]);

  const fetchPlace = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${selectedPinId}`,
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
    fetchPlace(selectedPinId);
  }, [selectedPinId]);

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
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Office Staff Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("full_name", e.target.value)
                  }
                  value={formDetails.full_name}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Father Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("father_name", e.target.value)
                  }
                  value={formDetails.father_name}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
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
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  value={formDetails.phone}
                  name="category_name"
                  type="text"
                 inputProps={{
                  inputMode: "numeric", // shows numeric keyboard on mobile
                  maxLength: 10,
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
                  Email <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  value={formDetails.email}
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
                  Alternate Phone No.
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("alternative_phone", e.target.value)
                  }
                  value={formDetails.alternative_phone}
                  name="category_name"
                  type="text"
                inputProps={{
                  inputMode: "numeric", // shows numeric keyboard on mobile
                  maxLength: 10,
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
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  value={formDetails.password}
                  name="category_name"
                  type="password"
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
              >
                Residential Information
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Residential Address{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("r_address", e.target.value)
                  }
                  value={formDetails.r_address}
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
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              {districtStateTehsil.state && (
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
                    value={districtStateTehsil.state.state_name}
                    onChange={handlePinChange}
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
                    value={districtStateTehsil.district.district_name}
                    // onChange={handlePinChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem
                      value={districtStateTehsil.district.district_name}
                    >
                      {" "}
                      {districtStateTehsil.district.district_name}
                    </MenuItem>
                  </Select>
                </div>
              )}
              {districtStateTehsil.tehsil && (
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
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Place <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={place || []}
                  value={selectedPlace}
                  onChange={handlePlaceChange}
                  disableClearable
                  getOptionLabel={(option) => option.place_name || option.name}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Aadhar Number <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleFormChange("aadhaar", e.target.value)}
                  value={formDetails.aadhaar}
                  name="category_name"
                  type="text"
                  inputProps={{
                    maxLength: 12,
                    inputMode: "numeric",
                    pattern: "[0-9]{12}",
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  PAN Number <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleFormChange("pan", e.target.value.toUpperCase())}
                  value={formDetails.pan}
                  name="category_name"
                  type="text"
                  inputProps={{
                    maxLength: 10,
                  }}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Role & Responsibility{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={role || []}
                  value={selectedRole}
                  onChange={handleRoleChange}
                  disableClearable
                  getOptionLabel={(option) => option.menu_name}
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

              {selectedRole.id === 40 ? (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Warehouse <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      multiple
                      id="tags-standard"
                      options={warehouse || []}
                      getOptionLabel={(option) => option.name}
                      value={warehouse.filter((sub) =>
                        selectedWarehouseId.includes(sub.id)
                      )}
                      onChange={handleWarehouseChange}
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

                    {/* <Autocomplete
                        id="state-autocomplete"
                        options={warehouse || []}
                        value={selectedWarehouse}
                        onChange={handleWarehouseChange}
                        disableClearable
                        getOptionLabel={(option) => option.name}
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
                      /> */}
                  </div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </>
              ) : selectedRole.id === 36 ? (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      GST <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      multiple
                      id="tags-standard"
                      options={gst || []}
                      getOptionLabel={(option) => option.gst_number}
                      value={gst.filter((sub) =>
                        selectedAdminGstId.includes(sub.id)
                      )}
                      onChange={handleAdminGstChange}
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
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </>
              ) : selectedRole.id === 37 ? (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      GST <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      id="tags-standard"
                      options={gst || []}
                      getOptionLabel={(option) => option.gst_number}
                      value={
                        gst.find((sub) =>
                          selectedAdminGstId.includes(sub.id)
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        handleAdminGstChange(event, newValue ? [newValue] : [])
                      }
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
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </>
              ) : selectedRole.id === 39 ? (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Vendor <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      multiple
                      id="tags-standard"
                      options={vendor || []}
                      getOptionLabel={(option) => option.business_name}
                      value={vendor.filter((sub) =>
                        selectedVendorId.includes(sub.id)
                      )}
                      onChange={handleVendorChange}
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
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </>
              ) : selectedRole.id === 38 ? (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Business Area
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <Select
                      labelId="category-label"
                      id="country"
                      required
                      value={selectedBusinessArea}
                      onChange={handleBusinessArea}
                      displayEmpty
                      className={classes.selectEmpty}
                      MenuProps={menuProps}
                      variant="outlined"
                    >
                      <MenuItem disabled value="">
                        <em className={classes.defaultselect}>Select Here</em>
                      </MenuItem>

                      <MenuItem value="territory">Territory</MenuItem>
                      <MenuItem value="area">Area</MenuItem>
                      <MenuItem value="region">Region</MenuItem>
                      <MenuItem value="zone">Zone</MenuItem>
                    </Select>
                  </div>

                  {selectedBusinessArea === "territory" ? (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Territory{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={territory || []}
                        getOptionLabel={(option) => option.name}
                        value={territory.filter((sub) =>
                          selectedBusinessAreaId.includes(sub.id)
                        )}
                        onChange={handleBusinessAreaId}
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
                  ) : selectedBusinessArea === "area" ? (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Area <span className={classes.textcolorred}>*</span>
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={area || []}
                        getOptionLabel={(option) => option.name}
                        value={area.filter((sub) =>
                          selectedBusinessAreaId.includes(sub.id)
                        )}
                        onChange={handleBusinessAreaId}
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
                  ) : selectedBusinessArea === "region" ? (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Region <span className={classes.textcolorred}>*</span>
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={region || []}
                        getOptionLabel={(option) => option.name}
                        value={region.filter((sub) =>
                          selectedBusinessAreaId.includes(sub.id)
                        )}
                        onChange={handleBusinessAreaId}
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
                  ) : selectedBusinessArea === "zone" ? (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Zone <span className={classes.textcolorred}>*</span>
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="state-autocomplete"
                        options={zone || []}
                        value={zone.filter((sub) =>
                          selectedBusinessAreaId.includes(sub.id)
                        )}
                        onChange={handleBusinessAreaId}
                        disableClearable
                        getOptionLabel={(option) => option.name}
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
                  ) : (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    ></div>
                  )}
                </>
              ) : selectedRole.id === 41 ? (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Customer <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      multiple
                      id="tags-standard"
                      options={customer || []}
                      getOptionLabel={(option) => option.business_name}
                      value={customer.filter((sub) =>
                        selectedCustomerId.includes(sub.id)
                      )}
                      onChange={handleCustomerChange}
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
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </>
              ) : (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </>
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
                  Photo
                </FormLabel>
                <TextField
                  name="photo"
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
                  Aadhar Upload
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
                  Pan Upload
                </FormLabel>
                <TextField
                  name="pan_upload"
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

              <div className={`${classes.w24} ${classes.mt1_5}`}>
                {console.log("files", files)}
                <UploadPreview
                  thumbnailImagePreview={
                    files.photo && !(typeof files.photo == "string")
                      ? URL.createObjectURL(files.photo)
                      : files.photo
                  }
                />
              </div>

              <div className={`${classes.w24} ${classes.mt1_5}`}>
                <UploadPreview
                  thumbnailImagePreview={
                    files.aadhar_upload &&
                    !(typeof files.aadhar_upload == "string")
                      ? URL.createObjectURL(files.aadhar_upload)
                      : files.aadhar_upload
                  }
                />
              </div>
              <div className={`${classes.w24} ${classes.mt1_5}`}>
                <UploadPreview
                  thumbnailImagePreview={
                    files.pan_upload && !(typeof files.pan_upload == "string")
                      ? URL.createObjectURL(files.pan_upload)
                      : files.pan_upload
                  }
                />
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
export default EditOfficeStaffForm;
