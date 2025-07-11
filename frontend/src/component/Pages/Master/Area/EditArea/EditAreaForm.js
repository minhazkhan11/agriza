import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
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

function EditAreaForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const location = useLocation();
  const rowId = location.state;
  
  const [formDetails, setFormDetails] = useState({
    id:rowId,
    name: "",
    short_name: "",
    code: null,
    teritari_ids: "",
  });

  const [teritary, setTeritary] = useState([]);
  const [selectedTeritary, setSelectedTeritary] = useState([]);

  const handleTeritaryChange = (event, newValue) => {
    setSelectedTeritary(newValue.map((subject) => subject.id));
    setFormDetails((pre) => ({
      ...pre,
      teritari_ids: newValue.map((subject) => subject.id),
    }));
  };

  const handleCancel = () => {
    navigate("/area-list");
  };

  // /v1/admin/business_area_teritari/1
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_area/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      const area = response.data.business_areaData;

// Set basic form details
setFormDetails({
  id:rowId,
  name: area.name || "",
  short_name: area.short_name || "",
  code: area.code || null,
  teritari_ids:area.teritari_ids|| []
});
setSelectedTeritary(area.teritari_ids|| [])

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])
  


  const handleFormSubmit = () => {

   if (!formDetails.name.trim()) {
      toast.error("Area Name is required");
      return;
    }
    if (!formDetails.teritari_ids) {
      toast.error("territory is required");
      return;
    }

    const data = {
      business_area: formDetails,
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_area/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Area Information Updated Successfully");
         setTimeout(() => {
          navigate('/area-list')
         }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchTeritari = async () => {
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
        setTeritary(response?.data?.product_areas);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Marketer:", error);
    }
  };

  useEffect(() => {
    fetchTeritari();
  }, []);

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
                Area Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Area Name <span className={classes.textcolorred}>*</span>
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
                  Area Code
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
                  area <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={teritary}
                  getOptionLabel={(option) => option?.name || ""} // Fix undefined issue
                  value={teritary.filter((option) =>
                    selectedTeritary.includes(option.id)
                  )} // Fix selection issue
                  onChange={(event, newValue) => {
                    handleTeritaryChange(event, newValue);
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
    </>
  );
}
export default EditAreaForm;
