import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Button,
  FormControl,
  FormLabel,
  IconButton,
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
import UploadPreview from "../../../../CustomComponent/UploadPreview";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import AddLicenseOformProduct from "../ViewLicenseOform/AddLicenseOformProduct";

const initialData = {
  o_form_versioning_name: "",
  license_id: "",
  license_product_id: [],
};

function AddLicenseForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [formDetails, setFormDetails] = useState(initialData);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [licenseData, setLicenseData] = useState([]);
  const [licenseProductIds, setLicenseProductIds] = useState([]);

  console.log("setLicenseProductIds", licenseProductIds);

  const handleCancel = () => {
    navigate("/oform-versioning-list");
  };

  const fetchLicenseData = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/license`, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setLicenseData(response?.data?.license_details);
      })
      .catch((error) => {
        console.log("error", error);
        // toast.error(error);
      });
  };

  useEffect(() => {
    fetchLicenseData();
  }, []);

  const handleChange = (fieldName, value) => {
    setFormDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = () => {
    const licenseString = String(formDetails.license_id);
    const licenseProductIdsString = String(licenseProductIds);

    if (!formDetails.o_form_versioning_name) {
      toast.error("Version Name is required");
      return;
    }

    if (!licenseString.trim()) {
      toast.error("Please select a License.");
      return;
    }

    if (!licenseProductIdsString.trim()) {
      toast.error("Please select one License.");
      return;
    }

    const data = {
      o_form_versioning: {
        o_form_versioning_name: formDetails.o_form_versioning_name,
        license_id: formDetails.license_id,
        license_product_id: licenseProductIds,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/o_form_versioning/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("O-Form added successfully");
        setTimeout(() => {
          navigate("/oform-versioning-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
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
                O-Form Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  O-form Version Name{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleChange("o_form_versioning_name", e.target.value)
                  }
                  value={formDetails.o_form_versioning_name}
                  name="version_name"
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
                  License {console.log('licenseData' , licenseData)}
                  <span className={classes.textcolorred}> *</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={licenseData || []}
                  value={licenseData?.find(
                    (sub) => sub.id === formDetails.license_id
                  )}
                  // value={formDetails.license_category_id}
                  onChange={(event, newValue) =>
                    handleChange("license_id", newValue.id)
                  }
                  disableClearable
                  getOptionLabel={(option) => option?.license_name}
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

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              ></div>
            </div>
            {formDetails.license_id && (
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.w100}`}
              >
                <Typography
                  className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                ></Typography>
                <AddLicenseOformProduct
                  rowId={formDetails.license_id}
                  setLicenseProductIds={setLicenseProductIds}
                />
              </div>
            )}
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
export default AddLicenseForm;
