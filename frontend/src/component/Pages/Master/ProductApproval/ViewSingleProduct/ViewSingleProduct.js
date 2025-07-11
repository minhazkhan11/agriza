import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../../styles";
import RemarkPopup from "./RemarkPopup";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

const initialData = {
  product_name: "",
  is_license: "",
  hsn_code: "",
  gst_applicable: "",
  product_child_category_id: "",
  gst_id: "",
};

function ViewSingleProduct({ handleOpenClose, open }) {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState(initialData);

  const [productCategory, setProductCategory] = useState([]);

  const [remark, setRemark] = useState("");

  const [gst, setGst] = useState([]);

  const { state } = useLocation();
  const rowId = state;

  const classes = useStyles();

  const handleClose = () => {
    navigate("/product-approval-list");
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/master_product/auth/pending/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.master_product;

        setFormDetails({
          ...formDetails,
          product_name: data.product_name,
          is_license: data.is_license,
          hsn_code: data.hsn_code,
          gst_applicable: data.gst_applicable,
          product_child_category_id: data.product_child_category_id,
          gst_id: data.gst_id,
        });
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

  const handleStatus = (iddd) => {
    const newStatus = "active";
    const data = {
      master_product: {
        active_status: newStatus,
        id: iddd,
        remark: "Approved",
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/master_product/auth/remark/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Product Approved successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Product status:", error);
        toast.error("Product status is not changed");
      });
  };

  const fetchProductCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product_child_category`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.product_child_category) {
        setProductCategory(response.data.product_child_category);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Product Child Category:", error);
    }
  };

  useEffect(() => {
    fetchProductCategory();
  }, []);

  const fetchGst = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/gst_percent`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setGst(response.data.gst_percent);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchGst();
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
                Product Details
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
                  value={formDetails.product_name}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                  disabled
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Is License <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Select
                  labelId="category-label"
                  id="country"
                  required
                  value={formDetails.is_license}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                  disabled
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>

                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  HSN Code <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.hsn_code}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                  disabled
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
                  Is GST Applicable
                </FormLabel>
                <RadioGroup
                  className={`${classes.radiocolor}`}
                  row
                  aria-label="is Gst"
                  name="is Gst"
                  value={formDetails.gst_applicable}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    disabled
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="No"
                    disabled
                  />
                </RadioGroup>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  GST Percent % <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={gst || []}
                  value={formDetails.gst_id}
                  disableClearable
                  getOptionLabel={(option) => option.gst_name}
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
                  disabled
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Product Child Category{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={productCategory || []}
                  value={formDetails.product_child_category_id}
                  disableClearable
                  getOptionLabel={(option) =>
                    option.product_child_category_name
                  }
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
                  disabled
                />
              </div>
            </div>
          </div>

          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              onClick={handleOpenClose}
              className={`${classes.custombtnoutline}`}
            >
              Cancel
            </Button>
            <Button
              onClick={(event) => {
                handleStatus(rowId);
              }}
              className={`${classes.custombtnblue}`}
            >
              Approve Status
            </Button>
          </div>
        </FormControl>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleOpenClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <RemarkPopup
            open={open}
            handleOpenClose={handleOpenClose}
            remark={remark}
            setRemark={setRemark}
            rowId={rowId}
          />
        </Modal>
      </div>
    </>
  );
}
export default ViewSingleProduct;
