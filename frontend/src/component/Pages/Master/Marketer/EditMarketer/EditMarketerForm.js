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
import UploadPreview from "../../../../CustomComponent/UploadPreview";

function EditMarketerForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [alias, setAlias] = useState("");

  const [thumbnailImage, setThumbnailImage] = useState([]);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState();

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

  const { state } = useLocation();
  const rowId = state;

  const classes = useStyles();

  const handleClose = () => {
    navigate("/marketer-list");
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/marketers/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.marketers;
        setThumbnailImage(data?.photo);
        setThumbnailImagePreview(data?.photo);
        setName(data.marketer_name);
        setDescription(data.description);
        setAlias(data.alias_name);
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
    if (!name.trim()) {
      toast.warn("Please enter marketer name.");
      return;
    }
    const formData = new FormData();
    const data = {
      id:rowId,
      marketer_name: name,
      alias_name: alias,
      description: description,
    };

    formData.append("marketers", JSON.stringify(data));
    formData.append("photo", thumbnailImage);

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/marketers/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          navigate("/marketer-list");
        }, 2000);
        toast.success("Marketer updated successfully");
      })
      .catch((error) => {
        console.error("Error changed Marketer status:", error);
        toast.error("Marketer is not updated");
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
                Edit Marketer Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Marketer Legal Name{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Marketer Legal Name"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Alias Name (Short Name)
                </FormLabel>
                <TextField
                  onChange={(e) => setAlias(e.target.value)}
                  value={alias}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Alias Name"
                />
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
                 Marketer Image
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
              <div className={`${classes.w24} ${classes.mt1_5}`}></div>
            </div>
          </div>
          <div className={`${classes.dflex} ${classes.justifyflexend}`}>
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
export default EditMarketerForm;
