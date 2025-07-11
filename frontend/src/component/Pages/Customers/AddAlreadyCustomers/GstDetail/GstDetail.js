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
import useStyles from "../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AddMoreAndRemoveButton from "../../../../CustomComponent/AddMoreAndRemoveButton";
import { Autocomplete } from "@material-ui/lab";
import CustomizedAccordions from "./CustomAccordion";
import GstOwnerDetail from "./GstOwnerDetail";
import EditGstOwnerDetail from "./EditGstOwnerDetail";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const basicDetails = state?.be_gst_details;

  const initialData =
    basicDetails && basicDetails.length > 0
      ? basicDetails.map((exp) => ({
          ...(exp?.id && { id: exp.id }),
          gst_number: exp?.gst_number || "",
          legal_name: exp?.legal_name || "",
          trade_name: exp?.trade_name || "",
          address_of_principal_place: exp?.address_of_principal_place || "",
          place_id: exp?.place_id || "",
          pin_id: exp?.pin_id || "",
          be_information_id: businessEntityId,
          persons: exp?.persons || [],
          isEditable: false,
        }))
      : [
          {
            gst_number: "",
            legal_name: "",
            trade_name: "",
            address_of_principal_place: "",
            place_id: "",
            pin_id: "",
            be_information_id: businessEntityId,
            persons: [],
            isEditable: true,
          },
        ];

  const [bankDetailsArray, setBankDetailsArray] = useState(initialData);

  const [pin, setPin] = useState([]);
  const [place, setPlace] = useState([]);
  const [person, setPerson] = useState([]);

  const [rDistrictStateTehsil, setRDistrictStateTehsil] = useState([]);

  const [open, setOpen] = useState(false);
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [openEditModalIndex, setOpenEditModalIndex] = useState(null);
  const [openEditModalOwnerIndex, setOpenEditModalOwnerIndex] = useState(null);
  const handleOpenModal = (bankIndex) => {
    setOpenModalIndex(bankIndex); // Set the specific bank index
  };

  const handleCloseModal = () => {
    setOpenModalIndex(null); // Close the modal
  };

  const handleEditClose = (index) => {
    setOpenEditModalIndex(null); // Set the specific bank index
  };

  const handleEdit = (bankIndex, index) => {
    setOpenEditModalIndex(bankIndex);
    setOpenEditModalOwnerIndex(index);
  };

  const handlePopUp = () => {
    setOpen(!open);
  };

  const handleAddBankDetailsArrayRow = () => {
    setBankDetailsArray((prev) => [
      ...prev,
      {
        gst_number: "",
        legal_name: "",
        trade_name: "",
        address_of_principal_place: "",
        place_id: "",
        pin_id: "",
        be_information_id: businessEntityId,
        persons: [],
        isEditable: true,
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

  const handleAddOwnerDetailsArrayRow = (bankIndex) => {
    setBankDetailsArray((prev) =>
      prev.map((bank, i) =>
        i === bankIndex
          ? {
              ...bank,
              persons: [
                ...bank.persons,
                {
                  first_name: "",
                  father_name: "",
                  email: "",
                  phone: "",
                  alternative_phone: "",
                  r_address: "",
                  pincode_id: "",
                  place_id: "",
                },
              ],
            }
          : bank
      )
    );
  };

  const handleRemoveOwnerDetailsArray = (bankIndex, ownerIndex) => {
    setBankDetailsArray((prev) =>
      prev.map((bank, i) =>
        i === bankIndex
          ? {
              ...bank,
              persons: bank.persons.filter((_, j) => j !== ownerIndex),
            }
          : bank
      )
    );
  };

  const handleOwnerDetailsArrayRowChange = (
    bankIndex,
    ownerIndex,
    field,
    value
  ) => {
    setBankDetailsArray((prev) =>
      prev.map((bank, i) =>
        i === bankIndex
          ? {
              ...bank,
              persons: bank.persons.map((owner, j) =>
                j === ownerIndex ? { ...owner, [field]: value } : owner
              ),
            }
          : bank
      )
    );
  };

  const handleBankDetailsArrayRowChange = (bankIndex, field, value) => {
    setBankDetailsArray((prev) =>
      prev.map((bank, i) =>
        i === bankIndex ? { ...bank, [field]: value } : bank
      )
    );
  };

  const handleClose = () => {
    navigate("/customer-list");
  };

  const handleFormSubmit = () => {
    for (let row of bankDetailsArray) {
      if (!row.gst_number.trim()) {
        toast.warn("Please enter a GST Number.");
        return;
      }
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

      if (!gstRegex.test(row.gst_number.trim().toUpperCase())) {
        toast.error(
          "GST Number must be in a valid format (e.g., 01ABCDE1234F1Z5)."
        );
        return;
      }
      if (!row.legal_name.trim()) {
        toast.warn("Please enter a Legal Name.");
        return;
      }

      if (!row.trade_name.trim()) {
        toast.warn("Please enter a Trade Name.");
        return;
      }

      if (!row.address_of_principal_place.trim()) {
        toast.warn("Please enter a Address Of Principal Place.");
        return;
      }

      if (!row.pin_id) {
        toast.warn("Please select a Pincode.");
        return;
      }

      if (!row.place_id) {
        toast.warn("Please select a Place");
        return;
      }

      if (row.persons.length === 0) {
        toast.warn("Please enter atleast one Key Managerial Persons Details.");
        return;
      }
    }

    const data = {
      be_gst_details: bankDetailsArray,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/customer_be_gst_details/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("GST Details Updated Successfully");
        setTimeout(() => {
          // setValue(2);
          navigate("/customer-list");
        }, 1000);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
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

  const fetchPerson = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_entity_basic/person/${id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.persons) {
        setPerson(response.data.persons);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPerson(businessEntityId);
  }, [businessEntityId]);

  const fetchPlace = async (index, pinId) => {
    if (!pinId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${pinId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setPlace((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.place;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching Place: ", error);
    }
  };

  useEffect(() => {
    bankDetailsArray.forEach((data, index) => {
      if (data.pin_id) {
        fetchPlace(index, data.pin_id);
      }
    });
  }, [bankDetailsArray]);

  // const fetchRDistrictStateTehsil = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${bankDetailsArray[0].pincode_id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${decryptedToken}`,
  //         },
  //       }
  //     );
  //     if (response.data && response.data.pin) {
  //       setRDistrictStateTehsil(response.data.pin);
  //     } else {
  //       console.error("Invalid API response format:", response);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Pin:", error);
  //   }
  // };

  const fetchRDistrictStateTehsil = async (index, pinId) => {
    console.log("pinId", pinId);
    if (!pinId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${pinId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setRDistrictStateTehsil((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.pin;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching Place: ", error);
    }
  };

  useEffect(() => {
    bankDetailsArray.forEach((data, index) => {
      if (data.pin_id) {
        fetchPlace(index, data.pin_id);
      }
    });
  }, [bankDetailsArray]);

  useEffect(() => {
    bankDetailsArray.forEach((data, index) => {
      if (data.pin_id) {
        fetchRDistrictStateTehsil(index, data.pin_id);
      }
    });
  }, [bankDetailsArray]);

  // useEffect(() => {
  //   fetchRDistrictStateTehsil(bankDetailsArray[0].pincode_id);
  // }, [bankDetailsArray[0].pincode_id]);

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
                          "gst_number",
                          e.target.value.toUpperCase()
                        )
                      }
                      value={row.gst_number}
                      name="category_name"
                      type="text"
                      inputProps={{
                        maxLength: 15,
                      }}
                      variant="outlined"
                      required
                      placeholder="Type Here"
                      disabled={!row.isEditable}
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
                      value={row.legal_name}
                      name="category_name"
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Type Here"
                      disabled={!row.isEditable}
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
                      value={row.trade_name}
                      name="category_name"
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Type Here"
                      disabled={!row.isEditable}
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
                            "address_of_principal_place",
                            e.target.value
                          ) // Handle address input change
                      }
                      value={row.address_of_principal_place}
                      name="r_address"
                      type="text"
                      multiline
                      rows={4}
                      variant="outlined"
                      required
                      placeholder="Type Here"
                      // fullWidth
                      disabled={!row.isEditable}
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
                  {rDistrictStateTehsil[index]?.state && (
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
                        value={rDistrictStateTehsil[index].state.state_name}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={rDistrictStateTehsil[index].state.state_name}
                        >
                          {rDistrictStateTehsil[index].state.state_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {rDistrictStateTehsil[index]?.district && (
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
                        value={
                          rDistrictStateTehsil[index].district.district_name
                        }
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={
                            rDistrictStateTehsil[index].district.district_name
                          }
                        >
                          {" "}
                          {rDistrictStateTehsil[index].district.district_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {rDistrictStateTehsil[index]?.tehsil && (
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
                        value={rDistrictStateTehsil[index].tehsil.tehsil_name}
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={rDistrictStateTehsil[index].tehsil.tehsil_name}
                        >
                          {rDistrictStateTehsil[index].tehsil.tehsil_name}
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
                          "pin_id",
                          newValue.id
                        )
                      }
                      disableClearable
                      value={pin?.find((sub) => sub.id === row.pin_id) || ""}
                      getOptionLabel={(option) => option.pin_code}
                      autoHighlight
                      disabled={!row.isEditable}
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
                      options={place[index] || []}
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
                      value={
                        place[index]?.find((sub) => sub.id === row.place_id) ||
                        ""
                      }
                      getOptionLabel={(option) => option.place_name}
                      autoHighlight
                      disabled={!row.isEditable}
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
                      handlePopUp={handleOpenModal}
                      ownerDetails={bankDetailsArray[index].persons}
                      isEditable={row.isEditable}
                      // updatedOwnerDetails={updatedOwnerDetails}
                      mainindex={index}
                      place={place}
                      pin={pin}
                      top100Films={top100Films}
                      rDistrictStateTehsil={rDistrictStateTehsil}
                      handleAddOwnerDetailsArrayRow={
                        handleAddOwnerDetailsArrayRow
                      }
                      setFormDetails={setBankDetailsArray}
                      handleEdit={handleEdit}
                    />
                  </div>
                </div>
                {bankDetailsArray.map((data, index) => (
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    key={index}
                  >
                    <Modal
                      className={`${classes.modal}`}
                      open={openModalIndex === index} // Open only for selected index
                      // onClose={handleCloseModal}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <GstOwnerDetail
                        handlePopUp={handleCloseModal}
                        style={Heading}
                        mainindex={index}
                        handleOwnerDetailsArrayRowChange={
                          handleOwnerDetailsArrayRowChange
                        }
                        handleRemoveOwnerDetailsArray={
                          handleRemoveOwnerDetailsArray
                        }
                        row={row}
                        person={person}
                        ownerDetailsindex={
                          bankDetailsArray[index]?.persons
                            ? bankDetailsArray[index].persons.length - 1
                            : 0
                        }
                        pin={pin}
                        personData={bankDetailsArray[index]}
                      />
                    </Modal>
                  </div>
                ))}
                {bankDetailsArray.map((data, index) => (
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    key={index}
                  >
                    <Modal
                      className={`${classes.modal}`}
                      open={openEditModalIndex === index} // Open only for selected index
                      // onClose={handleCloseModal}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <EditGstOwnerDetail
                        handlePopUp={handleEditClose}
                        style={Heading}
                        mainindex={index}
                        handleOwnerDetailsArrayRowChange={
                          handleOwnerDetailsArrayRowChange
                        }
                        handleRemoveOwnerDetailsArray={
                          handleRemoveOwnerDetailsArray
                        }
                        row={row}
                        person={person}
                        ownerDetailsindex={openEditModalOwnerIndex}
                        pin={pin}
                        personData={bankDetailsArray[index]}
                      />
                    </Modal>
                  </div>
                ))}
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
              Cancel
            </Button>
            <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Report
            </Button>
            <Button
              className={`${classes.custombtnblue}`}
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default GstDetail;
