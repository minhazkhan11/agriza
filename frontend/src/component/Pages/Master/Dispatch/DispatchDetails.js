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
import useStyles from "../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Autocomplete } from "@material-ui/lab";
import UploadPreview from "../../../CustomComponent/UploadPreview";

function DispatchDetails({
  setFormDetails,
  formDetails,
  setThumbnailImagePreview,
  thumbnailImagePreview,
}) {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const handleChange = (fieldName, value) => {
    setFormDetails((prev) => ({
      ...prev,
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

        handleChange("dispatch_image", uploadedFileUrl);
      } else {
        toast.error(`Upload failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error uploading ${field}`);
      console.error("Upload error:", error);
    }
  };

  const classes = useStyles();
  return (
    <>
      <ToastContainer />
      <div
        className={` ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh62}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyaround} ${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.pb2} ${classes.px1_5}`}
          >
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                LR/BILTY Number
              </FormLabel>
              <TextField
                onChange={(event) =>
                  handleChange("bilty_number", event.target.value)
                }
                value={formDetails.bilty_number}
                name="supervisorName"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Order/Invoice Number{" "}
              </FormLabel>
              <TextField
                onChange={(event) =>
                  handleChange("order_invoice_number", event.target.value)
                }
                value={formDetails.order_invoice_number}
                name="supervisorName"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Transporter Name
              </FormLabel>
              <TextField
                onChange={(event) =>
                  handleChange("transporter_name", event.target.value)
                }
                value={formDetails.transporter_name}
                name="supervisorName"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Transporter Contact number{" "}
              </FormLabel>
              <TextField
                onChange={(event) =>
                  handleChange("transporter_contact_number", event.target.value)
                }
                value={formDetails.transporter_contact_number}
                name="supervisorName"
                type="text"
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]{10}",
                }}
                onKeyDown={(e) => {
                  if (
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    !/^\d$/.test(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Driver Name
              </FormLabel>
              <TextField
                onChange={(event) =>
                  handleChange("driver_name", event.target.value)
                }
                value={formDetails.driver_name}
                name="supervisorName"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Driver Mobile number{" "}
              </FormLabel>
              <TextField
                onChange={(event) =>
                  handleChange("driver_contact_number", event.target.value)
                }
                value={formDetails.driver_contact_number}
                name="supervisorName"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Vehicle Number
              </FormLabel>
              <TextField
                onChange={(event) =>
                  handleChange("vehicle_number", event.target.value)
                }
                value={formDetails.vehicle_number}
                name="supervisorName"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Broker Details (If any){" "}
              </FormLabel>
              <TextField
                onChange={(event) =>
                  handleChange("broker_details", event.target.value)
                }
                value={formDetails.broker_details}
                name="supervisorName"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Freight
              </FormLabel>
              <TextField
                onChange={(event) =>
                  handleChange("freight", event.target.value)
                }
                value={formDetails.freight}
                name="supervisorName"
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Payment
              </FormLabel>
              <Select
                value={formDetails.payment_type}
                onChange={(e) => handleChange("payment_type", e.target.value)}
                variant="outlined"
                required
                placeholder="Type Here"
              >
                <MenuItem value="" disabled>
                  Select Mode
                </MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="To Be Paid">To Be Paid</MenuItem>
              </Select>
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Attachments
              </FormLabel>
              <TextField
                name="attachments"
                onChange={(e) => handleImage(e, "dispatch_image")}
                type="file"
                variant="outlined"
                required
              />
            </div>

            {/* Image Preview */}
            <div className={`${classes.w30} ${classes.mt1_5}`}>
              <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w95}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                                                    ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Note
              </FormLabel>
              <TextField
                value={formDetails.note}
                onChange={(e) => handleChange("note", e.target.value)}
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
                multiline
                rows={6}
              />
            </div>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default DispatchDetails;
