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
import useStyles from "../../styles";
import axios from "axios";
import { decryptData } from "../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import UploadPreview from "../CustomComponent/UploadPreview";
import UploadButtons from "../CustomComponent/UploadButton";

function EditDocumentCompany({ businessEntityId }) {
  const classes = useStyles();
  const { state } = useLocation();

  const registerd_type = state?.be_information.registerd_type;
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [businessEntity, setBusinessEntity] = useState(businessEntityId);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState(null);

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

  // const handleThumbnailImageChangeNew = (image) => {
  //   setThumbnailImage(image);
  // };

  const handleThumbnailImageChangeTest = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      handleThumbnailImageChangeNew(fieldName, file); // Use the fieldName prop dynamically
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailImageChangeNew = async (field, image) => {
    console.log('image112345' , image)
    console.log("businessEntity12", field);
    if (!businessEntity) {
      toast.warn("On working");
      return;
    }
    try {
      const formData = new FormData();
      const data = {
        be_information_id: businessEntity,
      };

      formData.append("be_documents", JSON.stringify(data));
      formData.append(field, image);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Business Area Information created successfully!");

        console.log("businessEntity1234", response.data.be_document[0]);
        setThumbnailImage(response.data.be_document[0]);
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(
          `Business Area Information is not created! ${response.data.message}`
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
        toast.error(
          "An unexpected error occurred while creating the Business Area Information."
        );
      }
      console.error("An error occurred:", error);
    }
  };

  console.log("thumbnailImage123456789", thumbnailImage);

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
                Pan of the company{" "}
                <span className={classes.textcolorred}>*</span>
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
                GST Certificate (3 pager)
                <span className={classes.textcolorred}>*</span>
              </Typography>
              <div className={`${classes.w32}`}>
                <UploadButtons
                  onImageChange={handleThumbnailImageChangeNew}
                  handleThumbnailImageChangeTest={
                    handleThumbnailImageChangeTest
                  }
                  setThumbnailImage={setThumbnailImage}
                  thumbnailImage={thumbnailImage}
                  fieldName="gst_returns_of_last_year"
                  thumbnailImagePreview={thumbnailImagePreview}
                  setThumbnailImagePreview={setThumbnailImagePreview}
                />
              </div>
              <div className={`${classes.w32}`}></div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Pan of the company{" "}
                <span className={classes.textcolorred}>*</span>
              </Typography>
              <div className={`${classes.w32}`}>
                <UploadButtons
                  onImageChange={handleThumbnailImageChangeNew}
                  handleThumbnailImageChangeTest={
                    handleThumbnailImageChangeTest
                  }
                  setThumbnailImage={setThumbnailImage}
                  thumbnailImage={thumbnailImage}
                  fieldName="pan_of_the_company"
                  thumbnailImagePreview={thumbnailImagePreview}
                  setThumbnailImagePreview={setThumbnailImagePreview}
                />
              </div>
              <div className={`${classes.w32}`}></div>
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
                  GST Certificate (3 pager){" "}
                  <span className={classes.textcolorred}>*</span>
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
                Certificate of Incorporation{" "}
                <span className={classes.textcolorred}>*</span>
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
                PAN of the authorized signatory{" "}
                <span className={classes.textcolorred}>*</span>
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
                Adhaar of the authorized signatory{" "}
                <span className={classes.textcolorred}>*</span>
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
                MOA of the company{" "}
                <span className={classes.textcolorred}>*</span>
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
                AOA of the company{" "}
                <span className={classes.textcolorred}>*</span>
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
                Bank statement of 1-year{" "}
                <span className={classes.textcolorred}>*</span>
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
                  GST Returns of last 1-year{" "}
                  <span className={classes.textcolorred}>*</span>
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
                Any local registration number/document (for e.g. Shop &
                Establishment, etc.){" "}
                <span className={classes.textcolorred}>*</span>
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
                Govt license of the retailer{" "}
                <span className={classes.textcolorred}>*</span>
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
                Loan Statement of his current loans CC/TL
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

            {/* <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Board resolution for borrowing from Maitreye Capital and list of
                authorized signatories for loan document and for PDCs (Format as
                per attached)
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
              // onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default EditDocumentCompany;
