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
import UploadPreview from "../../../../CustomComponent/UploadPreview";
import { Autocomplete } from "@material-ui/lab";
import AddMarketer from "../../Marketer/AddMarketer/AddMarketer";

function AddBrandForm({ style }) {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [marketer, setMarketer] = useState([]);
  const [selectedMarketer, setSelectedMarketer] = useState("");
  const [selectedMarketerId, setSelectedMarketerId] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState([]);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState();
  const [open, setOpen] = useState();

  const classes = useStyles();

  const handleFileUpload = (file) => {
    setThumbnailImage(file);
  };

  const handleThumbnailImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePopUp = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    style?.isPopUp ? style?.onClose() : navigate("/brand-list");
  };
  const handleMarketerChange = (event, newValue) => {
    setSelectedMarketer(newValue);
    setSelectedMarketerId(newValue.id);
  };
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const handleFormSubmit = () => {
    const productMarketerString = String(selectedMarketer);

    if (!name.trim()) {
      toast.warn("Please Enter a Brand Name.");
      return;
    }
    if (!productMarketerString.trim()) {
      toast.warn("Please Select a Marketer");
      return;
    }
    const formData = new FormData();

    const brand = {
      brand_name: name,
      marketers_id: selectedMarketerId,
      description: description,
    };

    formData.append("brand", JSON.stringify(brand));
    formData.append("brand_image", thumbnailImage);

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/brand/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Brand Created Successfully");
        setTimeout(() => {
          style?.isPopUp ? style?.onClose() : navigate("/brand-list");
          style?.isPopUp && style?.onClose();
          style?.isPopUp && style?.fetchBrand();
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchMarketer = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/marketers`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.marketers) {
        setMarketer(response.data.marketers);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Marketer:", error);
    }
  };

  useEffect(() => {
    fetchMarketer();
  }, []);

  const Heading = {
    width: "w65",
    bgcolor: "bgwhite",
    marginbottom: "mb1",
    isPopUp: "yes",
    onClose: handlePopUp,
    fetchMarketer: fetchMarketer,
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
                Brand Details
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
                {" "}
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Marketer <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={marketer || []}
                  value={selectedMarketer}
                  onChange={handleMarketerChange}
                  disableClearable
                  getOptionLabel={(option) =>
                    option
                      ? `${option.marketer_name} (${option.alias_name})`
                      : ""
                  }
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type to pick product category..."
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
                      Create Marketer
                    </Button>
                  </div>
                )}
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
                  Brand Images
                </FormLabel>
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w24} ${classes.mt1_5}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${
              classes.mt1
            } ${classes[style?.marginbottom]}`}
          >
            <Button
              onClick={handleClose}
              className={`${classes.custombtnoutline} `}
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
          className={`${classes.modal}`}
          open={open}
          onClose={handlePopUp}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <AddMarketer style={Heading} />
        </Modal>
      </div>
    </>
  );
}
export default AddBrandForm;
