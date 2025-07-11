import React, { useState } from "react";
import {
  Button,
  Fade,
  FormLabel,
  TextField,
  Typography,
  Link,
} from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";
import { Divider } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { useNavigate } from "react-router-dom";
import bulkTelecaller from "../telecaller.csv";

const AddTelecaller = (props) => {
  const { open, handleOpenClose, fetchData } = props;
  const classes = useStyles();
  const navigate = useNavigate();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [name, setName] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = bulkTelecaller;
    link.setAttribute("download", "telecaller.csv");

    // Append to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Check if the download started (link exists in document)
    if (document.body.contains(link)) {
      toast.success(
        "Sample file for adding learners in bulk has been downloaded"
      );
    } else {
      toast.error(
        "Failed to download the bulk learners file. Please try again."
      );
    }

    // Clean up
    link.parentNode.removeChild(link);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (!name) {
      toast.warn("Please enter a name.");
      return;
    }

    if (!csvFile) {
      toast.warn("Please select a csv file.");
      return;
    }

    const formData = new FormData();
    formData.append("telecaller", JSON.stringify({ file_name: name }));
    formData.append("file", csvFile);

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/telecallers/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          fetchData();
          handleOpenClose();
        }, 2000);
        toast.success("Telecaller created successfully");
      })
      .catch((error) => {
        toast.error("Telecaller is not created");
      });
  };

  return (
    <>
      <ToastContainer />
      <Fade in={open}>
        <div
          className={`${classes.ebookpopup} ${classes.p1} ${classes.positionrelative} `}
        >
          <Button className={`${classes.closebtn}`}>
            <ClearIcon
              className={`${classes.textcolorwhite}`}
              onClick={handleOpenClose}
            />
          </Button>

          <Typography
            className={`${classes.lightblackcolor} ${classes.fontfamilyDMSans} ${classes.fontsize} ${classes.fw700} ${classes.lineheight}`}
          >
            Add Telecaller Data
          </Typography>
          <div className={`${classes.dflex} ${classes.alignitemscenter}`}>
            <Typography
              variant="subtitle1"
              className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fontsize3}`}
            >
              Want to Add in Bulk ?
            </Typography>
            <Link
              className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fw600} ${classes.fontsize3} ${classes.textcolorlink} ${classes.ml0_5} ${classes.textdecorationnone}`}
            >
              <Link
                onClick={handleDownload}
                className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fw600} ${classes.fontsize3} ${classes.textcolorlink} ${classes.ml0_3} ${classes.textdecorationnone} ${classes.cursorpointer} ${classes.customButtonClass}`}
                to="#"
              >
                Download bulk Sample File
              </Link>
            </Link>
          </div>
          <Divider className={`${classes.mt1} ${classes.background00577B}`} />
          <div className={`${classes.pagescroll} ${classes.maxh75}`}>
            <div
              className={`${classes.dflex} ${classes.justifycenter} ${classes.flexdirectioncolumn} ${classes.mx0_5}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
          
             `}
              >
                Name <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                type="text"
                variant="outlined"
                required
                placeholder="Type Here"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.justifycenter} ${classes.flexdirectioncolumn} ${classes.mx0_5}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
         
             `}
              >
                Select Csv <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <div className={`${classes.p0_5} ${classes.border1}`}>
                <input type="file" accept=".csv" onChange={handleFileChange} />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1} `}
            >
              <Button
                className={`${classes.border1}  ${classes.fontFamilyJost} ${classes.fw600}  ${classes.lightbrowncolor} ${classes.borderradius0375} ${classes.m0_5} ${classes.w30}`}
                onClick={handleOpenClose}
              >
                Cancel
              </Button>
              <Button
                className={`${classes.fontFamilyJost} ${classes.fw600} ${classes.bgdarkblue} ${classes.textcolorwhite}  ${classes.m0_5} ${classes.w30}`}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default AddTelecaller;
