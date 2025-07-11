import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
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
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import { Autocomplete } from "@material-ui/lab";
import { id } from "date-fns/locale";

function EditItemAttributesForm() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

   const { state } = useLocation();
  
    const rowId = state;

  const [attributeName, setAttributeName] = useState("");

  const [variantsDetails, setVariantsDetails] = useState([{id:"", variant: "" }]);

  const handleAddLink = () => {
    setVariantsDetails((prevLinks) => [...prevLinks, { variant: "" }]);
  };

  const handleRemoveLink = (index) => {
    setVariantsDetails((prevLinks) => {
      const updatedLinks = [...prevLinks];
      updatedLinks.splice(index, 1);
      return updatedLinks;
    });
  };

  const handleClose = () => {
    navigate("/item-attribute-list");
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/attributes/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.attributes;

        setAttributeName(data.attribute_name);

        const formattedVariantsDetails = data.variant_details.map((item) => ({
          id: item.id,
          variant: item.variant,
        }));

        setVariantsDetails(formattedVariantsDetails);
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

  const handleFormSubmit = () => {
    if (!attributeName.trim()) {
      toast.warn("Please enter  Attribute Name.");
      return;
    }

    if (variantsDetails.some((p) => !p.variant.trim())) {
      toast.warn("Please enter a Variant Name.");
      return;
    }

    const data = {
      attributesdetails: {
        id:rowId,
        attribute_name: attributeName,
        variantsDetails: variantsDetails,
      },
    };

    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/attributes/update`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        toast.success("Attribute Update Successfully");
        setTimeout(() => {
          navigate("/item-attribute-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
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
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.flexwrapwrap}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Attribute Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Attribute Name <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  onChange={(e) => setAttributeName(e.target.value)}
                  value={attributeName}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.w100}`}
            >
              <div
                className={`${classes.dflex} ${classes.w24} ${classes.justifyspacebetween} ${classes.flexwrapwrap}`}
              >
                <Typography
                  className={` ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  Variant Details
                </Typography>
              </div>

              <div
                className={`${classes.w74} ${classes.dflex}  ${classes.flexwrapwrap}`}
              >
                {variantsDetails.map((link, index) => (
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mr0_5}  ${classes.w32}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Variant Name{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      // onChange={(e) => setName(e.target.value)}
                      // value={link.variant}

                      onChange={(e) => {
                        const updatedLinks = [...variantsDetails];
                        updatedLinks[index].variant = e.target.value;
                        setVariantsDetails(updatedLinks);
                      }}
                      value={link.variant}

                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Name"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {variantsDetails.length >= 2 && (
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
export default EditItemAttributesForm;
