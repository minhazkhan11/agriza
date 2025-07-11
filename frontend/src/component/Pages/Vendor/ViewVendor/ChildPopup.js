import React, { useState } from "react";
import useStyles from "../../../../styles";
import PageHeader from "../../PageHeader";
import { TextField, FormLabel, Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import UploadPreview from "../../../CustomComponent/UploadPreview";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChildPopup({ detail, popupDetail, handlePopUp, rowData }) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  console.log("innerPopupDetail12", detail);

  const initialData = {
    type: detail?.title,
    follow_up_date: "",
    afollow_up_date: "",
    Comments: "",
    customer_be_id: rowData?.id,
  };

  const [innerPopupDetail, setInnerPopupDetail] = useState(popupDetail);
  const [formDetails, setFormDetails] = useState(initialData);

  const [thumbnailImage, setThumbnailImage] = useState([]);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState("");

  const Heading = [
    {
      mainheading: detail.title,
      height: "maxh52",
      style: "viewtable",
      checkboxselection: "true",
    },
  ];

  console.log(formDetails, "formDetails");

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleImage = async (e, field) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      const entitytype = "order";

      formData.append("entitytype", entitytype);
      formData.append(field, file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/upload_to_s3bucket`,
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
        const uploadedFileUrl = response.data?.uploadedFiles?.[field] || "";

        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        handleFormChange("activity_image", uploadedFileUrl);
      } else {
        toast.error(`Upload failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error uploading ${field}`);
      console.error("Upload error:", error);
    }
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

  const handleFormSubmit = async () => {
    try {
      const payload = {
        order_activity: {
          type: formDetails.type,
          follow_up_date: formDetails.follow_up_date,
          afollow_up_date: formDetails.afollow_up_date,
          Comments: formDetails.Comments,
          customer_be_id: formDetails?.customer_be_id,
          activity_image: formDetails.activity_image,
          entity_type: "vendor",
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_activity/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Activity added successfully!");
        handlePopUp(); // Close popup or reset form
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Submission failed!");
      console.error("Submit error:", error);
    }
  };

  const handleFileUpload = (file) => {
    setThumbnailImage(file);
  };

  return (
    <div
      className={`${classes.bgwhite} ${classes.p2} ${classes.w40} ${classes.pb1} ${classes.pt1}`}
    >
      <PageHeader Heading={Heading} />

      <div
        className={`${classes.w100} ${classes.bgwhite} ${classes.borderradius6px} ${classes.mt1} ${classes.mb0_5} ${classes.dflex} ${classes.showscroll} ${classes.maxh68}`}
        style={{ flexWrap: "wrap" }}
      >
        {/* Activity Type */}
        <div
          className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5} `}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
          >
            Activity Type <span className={classes.textcolorred}>*</span>
          </FormLabel>
          {console.log("innerPopupDetail", innerPopupDetail, formDetails.type)}
          <Autocomplete
            id="state-autocomplete"
            options={(innerPopupDetail || []).filter(
              (item) =>
                item.title !== "New Order" && item.title !== "New Payments"
            )}
            value={
              innerPopupDetail?.find((sub) => sub.title === formDetails.type) ||
              null
            }
            onChange={(e, value) =>
              handleFormChange("type", value?.title || "")
            }
            disableClearable
            getOptionLabel={(option) => option.title}
            autoHighlight
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Activity Type"
                variant="outlined"
              />
            )}
            selectOnFocus
            openOnFocus
          />
        </div>

        {/* Comments */}
        <div
          className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
          >
            Comments
          </FormLabel>
          <TextField
            value={formDetails.Comments}
            onChange={(e) => handleFormChange("Comments", e.target.value)}
            type="text"
            variant="outlined"
            required
            placeholder="Type Here"
            multiline
            rows={2}
          />
        </div>

        {/* Follow Up Date */}
        <div
          className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
          >
            Follow Up Date <span className={classes.textcolorred}>*</span>
          </FormLabel>
          <TextField
            value={formDetails.date}
            onChange={(e) => handleFormChange("follow_up_date", e.target.value)}
            name="follow_up_date"
            type="date"
            variant="outlined"
            InputProps={{
              inputProps: {
                min: new Date().toISOString().split("T")[0],
              },
            }}
          />
        </div>

        {/* Follow Up Time */}
        <div
          className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
          >
            Follow Up Time <span className={classes.textcolorred}>*</span>
          </FormLabel>
          <TextField
            value={formDetails.time}
            onChange={(e) =>
              handleFormChange("afollow_up_date", e.target.value)
            }
            name="afollow_up_date"
            type="time"
            variant="outlined"
          />
        </div>

        {/* Image Upload */}
        <div
          className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
          >
            Images
          </FormLabel>
          <TextField
            name="activity_image"
            onChange={(e) => handleImage(e, "activity_image")}
            type="file"
            variant="outlined"
            required
          />
        </div>
        {thumbnailImagePreview && (
          <div className={`${classes.w24} ${classes.mt1_5}`}>
            <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div
        className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
      >
        <Button onClick={handlePopUp} className={`${classes.custombtnoutline}`}>
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          className={`${classes.custombtnblue}`}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default ChildPopup;
