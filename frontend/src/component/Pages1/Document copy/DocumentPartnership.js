import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../styles";
import axios from "axios";
import { decryptData } from "../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import UploadPreview from "../../CustomComponent/UploadPreview";
const initialData = {
  is_Business: "",
};
function DocumentPartnership() {
  const classes = useStyles();
  const { state } = useLocation();

  const registerd_type = state?.be_information.registerd_type;
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [zoomAPIKey, setZoomAPIKey] = useState("");
  const [zoomAPISecret, setZoomAPISecret] = useState("");
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
  const handleClose = () => {
    navigate("/business-entity-list");
  };

  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/zoom`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.zoom;

        setZoomAPIKey(data[0]?.api_key ? data[0]?.api_key : "");
        setZoomAPISecret(data[0]?.api_secret ? data[0]?.api_secret : "");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const handleFormSubmit = () => {
    if (!zoomAPIKey) {
      toast.warn("On working");
      return;
    }

    if (!zoomAPISecret) {
      toast.warn("Please enter a Zoom API Secret.");
      return;
    }

    const data = {
      config: {
        api_key: zoomAPIKey,
        api_secret: zoomAPISecret,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/zoom/config`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
        toast.success("Zoom Account Config Updated Successfully");
      })
      .catch((error) => {
        toast.error("Failed to update Zoom Account Config");
      });
  };

  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}  ${classes.maxh68}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Attested PAN of the Partnership Firm
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
              >
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w32}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
            </div>
            {registerd_type === "registered" && (
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
              >
                <Typography
                  className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  Attested GST Certificate (3 pager)
                </Typography>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
                >
                  <TextField
                    onChange={handleThumbnailImageChange}
                    type="file"
                    variant="outlined"
                    required
                    name="photo"
                    placeholder="Enter Name"
                  />
                </div>

                <div className={`${classes.w32}`}>
                  <UploadPreview
                    thumbnailImagePreview={thumbnailImagePreview}
                  />
                </div>
              </div>
            )}

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Partnership agreement
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
              >
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w32}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
            </div>

            {/* <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Leitser for approval of borrowing from Maitreya Capital and also list of signatories for loan document and also for PDCs. (Forniat as per attached )
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
              >
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w32}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
            </div> */}

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Self-attested PAN of the authorized signatory
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
              >
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w32}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Self-attested Adhaar of the authorized signatory
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
              >
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w32}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Bank statement of 1 Year
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
              >
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w32}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
            </div>
            {registerd_type === "registered" && (
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
              >
                <Typography
                  className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  GST Returns of last 1-year
                </Typography>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
                >
                  <TextField
                    onChange={handleThumbnailImageChange}
                    type="file"
                    variant="outlined"
                    required
                    name="photo"
                    placeholder="Enter Name"
                  />
                </div>

                <div className={`${classes.w32}`}>
                  <UploadPreview
                    thumbnailImagePreview={thumbnailImagePreview}
                  />
                </div>
              </div>
            )}

            {/* <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
             PDF or Photo of Signed PDCs (The PDCs needs to be crossed A/C
                Payee and name of "Maitreya Capital And Businesis Services Pvt.
                Ltd." written on it. It should have no date and will be blank.)
                </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
              >
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w32}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
            </div> */}

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Any local registration number/document (for e.g. Shop &
                Establishment, etc. )
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
              >
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w32}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Govt license of the retaller
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
              >
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w32}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className={`${classes.custombtnblue}`}
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default DocumentPartnership;
