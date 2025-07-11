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
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import { LicenseOformPDF } from "../../LicenseOform/ViewLicenseOform/LicenseOformPDF";
import { pdf } from "@react-pdf/renderer";

function AddOformIssueForm({ style }) {
  const licenseTypeData = ["Lead", "Customer"];

  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const [lead, setLead] = useState([]);

  const [oform, setOform] = useState([]);
  const [selectedOform, setSelectedOform] = useState("");
  const [selectedOformId, setSelectedOformId] = useState("");
  const [licenseDetails, setLicenseDetails] = useState({
    licenseType: "Customer",
  });

  const [open, setOpen] = useState();

  const classes = useStyles();

  const handleClose = () => {
    style?.isPopUp ? style?.onClose() : navigate("/oform-list");
  };
  const handleOformChange = (event, newValue) => {
    setSelectedOform(newValue);
    setSelectedOformId(newValue.id);
  };

  const handleLicenseChange = (fieldName, value) => {
    setLicenseDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
    setSelectedCustomerId(newValue.id);
  };

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  // const handleFormSubmit = () => {
  //   const productCustomerString = String(selectedCustomerId);
  //   const productOformString = String(selectedOformId);

  //   if (!productCustomerString.trim()) {
  //     toast.warn("Please Select a customer.");
  //     return;
  //   }
  //   if (!productOformString.trim()) {
  //     toast.warn("Please Select a Oform");
  //     return;
  //   }

  //   const data = {
  //     o_form_issue: {
  //       customer_id: selectedCustomerId,
  //       o_form_id: selectedOformId,
  //     },
  //   };

  //   axios
  //     .post(
  //       `${process.env.REACT_APP_API_BASE_URL}/v1/admin/o_form_issue/add`,
  //       data,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${decryptedToken}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       toast.success("O-form isuue Successfully");
  //       setTimeout(() => {
  //         navigate("/oform-list");
  //       }, 2000);
  //     })
  //     .catch((error) => {
  //       toast.error(error);
  //     });
  // };

  const fetchOform = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/o_form_versioning`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.o_form_versioning) {
        setOform(response.data.o_form_versioning);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Oform:", error);
    }
  };

  useEffect(() => {
    fetchOform();
  }, []);

  const fetchLead = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/leads`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.lead) {
        setLead(response.data.lead);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchLead();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/ship_to_party/customer/be_information`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.data) {
        setCustomer(response.data.data);
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

  // const handleDownloadLicenseOformFreshPDF = async () => {
  //   const selectedCategory = oform.find(
  //     (category) => category.id === selectedOformId
  //   );

  //   try {
  //     const blob = await pdf(
  //       <LicenseOformPDF selectedCategory={selectedCategory} />
  //     ).toBlob();

  //     const url = URL.createObjectURL(blob);
  //     window.open(url, "_blank");

  //     toast("O-Form opened in new tab", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       type: "success",
  //     });
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     toast("Failed to open O-Form", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       type: "error",
  //     });
  //   }
  // };

  // const handleDownloadLicenseOformFilledPDF = async (name) => {
  //   const selectedCategory = oform.find(
  //     (category) => category.id === selectedOformId
  //   );
  //   try {
  //     const blob = await pdf(
  //       <LicenseOformPDF selectedCategory={selectedCategory} name={name} />
  //     ).toBlob();

  //     const url = URL.createObjectURL(blob);
  //     window.open(url, "_blank");

  //     toast("O-Form opened in new tab", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       type: "success",
  //     });
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     toast("Failed to open O-Form", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       type: "error",
  //     });
  //   }
  // };

  // const handleDownloadSaveLicenseOformFreshPDF = async () => {
  //   if (!selectedOformId) {
  //     toast.error("Please select a O-form.");
  //     return;
  //   }

  //   if (!licenseDetails.licenseType) {
  //     toast.error("Please select a Entity Type.");
  //     return;
  //   }

  //   if (!selectedCustomerId) {
  //     toast.error("Please select a Customer or Lead.");
  //     return;
  //   }

  //   const oFormIssuePayload = {
  //     o_form_id: selectedOformId,
  //     entity_type: licenseDetails.licenseType,
  //     issue_type: "Fresh Isuue",
  //   };

  //   if (licenseDetails.licenseType === "Lead") {
  //     oFormIssuePayload.lead_id = selectedCustomerId;
  //   } else if (licenseDetails.licenseType === "Customer") {
  //     oFormIssuePayload.customer_id = selectedCustomerId;
  //   }

  //   const data = {
  //     o_form_issue: oFormIssuePayload,
  //   };

  //   axios
  //     .post(
  //       `${process.env.REACT_APP_API_BASE_URL}/v1/admin/o_form_issue/add`,
  //       data,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${decryptedToken}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       toast.success("O-form issued successfully.");
  //       handleDownloadLicenseOformFreshPDF();
  //       setTimeout(() => {
  //         navigate("/oform-list");
  //       }, 2000);
  //     })
  //     .catch((error) => {
  //       toast.error(error);
  //     });
  // };

  const handleDownloadSaveLicenseOformFreshPDF = async () => {
    if (!selectedOformId) {
      toast.error("Please select a O-form.");
      return;
    }

    if (!licenseDetails.licenseType) {
      toast.error("Please select a Entity Type.");
      return;
    }

    if (!selectedCustomerId) {
      toast.error("Please select a Customer or Lead.");
      return;
    }

    const selectedCategory = oform.find(
      (category) => category.id === selectedOformId
    );

    const name =
      licenseDetails.licenseType === "Customer"
        ? customer.find((c) => c.id === selectedCustomerId)?.business_name
        : lead.find((l) => l.id === selectedCustomerId)?.name_of_dealing_person;

    try {
      // Step 1: Generate the PDF Blob
      const blob = await pdf(
        <LicenseOformPDF selectedCategory={selectedCategory} />
      ).toBlob();

      // Step 2: Upload the PDF to S3 via API
      const formData = new FormData();
      formData.append("entitytype", "o_form_issue");
      formData.append("o_form", blob, `${name}-oform.pdf`);

      const uploadResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/upload_to_s3bucket`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = uploadResponse.data?.uploadedFiles;
      if (!fileUrl) {
        toast.error("Failed to upload PDF to S3.");
        return;
      }
      // Step 3: Send to o_form_issue API
      const oFormIssuePayload = {
        o_form_id: selectedOformId,
        entity_type: licenseDetails.licenseType,
        issue_type: "Customer Detailed",
        o_form_file_path: fileUrl.o_form,
        license_file_path: selectedCategory.license_id.license.photo_path,
      };

      if (licenseDetails.licenseType === "Lead") {
        oFormIssuePayload.lead_id = selectedCustomerId;
      } else {
        oFormIssuePayload.customer_id = selectedCustomerId;
      }

      const data = {
        o_form_issue: oFormIssuePayload,
      };

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/o_form_issue/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      toast.success("O-form issued successfully.");

      // Step 4: Open the uploaded PDF
      window.open(fileUrl.o_form, "_blank");

      setTimeout(() => {
        navigate("/oform-list");
      }, 2000);
    } catch (error) {
      console.error("Error in issuing O-form with PDF upload:", error);
      toast.error("Failed to issue O-form. Please try again.");
    }
  };

  const handleDownloadSaveLicenseOformFilledPDF = async () => {
    if (!selectedOformId) {
      toast.error("Please select a O-form.");
      return;
    }

    if (!licenseDetails.licenseType) {
      toast.error("Please select a Entity Type.");
      return;
    }

    if (!selectedCustomerId) {
      toast.error("Please select a Customer or Lead.");
      return;
    }

    const selectedCategory = oform.find(
      (category) => category.id === selectedOformId
    );

    const name =
      licenseDetails.licenseType === "Customer"
        ? customer.find((c) => c.id === selectedCustomerId)?.business_name
        : lead.find((l) => l.id === selectedCustomerId)?.name_of_dealing_person;

    try {
      // Step 1: Generate the PDF Blob
      const blob = await pdf(
        <LicenseOformPDF selectedCategory={selectedCategory} name={name} />
      ).toBlob();

      // Step 2: Upload the PDF to S3 via API
      const formData = new FormData();
      formData.append("entitytype", "o_form_issue");
      formData.append("o_form", blob, `${name}-oform.pdf`);

      const uploadResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/upload_to_s3bucket`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = uploadResponse.data?.uploadedFiles;
      if (!fileUrl) {
        toast.error("Failed to upload PDF to S3.");
        return;
      }

      // Step 3: Send to o_form_issue API
      const oFormIssuePayload = {
        o_form_id: selectedOformId,
        entity_type: licenseDetails.licenseType,
        issue_type: "Customer Detailed",
        o_form_file_path: fileUrl.o_form,
        license_file_path: selectedCategory.license_id.license.photo_path,
      };

      if (licenseDetails.licenseType === "Lead") {
        oFormIssuePayload.lead_id = selectedCustomerId;
      } else {
        oFormIssuePayload.customer_id = selectedCustomerId;
      }

      const data = {
        o_form_issue: oFormIssuePayload,
      };

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/o_form_issue/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      toast.success("O-form issued successfully.");

      // Step 4: Open the uploaded PDF
      window.open(fileUrl.o_form, "_blank");

      setTimeout(() => {
        navigate("/oform-list");
      }, 2000);
    } catch (error) {
      console.error("Error in issuing O-form with PDF upload:", error);
      toast.error("Failed to issue O-form. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
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
                O-form Issue Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                {" "}
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  O-Form <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={oform || []}
                  value={selectedOform}
                  onChange={handleOformChange}
                  disableClearable
                  getOptionLabel={(option) => option.o_form_versioning_name}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Entity Type <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={licenseTypeData || []}
                  // value={licenseTypeData.find(
                  //   (sub) => sub.id === formDetails.license_category_id
                  // )}
                  value={licenseDetails.licenseType}
                  onChange={(event, newValue) =>
                    handleLicenseChange("licenseType", newValue)
                  }
                  disableClearable
                  getOptionLabel={(option) => option}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      name="license_category"
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
              {licenseDetails.licenseType === "Customer" && (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  {" "}
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Customer <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={customer || []}
                    onChange={handleCustomerChange}
                    getOptionLabel={(option) =>
                      `${option.gst_number.slice(0, 4)} - ${
                        option.business_name
                      }`
                    }
                    disableClearable
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
              )}
              {licenseDetails.licenseType === "Lead" && (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  {" "}
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Lead <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={lead || []}
                    onChange={handleCustomerChange}
                    getOptionLabel={(option) =>
                      `${
                        option?.gst_number?.slice(0, 4) ||
                        option?.pan_number?.slice(0, 4)
                      } - ${option.business_name}`
                    }
                    disableClearable
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
              )}
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${
              classes.mt1
            } ${classes[style?.marginbottom]}`}
          >
            <Button
              onClick={handleDownloadSaveLicenseOformFreshPDF}
              className={`${classes.custombtnoutline} `}
            >
              Fresh Isuue
            </Button>
            <Button
              onClick={handleDownloadSaveLicenseOformFilledPDF}
              className={`${classes.custombtnblue}`}
            >
              Customer Detail Isuue
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AddOformIssueForm;
