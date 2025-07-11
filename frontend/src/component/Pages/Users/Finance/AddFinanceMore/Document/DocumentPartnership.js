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
import useStyles from "../../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import UploadPreview from "../../../../../CustomComponent/UploadPreview";
import UploadButtons from "../../../../../CustomComponent/UploadButton2";

function DocumentPartnership({ businessEntityId }) {
  const classes = useStyles();
  const { state } = useLocation();

  const registerd_type = state?.be_information.registerd_type;
  const beInformation = state?.be_information;
  const basicDetails = state?.be_document;

  const initialData = {
    beInformation,
  };

  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [businessEntity, setBusinessEntity] = useState(businessEntityId);
  const [thumbnailImage, setThumbnailImage] = useState(basicDetails);
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
    navigate("/lending-list");
  };

  // const handleThumbnailImageChangeNew = (image) => {
  //   setThumbnailImage(image);
  // };

  const handleThumbnailImageChangeTest = (e, fieldName) => {
    console.log("fieldName", e.target, fieldName);
    const file = e.target.files[0];
    if (file) {
      handleThumbnailImageChangeNew(fieldName, file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailImagePreview((prev) => ({
          ...prev,
          [fieldName]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailImageChangeNew = async (field, image) => {
    if (!businessEntity) {
      toast.warn("Business Entity ID is missing.");
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
        toast.success(`${field} uploaded successfully!`);
        console.log("response123456", response);
        setThumbnailImage(response.data.be_document);
      } else {
        toast.error(`Upload failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error uploading ${field}`);
      console.error("Upload error:", error);
    }
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
                  fieldName="attested_pan_of_the_partnership"
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
                  Attested GST Certificate (3 pager)
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
                    fieldName="gst_certificate"
                    thumbnailImagePreview={thumbnailImagePreview}
                    setThumbnailImagePreview={setThumbnailImagePreview}
                  />
                </div>
                <div className={`${classes.w32}`}></div>
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
                  Partnership agreement <span className={classes.textcolorred}>*</span>
                </Typography>
                <div className={`${classes.w32}`}>
                  <UploadButtons
                    onImageChange={handleThumbnailImageChangeNew}
                    handleThumbnailImageChangeTest={
                      handleThumbnailImageChangeTest
                    }
                    setThumbnailImage={setThumbnailImage}
                    thumbnailImage={thumbnailImage}
                    fieldName="partnership_agreement"
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
                  Self-attested PAN of the authorized signatory <span className={classes.textcolorred}>*</span>
                </Typography>
                <div className={`${classes.w32}`}>
                  <UploadButtons
                    onImageChange={handleThumbnailImageChangeNew}
                    handleThumbnailImageChangeTest={
                      handleThumbnailImageChangeTest
                    }
                    setThumbnailImage={setThumbnailImage}
                    thumbnailImage={thumbnailImage}
                    fieldName="self_attested_pan"
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
                  Self-attested Adhaar of the authorized signatory <span className={classes.textcolorred}>*</span>
                </Typography>
                <div className={`${classes.w32}`}>
                  <UploadButtons
                    onImageChange={handleThumbnailImageChangeNew}
                    handleThumbnailImageChangeTest={
                      handleThumbnailImageChangeTest
                    }
                    setThumbnailImage={setThumbnailImage}
                    thumbnailImage={thumbnailImage}
                    fieldName="self_attested_adhaar"
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
                   Bank statement of 1 Year <span className={classes.textcolorred}>*</span>
                </Typography>
                <div className={`${classes.w32}`}>
                  <UploadButtons
                    onImageChange={handleThumbnailImageChangeNew}
                    handleThumbnailImageChangeTest={
                      handleThumbnailImageChangeTest
                    }
                    setThumbnailImage={setThumbnailImage}
                    thumbnailImage={thumbnailImage}
                    fieldName="bank_statement"
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
                   GST Returns of last 1-year
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
                    Establishment, etc.) 
                </Typography>
                <div className={`${classes.w32}`}>
                  <UploadButtons
                    onImageChange={handleThumbnailImageChangeNew}
                    handleThumbnailImageChangeTest={
                      handleThumbnailImageChangeTest
                    }
                    setThumbnailImage={setThumbnailImage}
                    thumbnailImage={thumbnailImage}
                    fieldName="any_local_registration_number_document"
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
                       Govt license of the retailer <span className={classes.textcolorred}>*</span>
                </Typography>
                <div className={`${classes.w32}`}>
                  <UploadButtons
                    onImageChange={handleThumbnailImageChangeNew}
                    handleThumbnailImageChangeTest={
                      handleThumbnailImageChangeTest
                    }
                    setThumbnailImage={setThumbnailImage}
                    thumbnailImage={thumbnailImage}
                    fieldName="govt_license_of_the_retaller"
                    thumbnailImagePreview={thumbnailImagePreview}
                    setThumbnailImagePreview={setThumbnailImagePreview}
                  />
                </div>
                <div className={`${classes.w32}`}></div>
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
              onClick={handleClose}
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
