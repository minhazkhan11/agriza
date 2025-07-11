import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Modal,
  Backdrop,
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
import AddRegionFormPopUp from "../../Region/AddRegion/AddRegion";

function AddZoneForm({ style }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [formDetails, setFormDetails] = useState({
    name: "",
    short_name: "",
    code: null,
    region_ids: "",
  });

  const [open, setOpen] = useState();

  const [region, setRegion] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  const handleRegionChange = (event, newValue) => {
    setSelectedRegion(newValue.map((subject) => subject.id));
    setFormDetails((pre) => ({
      ...pre,
      region_ids: newValue.map((subject) => subject.id),
    }));
  };

  const handleCancel = () => {
    navigate("/zone-list");
  };

  const handleFormSubmit = () => {
    if (!formDetails.name.trim()) {
      toast.error("Zone Name is required");
      return;
    }
    if (!formDetails.region_ids) {
      toast.error("Region is required");
      return;
    }

    const data = {
      business_area_zone: formDetails,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_area_zone/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Zone Information Updated Successfully");

        setTimeout(() => {
          style?.isPopUp
            ? style?.isPopUp && style?.onClose()
            : navigate("/zone-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

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
      console.error("Error fetching Marketer:", error);
    }
  };

  useEffect(() => {
    fetchRegion();
  }, []);

  const handlePopUp = () => {
    setOpen(!open);
  };

  const Heading = {
    width: "w65",
    bgcolor: "bgwhite",
    marginbottom: "mb1",
    isPopUp: "yes",
    onClose: handlePopUp,
    fetchRegion: fetchRegion,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
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
                Zone Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Zone Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.name}
                  name="name"
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
                  Short Name
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.short_name}
                  name="short_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                {/* <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Zone Code
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.code}
                  name="code"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                /> */}
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
                {" "}
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Region <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={region}
                  getOptionLabel={(option) => option?.name || ""} // Fix undefined issue
                  value={region.filter((option) =>
                    selectedRegion.includes(option.id)
                  )} // Fix selection issue
                  onChange={(event, newValue) => {
                    handleRegionChange(event, newValue);
                  }}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="demographicInclude"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick..."
                      {...params}
                    />
                  )}
                />
                {!style?.isPopUp && (
                  <div>
                    <Button
                      // className={` ${classes.textdecorationnone}`}
                      className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                      onClick={handlePopUp}
                    >
                      Create Region
                    </Button>
                  </div>
                )}
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
        <AddRegionFormPopUp style={Heading} />
      </Modal>
    </>
  );
}
export default AddZoneForm;
