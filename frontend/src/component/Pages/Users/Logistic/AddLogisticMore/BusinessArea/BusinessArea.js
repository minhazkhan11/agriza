import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AddMoreAndRemoveButton from "../../../../../CustomComponent/AddMoreAndRemoveButton";

function BusinessArea({ setValue, businessEntityId }) {
  const { state } = useLocation();
  const businessAreaDetails = state?.be_area_information;

  const initialData =
    businessAreaDetails && businessAreaDetails.length > 0
      ? businessAreaDetails?.map((exp) => ({
          area_name: exp?.area_name,
          short_name: exp?.short_name,
          area_code: exp?.area_code,
          description: exp?.description,
          person_name: exp?.person_name,
          person_phone: exp?.person_phone,
          state_id: exp?.state_id || "",
          district_id: exp?.district_id || "",
          tehsil_id: exp?.tehsil_id || "",
          pin_id: exp?.pin_id || "",
          place_id: exp?.place_id || "",
          be_information_id: businessEntityId || "",
        }))
      : [
          {
            area_name: "",
            short_name: "",
            area_code: "",
            description: "",
            person_name: "",
            person_phone: "",
            state_id: "",
            district_id: "",
            tehsil_id: "",
            pin_id: "",
            place_id: "",
            be_information_id: businessEntityId,
          },
        ];

  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [formDetails, setFormDetails] = useState(initialData);

  const [stateData, setStateData] = useState("");

  const [district, setDistrict] = useState([]);

  const [tehsil, setTehsil] = useState("");

  const [pincode, setPincode] = useState("");

  const [place, setPlace] = useState("");

  const handleAddFormDetailsRow = () => {
    setFormDetails([
      ...formDetails,
      {
        area_name: "",
        short_name: "",
        area_code: "",
        description: "",
        person_name: "",
        person_phone: "",
        state_id: "",
        district_id: "",
        tehsil_id: "",
        pin_id: "",
        place_id: "",
        be_information_id: businessEntityId,
      },
    ]);
  };

  const handleRemoveFormDetails = () => {
    setFormDetails((prevRows) => {
      if (prevRows.length > 1) {
        return prevRows.slice(0, -1);
      }
      return prevRows;
    });
  };

  const handleFormChange = (index, fieldName, value) => {
    const updatedRows = [...formDetails];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setFormDetails(updatedRows);
    
    if (fieldName === "state_id") {
      fetchDistrict(index, value);
    }
    if (fieldName === "district_id") {
      fetchTehsil(index, value);
    }
    if (fieldName === "tehsil_id") {
      fetchPincode(index, value);
    }
    if (fieldName === "pin_id") {
      fetchPlace(index, value);
    }
  };

  const handleFormSubmit = () => {
    // if (!formDetails.arae_code.trim()) {
    //   toast.warn("Please enter a name.");
    //   return;
    // }
    // if (!formDetails.branch.trim()) {
    //   toast.warn("Please enter a description.");
    //   return;
    // }

    const data = {
      business_information: formDetails,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_area_information/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Business Area Information Updated Successfully");
        setTimeout(() => {
          setValue(3);
        }, 1000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchState = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/state`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.state) {
        setStateData(response.data.state);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching State:", error);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const fetchDistrict = async (index, stateId) => {
    if (!stateId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/district/state_id/${stateId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setDistrict((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.district;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching districts: ", error);
    }
  };

  const fetchTehsil = async (index, id) => {
    if (!id) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/tehsil/district_id/${id}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setTehsil((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.tehsil;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching tehsil: ", error);
    }
  };

  const fetchPincode = async (index, id) => {
    if (!id) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/tehsil_id/${id}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setPincode((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.pin;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching pin: ", error);
    }
  };

  const fetchPlace = async (index, id) => {
    if (!id) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${id}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setPincode((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.place;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching pin: ", error);
    }
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
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}  ${classes.maxh68}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            {formDetails.map((row, index) => (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                )}
                <>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                  >
                    <Typography
                      className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                      variant="h6"
                      display="inline"
                    >
                      {index === 0 && <div>Business Area Information</div>}
                    </Typography>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Area Name{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange(index, "area_name", e.target.value)
                        }
                        value={row.area_name}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Short Name{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange(index, "short_name", e.target.value)
                        }
                        value={row.short_name}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Area Code{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange(index, "area_code", e.target.value)
                        }
                        value={row.area_code}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
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
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Description{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange(index, "description", e.target.value)
                        }
                        value={row.description}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Person Name{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange(index, "person_name", e.target.value)
                        }
                        value={row.person_name}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Person Phone{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange(
                            index,
                            "person_phone",
                            e.target.value
                          )
                        }
                        value={row.person_phone}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
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
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        State <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={row.state_id}
                        onChange={(e) =>
                          handleFormChange(index, "state_id", e.target.value)
                        }
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                      >
                        {console.log("stateData", stateData)}
                        <MenuItem disabled value="">
                          <em className={classes.defaultselect}>Select Here</em>
                        </MenuItem>
                        {stateData &&
                          stateData.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.state_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        District <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={row.district_id}
                        onChange={(e) =>
                          handleFormChange(index, "district_id", e.target.value)
                        }
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                      >
                        <MenuItem disabled value="">
                          <em className={classes.defaultselect}>Select Here</em>
                        </MenuItem>
                        {district[index] &&
                          district[index].map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.district_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Tehsil <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={row.tehsil_id}
                        onChange={(e) =>
                          handleFormChange(index, "tehsil_id", e.target.value)
                        }
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                      >
                        <MenuItem disabled value="">
                          <em className={classes.defaultselect}>Select Here</em>
                        </MenuItem>
                        {tehsil[index] &&
                          tehsil[index].map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.tehsil_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </div>
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
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Pincode <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={row.pin_id}
                        onChange={(e) =>
                          handleFormChange(index, "pin_id", e.target.value)
                        }
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                      >
                        <MenuItem disabled value="">
                          <em className={classes.defaultselect}>Select Here</em>
                        </MenuItem>
                        {pincode[index] &&
                          pincode[index].map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.pin_id}
                            </MenuItem>
                          ))}
                      </Select>
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Place <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={row.place_id}
                        onChange={(e) =>
                          handleFormChange(index, "place_id", e.target.value)
                        }
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                      >
                        <MenuItem disabled value="">
                          <em className={classes.defaultselect}>Select Here</em>
                        </MenuItem>
                        {place[index] &&
                          place[index].map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.place_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    ></div>
                  </div>
                </>
              </React.Fragment>
            ))}
            {formDetails.length && (
              <div className={`${classes.dflex} ${classes.justifyflexend}`}>
                <AddMoreAndRemoveButton
                  handleAdd={handleAddFormDetailsRow}
                  handleRemove={handleRemoveFormDetails}
                  data={formDetails}
                />
              </div>
            )}
          </div>

          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            {/* <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Cancel
            </Button> */}
            <Button
              className={`${classes.custombtnblue}`}
              onClick={handleFormSubmit}
            >
              Next
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default BusinessArea;
