import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import useStyles from "../../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";

function AddRackForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState([]);
  const [rack, setRack] = useState([{ name: "" }]);

  const handleWarehouseChange = (event, newValue) => {
    setSelectedWarehouse(newValue.id);
  };

  const classes = useStyles();

  const handleClose = () => {
    navigate("/rack-list");
  };

  const handleFormSubmit = () => {
    const isValid = rack.every((item) => item.name.trim() === "");

    if (!String(selectedWarehouse).trim()) {
      toast.warn("Please Select Warehouse");
      return;
    }
    if (isValid) {
      toast.warn("Rack Name Is Required");
      return;
    }

    const data = {
      warehouse_id: selectedWarehouse,
      rakes: rack,
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/rake/add`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        toast.success("Rack Created Successfully");
        setTimeout(() => {
          navigate("/rack-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchWarehouse = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_warehouse_information`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setWarehouse(response.data.warehouse_information);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

  const handleAddLink = () => {
    setRack((prevLinks) => [...prevLinks, { name: "" }]);
  };

  const handleRemoveLink = (index) => {
    setRack((prevLinks) => {
      const updatedLinks = [...prevLinks];
      updatedLinks.splice(index, 1);
      return updatedLinks;
    });
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
                Rack Details
              </Typography>
              {/* <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div> */}
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Warehouse <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={warehouse || []}
                  onChange={(event, newValue) =>
                    handleWarehouseChange(event, newValue)
                  }
                  disableClearable
                  value={warehouse.find((sub) => sub.id === selectedWarehouse)}
                  getOptionLabel={(option) => option.name}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type to pick..."
                      variant="outlined"
                      {...params}
                    />
                  )}
                  selectOnFocus
                  openOnFocus
                />

                {/* <Autocomplete
                  multiple
                  id="tags-standard"
                  options={warehouse}
                  getOptionLabel={(option) => option.name}
                  value={warehouse.filter((item) =>
                    selectedWarehouse.includes(item.id)
                  )}
                  onChange={(event, newValue) =>
                    handleWarehouseChange(event, newValue)
                  }
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="warehouse"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick..."
                      {...params}
                    />
                  )}
                /> */}
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.w100}`}
            >
              <div
                className={`${classes.dflex} ${classes.w24} ${classes.justifyspacebetween} ${classes.flexwrapwrap}`}
              ></div>

              <div
                className={`${classes.w74} ${classes.dflex}  ${classes.flexwrapwrap}`}
              >
                {rack.map((link, index) => (
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mr0_5}  ${classes.w32}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Rack <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    {/* <TextField
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Name"
                    /> */}

                    <TextField
                      onChange={(e) => {
                        const updatedLinks = [...rack];
                        updatedLinks[index].name = e.target.value;
                        setRack(updatedLinks);
                      }}
                      value={link.name}
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Name"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {rack.length >= 2 && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => handleRemoveLink(index)}
                                edge="end"
                              >
                                <IndeterminateCheckBoxOutlinedIcon />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                ))}
                <div
                  className={`${classes.inputcontainer} ${classes.justifyflexend} ${classes.dflex}`}
                >
                  <IconButton onClick={handleAddLink}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </div>
              </div>
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
export default AddRackForm;
