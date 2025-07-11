import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

function AddBusinessSubCategoryForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [businessCategory, setBusinessCategory] = useState([]);
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState("");

  const classes = useStyles();

  const handleBusinessCategoryChange = (event) => {
    setSelectedBusinessCategory(event.target.value);
  };

  const handleClose = () => {
    navigate("/business-sub-category-list");
  };

  const handleFormSubmit = () => {
    const selectedBatchString = String(selectedBusinessCategory)

    if (!name.trim()) {
      toast.warn("Please enter business sub name.");
      return;
    }
      
   if (!selectedBatchString.trim()) {
        toast.warn("Please select business category.");
      return;
      }

   

    const data = {
      sub_category: {
        sub_category_name: name,
        business_category_id: selectedBusinessCategory,
        description: description,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/sub_category/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Business Sub Category Created Successfully");
        setTimeout(() => {
          navigate("/business-sub-category-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
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
                Business Sub Category Details
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
                  onChange={(e) => setName(e.target.value)}
                  value={name}
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
                  Business Category <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state"
                  required
                  value={selectedBusinessCategory}
                  onChange={handleBusinessCategoryChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {businessCategory &&
                    businessCategory.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.category_name}
                      </MenuItem>
                    ))}
                </Select>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Description   

                </FormLabel>
                <TextField
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Description"
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
export default AddBusinessSubCategoryForm;
