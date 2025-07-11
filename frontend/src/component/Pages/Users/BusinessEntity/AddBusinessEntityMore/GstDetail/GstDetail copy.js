import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Modal,
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
import { useLocation } from "react-router-dom";
import AddMoreAndRemoveButton from "../../../../../CustomComponent/AddMoreAndRemoveButton";
import { Autocomplete } from "@material-ui/lab";
import { Stack } from "@mui/material";
import CustomizedAccordions from "./CustomAccordion";
import OwnerNamePopUp from "./GstOwnerDetail";

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
];

function GstDetail({ setValue, businessEntityId }) {
  const classes = useStyles();

  const { state } = useLocation();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const bankDetails = state?.be_bank_details;

  const initialData =
    bankDetails && bankDetails.length > 0
      ? bankDetails.map((exp) => ({
          bank_name: exp?.bank_name || "",
          bank_account_number: exp?.bank_account_number || "",
          confirm_bank_account_number: exp?.confirm_bank_account_number || "",
          ifsc_code: exp?.ifsc_code || "",
          be_information_id: exp?.be_information_id || "",
          benificiary_name: exp?.benificiary_name || "",
          short_name: exp?.short_name || "",
        }))
      : [
          {
            bank_name: "",
            bank_account_number: "",
            confirm_bank_account_number: "",
            ifsc_code: "",
            benificiary_name: "",
            short_name: "",
            be_information_id: businessEntityId,
          },
        ];

  const [bankDetailsArray, setBankDetailsArray] = useState(initialData);
  const [ownerDetails, setOwnerDetails] = useState([]);

  const [pin, setPin] = useState([]);
  const [place, setPlace] = useState([]);
  const [ownerPlace, setOwnerPlace] = useState([]);

  const [rDistrictStateTehsil, setRDistrictStateTehsil] = useState([]);

  const [open, setOpen] = useState(false);

  const handlePopUp = () => {
    setOpen(!open);
  };

  const handleAddBankDetailsArrayRow = () => {
    setBankDetailsArray([
      ...bankDetailsArray,
      {
        bank_name: "",
        bank_account_number: "",
        confirm_bank_account_number: "",
        ifsc_code: "",
        benificiary_name: "",
        short_name: "",
        be_information_id: [businessEntityId],
      },
    ]);
  };

  const handleRemoveBankDetailsArray = () => {
    setBankDetailsArray((prevRows) => {
      if (prevRows.length > 1) {
        return prevRows.slice(0, -1);
      }
      return prevRows;
    });
  };

  const handleAddOwnerDetailsArrayRow = () => {
    setOwnerDetails([
      ...ownerDetails,
      {
        owner_name: "",
        father_name: "",
        email: "",
        phone: "",
        alternative_phone: "",
        r_address: "",
        pincode_id: "",
        place_id: "",
      },
    ]);
  };

  const handleRemoveOwnerDetailsArray = () => {
    setOwnerDetails((prevRows) => {
      return prevRows.slice(0, -1);
    });
  };

  const handleOwnerDetailsArrayRowChange = (index, fieldName, value) => {
    console.log("setOwnerDetailschamnge", index, fieldName, value);
    const updatedRows = [...ownerDetails];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setOwnerDetails(updatedRows);
  };

  const handleBankDetailsArrayRowChange = (index, fieldName, value) => {
    const updatedRows = [...bankDetailsArray];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setBankDetailsArray(updatedRows);
  };

  const handleClose = () => {
    setValue(3);
  };

  const handleFormSubmit = () => {
    for (let row of bankDetailsArray) {
      if (!row.bank_account_number.trim()) {
        toast.warn("Please enter a bank account number.");
        return;
      }
      if (!row.confirm_bank_account_number.trim()) {
        toast.warn("Please enter a confirm bank account number.");
        return;
      }

      if (!row.bank_name.trim()) {
        toast.warn("Please enter a bank name.");
        return;
      }
      if (!row.ifsc_code.trim()) {
        toast.warn("Please enter an IFSC code.");
        return;
      }
      if (!row.benificiary_name.trim()) {
        toast.warn("Please enter a benificiary name.");
        return;
      }
      if (!row.short_name.trim()) {
        toast.warn("Please enter a short name.");
        return;
      }
      if (row.bank_account_number !== row.confirm_bank_account_number) {
        toast.warn(
          "Bank account number and confirm account number do not match."
        );
        return;
      }
    }

    const data = {
      bankdetails: bankDetailsArray,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_bank_details/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Bank Details Updated Successfully");
        setTimeout(() => {
          setValue(3);
        }, 1000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchPin = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.pin) {
        setPin(response.data.pin);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPin();
  }, []);

  const fetchOwnerPlace = async (index, pinId) => {
    if (!pinId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${pinId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setOwnerPlace((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.place;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching Place: ", error);
    }
  };

  const fetchPlace = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${bankDetailsArray[0].pincode_id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.place) {
        setPlace(response.data.place);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Place:", error);
    }
  };

  useEffect(() => {
    fetchPlace(bankDetailsArray[0].pincode_id);
  }, [bankDetailsArray[0].pincode_id]);

  const fetchRDistrictStateTehsil = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${bankDetailsArray[0].pincode_id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.pin) {
        setRDistrictStateTehsil(response.data.pin);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchRDistrictStateTehsil(bankDetailsArray[0].pincode_id);
  }, [bankDetailsArray[0].pincode_id]);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const Heading = {
    width: "w65",
    bgcolor: "bgwhite",
    marginbottom: "mb1",
    isPopUp: "yes",
    onClose: handlePopUp,
  };

  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}  ${classes.maxh68}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div>
            {bankDetailsArray.map((row, index) => (
              <div
                key={index}
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
                    <div>GST Details</div>
                  </Typography>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      GST Number <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleBankDetailsArrayRowChange(
                          index,
                          "bank_account_number",
                          e.target.value
                        )
                      }
                      value={row.bank_account_number}
                      name="category_name"
                      type="password"
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/^\d$/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                          ].includes(e.key)
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Legal Name <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleBankDetailsArrayRowChange(
                          index,
                          "legal_name",
                          e.target.value
                        )
                      }
                      value={row.confirm_bank_account_number}
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
                      Trade Name <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleBankDetailsArrayRowChange(
                          index,
                          "trade_name",
                          e.target.value
                        )
                      }
                      value={row.confirm_bank_account_number}
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Principal Place of Business{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={
                        (e) =>
                          handleBankDetailsArrayRowChange(
                            index,
                            "r_address",
                            e.target.value
                          ) // Handle address input change
                      }
                      value={row.r_address}
                      name="r_address"
                      type="text"
                      multiline
                      rows={4}
                      variant="outlined"
                      required
                      placeholder="Type Here"
                      // fullWidth
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
                  {rDistrictStateTehsil.state && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        State
                      </FormLabel>

                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={rDistrictStateTehsil.state.state_name}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem value={rDistrictStateTehsil.state.state_name}>
                          {rDistrictStateTehsil.state.state_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {rDistrictStateTehsil.district && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        District
                      </FormLabel>

                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={rDistrictStateTehsil.district.district_name}
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={rDistrictStateTehsil.district.district_name}
                        >
                          {" "}
                          {rDistrictStateTehsil.district.district_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {rDistrictStateTehsil.tehsil && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Tehsil
                      </FormLabel>

                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={rDistrictStateTehsil.tehsil.tehsil_name}
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={rDistrictStateTehsil.tehsil.tehsil_name}
                        >
                          {rDistrictStateTehsil.tehsil.tehsil_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
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

                    <Autocomplete
                      id="state-autocomplete"
                      options={pin || []}
                      // value={selectedRPin}
                      // onChange={handleRPinChange}

                      onChange={(event, newValue) =>
                        handleBankDetailsArrayRowChange(
                          index,
                          "pincode_id",
                          newValue.id
                        )
                      }
                      disableClearable
                      value={pin.find((sub) => sub.id === row.pincode_id)}
                      getOptionLabel={(option) => option.pin_code}
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
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Place <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      id="state-autocomplete"
                      options={place || []}
                      // value={selectedRPin}
                      // onChange={handleRPinChange}

                      onChange={(event, newValue) =>
                        handleBankDetailsArrayRowChange(
                          index,
                          "place_id",
                          newValue.id
                        )
                      }
                      disableClearable
                      value={place.find((sub) => sub.id === row.place_id)}
                      getOptionLabel={(option) => option.place_name}
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
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </div>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.flexwrapwrap}`}
                >
                  <Typography
                    className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  ></Typography>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
                  >
                    <CustomizedAccordions
                      handlePopUp={handlePopUp}
                      ownerDetails={ownerDetails}
                      // updatedOwnerDetails={updatedOwnerDetails}
                      mainindex={index}
                      place={place}
                      pin={pin}
                      top100Films={top100Films}
                      rDistrictStateTehsil={rDistrictStateTehsil}
                      handleAddOwnerDetailsArrayRow={
                        handleAddOwnerDetailsArrayRow
                      }
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
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      className={`${classes.modal}`}
                      open={open}
                      onClose={handlePopUp}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <OwnerNamePopUp
                        handlePopUp={handlePopUp}
                        style={Heading}
                        handleBankDetailsArrayRowChange={
                          handleOwnerDetailsArrayRowChange
                        }
                        row={row}
                        place={place}
                        pin={pin}
                        rDistrictStateTehsil={rDistrictStateTehsil}
                        index={index}
                        ownerDetailsindex={ownerDetails.length - 1}
                        top100Films={top100Films}
                        handleRemoveOwnerDetailsArray={
                          handleRemoveOwnerDetailsArray
                        }
                      />
                    </Modal>
                  </div>
                </div>
              </div>
            ))}
            {bankDetailsArray.length && (
              <div className={`${classes.dflex} ${classes.justifyflexend}`}>
                <AddMoreAndRemoveButton
                  handleAdd={handleAddBankDetailsArrayRow}
                  handleRemove={handleRemoveBankDetailsArray}
                  data={bankDetailsArray}
                />
              </div>
            )}
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Skip
            </Button>
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
export default GstDetail;
