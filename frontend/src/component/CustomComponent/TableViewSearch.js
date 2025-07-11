import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { ReactComponent as ExportIcon } from "../images/commonicon/exporticon.svg";
import { ReactComponent as ImportIcon } from "../images/commonicon/importicon.svg";
import { ReactComponent as AllCommentIcon } from "../images/commonicon/commentbtnicon.svg";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../crypto";
import SearchIcon from "@material-ui/icons/Search";
import useStyles from "../../styles";
import { toast } from "react-toastify";
import axios from "axios";

function TableViewSearch(props) {
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const classes = useStyles();
  const { Heading, onSearch, deliveryType, setDeliveryType } = props;
  const [searchInput, setSearchInput] = useState("");
  const fileInputRef = useRef();

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(Heading[0].importApiUrl, formData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("File uploaded successfully");
        Heading[0].fetchData();
      } else {
        throw new Error("Failed to upload the file");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while uploading the file"
      );
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(Heading[0].exportApiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        window.open(response.data.file_url, "_blank");
        toast.success("CSV has been downloaded successfully.");
      } else {
        toast.error("Failed to download the CSV file.");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred while fetching the data.";
      toast.error(errorMessage);
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
          <div className={`${classes.dflex} ${classes.justifyflexend} `}>
            {data.allcomments && (
              <div>
                <Button
                  className={`${classes.border1} ${classes.textcolorblue} ${classes.fontFamilyInter} ${classes.fontSize08} ${classes.fw500}`}
                  onClick={() => {
                    navigate("/admin/allcomments");
                  }}
                >
                  All Comments <AllCommentIcon className={`${classes.ml1}`} />
                </Button>
              </div>
            )}
            {data.import && (
              <div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".csv"
                />
                <Button
                  onClick={() => fileInputRef.current.click()}
                  className={`${classes.custombtnoutline} ${classes.ml1}`}
                >
                  Import Excel File <ImportIcon className={`${classes.ml1}`} />
                </Button>
              </div>
            )}
            {data.export && (
              <div>
                <Button
                  onClick={handleExport}
                  className={`${classes.custombtnblue} ${classes.ml1}`}
                >
                  Export File <ExportIcon className={`${classes.ml1}`} />
                </Button>
              </div>
            )}
          </div>
          {deliveryType && (
            <div
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.w100}  ${classes.mt0_5}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Delivery
              </FormLabel>
              <RadioGroup
                className={`${classes.ml1} ${classes.radiocolor}`}
                row
                aria-label="Delivery Type"
                name="deliveryType"
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
              >
                <FormControlLabel value="ex" control={<Radio />} label="EX" />
                <FormControlLabel value="for" control={<Radio />} label="FOR" />
              </RadioGroup>
            </div>
          )}
          {data.inputlable && (
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.alignitemsend}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {/* {data.inputlable} */}
              </FormLabel>
              <div className={`${classes.dflex}`}>
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
          )}
        </div>
      ))}
    </>
  );
}

export default TableViewSearch;
