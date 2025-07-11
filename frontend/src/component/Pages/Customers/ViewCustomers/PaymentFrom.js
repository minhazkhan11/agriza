
import React, { useState } from "react";
import useStyles from "../../../../styles";
import PageHeader from "../../PageHeader";
import { TextField, FormLabel, Button, MenuItem, Select } from "@material-ui/core";
import UploadPreview from "../../../CustomComponent/UploadPreview";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";


function PaymentFrom({ detail, handlePopUp, rowData }) {
  const classes = useStyles();
  console.log("detail", rowData);


  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const initialData = {
    name: "",
    Comments: "",
    date: "",
    amount: "",
    mode: "",
    transactionId: "",
    payments_image: null,
    customer_be_id: rowData?.id,
  };

  const [formDetails, setFormDetails] = useState(initialData);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState("");
  console.log(formDetails, "formDetails");

  const Heading = [
    {
      mainheading: detail.title,
      height: "maxh52",
      style: "viewtable",
      checkboxselection: "true",
    },
  ];

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleImage = async (e, field) => {
    const file = e.target.files[0];

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

        handleFormChange("payments_image", uploadedFileUrl);
      } else {
        toast.error(`Upload failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error uploading ${field}`);
      console.error("Upload error:", error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const payload = {
        order_payments: {
          name: formDetails.name,
          mode_of_payment: formDetails.mode,
          transaction_id: formDetails.transactionId,
          amount: formDetails.amount,
          transaction_date: formDetails.date,
          Comments: formDetails.Comments,
          customer_be_id: formDetails?.customer_be_id,
          payments_image: formDetails.payments_image,
          entity_type: "customer",
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_payments/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Payment added successfully!");
        handlePopUp(); // Close popup or reset form
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Submission failed!");
      console.error("Submit error:", error);
    }
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
        {/* Name */}
        <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5}`}>
          <FormLabel className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fontstylenormal} ${classes.fw600} ${classes.lineheight}`}>
            Name <span className={classes.textcolorred}>*</span>
          </FormLabel>
          <TextField
            value={formDetails.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
            type="text"
            variant="outlined"
            required
            placeholder="Enter Name"
          />
        </div>

        {/* Amount */}
        <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5}`}>
          <FormLabel className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fontstylenormal} ${classes.fw600} ${classes.lineheight}`}>
            Amount <span className={classes.textcolorred}>*</span>
          </FormLabel>
          <TextField
            value={formDetails.amount}
            onChange={(e) => handleFormChange("amount", e.target.value)}
            type="number"
            variant="outlined"
            required
            placeholder="Enter Amount"
          />
        </div>

        {/* Mode of Payment */}
        <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5}`}>
          <FormLabel className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}>
            Mode of Payment <span className={classes.textcolorred}>*</span>
          </FormLabel>
          <Select
            value={formDetails.mode}
            onChange={(e) => handleFormChange("mode", e.target.value)}
            variant="outlined"
            required
            displayEmpty
          >
            <MenuItem value="" disabled>Select Mode</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Net Banking">Net Banking</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </div>


        {/* Transaction ID */}
        <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5}`}>
          <FormLabel className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}>
            Transaction ID <span className={classes.textcolorred}>*</span>
          </FormLabel>
          <TextField
            value={formDetails.transactionId}
            onChange={(e) => handleFormChange("transactionId", e.target.value)}
            type="text"
            variant="outlined"
            required
            placeholder="Enter Transaction ID"
          />
        </div>

        {/* Transaction Date */}
        <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5}`}>
          <FormLabel className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}>
            Transaction Date <span className={classes.textcolorred}>*</span>
          </FormLabel>
          <TextField
            value={formDetails.date}
            onChange={(e) => handleFormChange("date", e.target.value)}
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

        {/* Comments */}
        <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mb0_5}`}>
          <FormLabel className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}>
            Comments
          </FormLabel>
          <TextField
            value={formDetails.Comments}
            onChange={(e) => handleFormChange("Comments", e.target.value)}
            type="text"
            variant="outlined"
            placeholder="Type Here"
            multiline
            rows={2}
          />
        </div>

        {/* Image Upload */}
        <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100}`}>
          <FormLabel className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}>
            Images
          </FormLabel>
          <TextField
            name="payments_image"
            onChange={(e) => handleImage(e, "payments_image")}
            type="file"
            variant="outlined"
            required
          />
        </div>

        {/* Image Preview */}
        {thumbnailImagePreview && (
          <div className={`${classes.w24} ${classes.mt1_5}`}>
            <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}>
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

export default PaymentFrom;
