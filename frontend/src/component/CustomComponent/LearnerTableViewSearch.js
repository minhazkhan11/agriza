import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  FormLabel,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { ReactComponent as ExportIcon } from "../images/commonicon/exporticon.svg";
import { ReactComponent as ImportIcon } from "../images/commonicon/importicon.svg";
import useStyles from "../../styles";
import { toast } from "react-toastify";
import axios from "axios";

function LearnerTableViewSearch(props) {
  const classes = useStyles();
  const { fetchData, learner, decryptedToken, Heading, onSearch } = props;
  const [searchInput, setSearchInput] = useState("");
  const fileInputRef = useRef();

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const [fileURL, setFileURL] = useState("");
  const exportApi = async (decryptedToken) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner/export/all`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        setFileURL(response.data.file_url);
        fetchData();
        // toast.success("Result CSV has been downloaded successfully.");
      } else {
        // toast.error("Failed to download the CSV file.");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred while fetching the data.";
      toast.error(errorMessage);
      fetchData();
    }
  };

  useEffect(() => {
    if (learner && decryptedToken) {
      exportApi(decryptedToken);
    }
  }, [learner, decryptedToken]);

  const handleExportClick = () => {
    if (fileURL && decryptedToken) {
      window.open(fileURL, "_blank");
      toast.success("CSV has been downloaded successfully.");
    } else {
      toast.error("Export file is not available for this.");
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner/import/csv`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("File uploaded successfully");
        fetchData();
      } else {
        throw new Error("Failed to upload the file");
      }
    } catch (error) {
      fetchData();

      // Check if the error response is an array and display each error message in its own toast
      if (error.response && Array.isArray(error.response.data)) {
        error.response.data.forEach((err) => {
          const errorMessage = Object.entries(err)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          toast.error(errorMessage);
        });
      } else {
        fetchData();

        // Fallback for other types of errors (not an array of objects)
        const errorMessage =
          error.response && error.response.data.message
            ? error.response.data.message
            : "An error occurred while uploading the file";
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (onSearch) {
      onSearch(searchInput);
    }
  }, [searchInput, onSearch]);

  return (
    <>
      {Heading?.map((data) => (
        <div
          key={data.id}
          className={`${classes.dflex} ${classes.w100} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.py1} ${classes.px1_5} ${classes.inputborder}`}
        >
          <div>
            {data.exportimport && (
              <div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".xlsx, .csv"
                />
                <Button
                  onClick={() => fileInputRef.current.click()}
                  className={`${classes.custombtnoutline} ${classes.ml1}`}
                >
                  Import CSV File <ImportIcon className={`${classes.ml1}`} />
                </Button>
                <Button
                  className={`${classes.custombtnblue} ${classes.ml1}`}
                  onClick={handleExportClick}
                  type=""
                >
                  Export File <ExportIcon className={`${classes.ml1}`} />
                </Button>
              </div>
            )}
          </div>
          <div
            className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w30}`}
          >
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
              {/* {data.inputlable} */}
            </FormLabel>
            <div className={`${classes.dflex} ${classes.justifyflexend}`}>
              <TextField
                className={`${classes.textcolorformlabel} ${classes.fontsize3}`}
                style={{
                  width: "300px",
                }}
                type="text"
                variant="outlined"
                required
                placeholder={data.inputplaceholder}
                value={searchInput}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {/* <Button
                className={`${classes.custombtnblue} ${classes.ml1}`}
                onClick={() => onSearch && onSearch(searchInput)}
              >
                Search
              </Button> */}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default LearnerTableViewSearch;
