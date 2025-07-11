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
import ReactQuill from "react-quill";

const quillModules = {
  toolbar: [
    [
      "bold",
      "italic",
      "underline",
      "strike",
      { script: "sub" },
      { script: "super" },
      { color: [] },
      { background: [] },
    ],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["code-block"],
  ],
};

const quillFormats = [
  "header",
  "font",
  "size",
  "list",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "link",
  "blockquote",
  "code-block",
  "align",
  "image",
];

function EditWhatsappTemplate({ handleChange, rowId }) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const initialData = {
    name: "",
    message: "",
  };
  const [formDetails, setFormDetails] = useState(initialData);

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  
  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/templatewhatsapp/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.template;
        
        const initialData = {
          name: data?.name,
          message: data?.message,
        };
        setFormDetails(initialData);
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
    if (!formDetails.name) {
      toast.warn("Please enter Name.");
      return;
    }

    if (!formDetails.message) {
      toast.warn("Please enter Message.");
      return;
    }

    const data = {
      template: {
        id: rowId,
        name: formDetails.name,
        message: formDetails.message,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/templatewhatsapp/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setTimeout((e) => {
          handleChange(e, 2);
        }, 2000);
        toast.success("Whatsapp Template Updated Successfully");
      })
      .catch((error) => {
        toast.error("Failed to Update Whatsapp Template");
      });
  };

  return (
    <>
      <ToastContainer />

      <FormControl className={`${classes.w100}`}>
        <div className={`${classes.py2} ${classes.px1_5}`}>
          <Typography className={`${classes.fw600}`}>
            Edit Whatsapp Template
          </Typography>
          <div
            className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6} ${classes.mt1}`}
          >
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
              Name <span className={classes.textcolorred}>*</span>
            </FormLabel>
            <TextField
              onChange={(e) => handleFormChange("name", e.target.value)}
              value={formDetails.name}
              type="text"
              variant="outlined"
              required
              placeholder="Type Here"
            />
          </div>
          <div
            className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt1} ${classes.w75}`}
          >
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
              Message <span className={classes.textcolorred}>*</span>
            </FormLabel>
            <ReactQuill
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
              value={formDetails.message}
              onChange={(value) => handleFormChange("message", value)}
              placeholder="Type here"
              modules={quillModules}
              formats={quillFormats}
            />
          </div>
        </div>

        <div className={`${classes.dflex} ${classes.justifyflexend}`}>
          <Button
            className={`${classes.custombtnoutline}`}
            onClick={(e) => handleChange(e, 2)}
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
    </>
  );
}
export default EditWhatsappTemplate;
