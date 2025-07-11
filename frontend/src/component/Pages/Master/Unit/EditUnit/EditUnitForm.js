import React, { useState, useEffect } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

function EditUnitForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { state } = useLocation();
  const rowId = state;
  const [symbol, setSymbol] = useState("");
  const [formalName, setFormalName] = useState("");
  const [decimal, setDecimal] = useState("");
  const [uqc, setUqc] = useState([]);
  const [selectedUQC, setSelectedUQC] = useState("");
  const [selectedUQCId, setSelectedUQCId] = useState("");

  const classes = useStyles();

  const handleClose = () => {
    navigate("/unit-list");
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/units/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.unit;
        setSymbol(data.unit_name);
        setFormalName(data.formal_name);
        setDecimal(data.number_of_decimal);
        setSelectedUQC(data.uqc_id);
        setSelectedUQCId(data.uqc_id.id);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    if (rowId) {
      fetchDataFromAPI(rowId);
    }
  }, [rowId]);

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
      toast.warn("Please enter a symbol.");
      return;
    }

    const data = {
      units: {
        unit_name: symbol,
        uqc_id: selectedUQCId,
        formal_name: formalName,
        number_of_decimal: decimal,
        id: rowId,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/units/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          navigate("/unit-list");
        }, 2000);
        toast.success("Unit updated successfully");
      })
      .catch((error) => {
        console.error("Error changed Unit status:", error);
        toast.error("Unit is not updated");
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
                Edit Unit Details
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
              ></Typography>
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
          <div className={`${classes.dflex} ${classes.justifyflexend}`}>
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
export default EditUnitForm;
