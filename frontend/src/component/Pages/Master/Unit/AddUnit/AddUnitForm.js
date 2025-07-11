import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

function AddUnitForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [formalName, setFormalName] = useState("");
  const [decimal, setDecimal] = useState("");
  const [description, setDescription] = useState("");
  const [uqc, setUqc] = useState([]);
  const [selectedUQC, setSelectedUQC] = useState("");
  const [selectedUQCId, setSelectedUQCId] = useState("");

  const classes = useStyles();

  const handleClose = () => {
    navigate("/unit-list");
  };

  const handleUQCChange = (event, newValue) => {
    setSelectedUQC(newValue);
    setSelectedUQCId(newValue.id);
  };
  const fetchUQC = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/uqc`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.uqc) {
        setUqc(response.data.uqc);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Uqc:", error);
    }
  };

  useEffect(() => {
    fetchUQC();
  }, []);

  const handleFormSubmit = () => {
    if (!symbol.trim()) {
      toast.warn("Please enter a unit.");
      return;
    }

    const data = {
      units: {
        unit_name: symbol,
        uqc_id: selectedUQCId,
        formal_name: formalName,
        number_of_decimal: decimal,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/units/add`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        toast.success("Unit Created Successfully");
        setTimeout(() => {
          navigate("/unit-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Unit Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Symbol <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => setSymbol(e.target.value)}
                  value={symbol}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name Symbol"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Formal Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => setFormalName(e.target.value)}
                  value={formalName}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Formal Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              ></div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                {" "}
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  UQC <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={uqc || []}
                  value={selectedUQC}
                  onChange={handleUQCChange}
                  disableClearable
                  getOptionLabel={(option) => option.uqc_code}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type to pick product sub category..."
                      variant="outlined"
                      {...params}
                    />
                  )}
                  selectOnFocus
                  openOnFocus
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  No. of Decimal <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => setDecimal(e.target.value)}
                  value={decimal}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Decimal"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              onClick={handleClose}
              className={`${classes.custombtnoutline}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              className={`${classes.custombtnblue}`}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AddUnitForm;
