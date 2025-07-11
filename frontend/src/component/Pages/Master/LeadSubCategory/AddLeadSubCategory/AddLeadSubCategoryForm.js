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
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import useStyles from "../../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import AddLeadCategoryFormPopUp from "../../LeadCategory/AddLeadCategory/AddLeadCategory";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import UploadPreview from "../../../../CustomComponent/UploadPreview";

function AddLeadSubCategoryForm({ style }) {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const classes = useStyles();

  const [leadCategory, setLeadCategory] = useState([]);
  const [selectedLeadCategory, setSelectedLeadCategory] = useState("");
  const [leadSubCategory, setLeadSubCategory] = useState([{ name: "" }]);

  const [open, setOpen] = useState();

  const handleLeadCategoryChange = (event, newValue) => {
    setSelectedLeadCategory(newValue);
  };

  const handleClose = () => {
    style?.isPopUp ? style?.onClose() : navigate("/lead-subcategory-list");
  };

  const handlePopUp = () => {
    setOpen(!open);
  };

  const handleFormSubmit = async () => {
    const selectedBatchleadCategory = String(setLeadCategory);
    const isValid = leadSubCategory.every((item) => item.name.trim() === "");

    if (!selectedBatchleadCategory.trim()) {
      toast.warn("Please Select Lead Category");
      return;
    }

    if (isValid) {
      toast.warn("Lead Sub Category Is Required");
      return;
    }

    const data = {
       
        lead_category_id: selectedLeadCategory.id,
        lead_sub_category: leadSubCategory,
    
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/lead_sub_category/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Lead Sub Category Created Successfully");
        setTimeout(() => {
          style?.isPopUp
            ? navigate("/create-lead-child-category")
            : navigate(`/lead-subcategory-list`);
          style?.isPopUp && style?.onClose();
          style?.isPopUp && style?.fetchLeadCategory();
        }, 2000);
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(
          `Lead Sub Category is not created! ${response.data.message}`
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

  const fetchLeadCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/lead_category`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log("hh", response.data);
      if (response.data && response.data.lead_category) {
        setLeadCategory(response.data?.lead_category);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchLeadCategory();
  }, []);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const Heading = {
    width: "w65",
    bgcolor: "bgwhite",
    marginbottom: "mb1",
    isPopUp: "yes",
    onClose: handlePopUp,
    fetchLeadCategory: fetchLeadCategory,
  };

  const handleAddLink = () => {
    setLeadSubCategory((prevLinks) => [...prevLinks, { name: "" }]);
  };

  const handleRemoveLink = (index) => {
    setLeadSubCategory((prevLinks) => {
      const updatedLinks = [...prevLinks];
      updatedLinks.splice(index, 1);
      return updatedLinks;
    });
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
                Lead Sub Category Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Lead Category <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={leadCategory || []}
                  value={selectedLeadCategory}
                  onChange={handleLeadCategoryChange}
                  disableClearable
                  getOptionLabel={(option) => option.name}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type to pick Lead category..."
                      variant="outlined"
                      {...params}
                    />
                  )}
                  selectOnFocus
                  openOnFocus
                />

                {!style?.isPopUp && (
                  <div>
                    <Button
                      // className={` ${classes.textdecorationnone}`}
                      className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                      onClick={handlePopUp}
                    >
                      Create Lead Category
                    </Button>
                  </div>
                )}
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
                className={`${classes.w74} ${classes.dflex}  ${classes.flexwrapwrap}`}
              >
                {leadSubCategory.map((link, index) => (
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mr0_5}  ${classes.w32}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Lead Sub Category{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    {/* <TextField
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Name"
                    /> */}

                    <TextField
                      onChange={(e) => {
                        const updatedLinks = [...leadSubCategory];
                        updatedLinks[index].name = e.target.value;
                        setLeadSubCategory(updatedLinks);
                      }}
                      value={link.name}
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Name"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {leadSubCategory.length >= 2 && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => handleRemoveLink(index)}
                                edge="end"
                              >
                                <IndeterminateCheckBoxOutlinedIcon />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                ))}
                <div
                  className={`${classes.inputcontainer} ${classes.justifyflexend} ${classes.dflex}`}
                >
                  <IconButton onClick={handleAddLink}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${
              classes.mt1
            }  ${classes[style?.marginbottom]}`}
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

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} ${classes}`}
          open={open}
          onClose={handlePopUp}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <AddLeadCategoryFormPopUp style={Heading} />
        </Modal>
      </div>
    </>
  );
}
export default AddLeadSubCategoryForm;
