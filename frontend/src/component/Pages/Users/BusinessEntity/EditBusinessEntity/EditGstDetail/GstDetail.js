import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import useStyles from "../../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import AddMoreAndRemoveButton from "../../../../../CustomComponent/AddMoreAndRemoveButton";
import { Autocomplete } from "@material-ui/lab";
import CustomizedAccordions from "./CustomAccordion";
import GstOwnerDetail from "./GstOwnerDetail";
import EditGstOwnerDetail from "./EditGstOwnerDetail";
import DeleteIcon from "@material-ui/icons/Delete";

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
  const gstDetails = state?.be_gst_details;

  console.log("basicDetails", gstDetails);

  const initialData =
    gstDetails && gstDetails.length > 0
      ? gstDetails.map((exp) => ({
          ...(exp?.id && { id: exp.id }),
          gst_number: exp?.gst_number || "",
          legal_name: exp?.legal_name || "",
          trade_name: exp?.trade_name || "",
          address_of_principal_place: exp?.address_of_principal_place || "",
          place_id: exp?.place_id || "",
          pin_id: exp?.pin_id || "",
          gst_file: exp?.gst_file || "",
          persons: exp?.persons || "",
          be_information_id: exp?.be_information_id || "",
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
  console.log("ownerDetails1223", bankDetailsArray);
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

  console.log("setBankDetailsArray", bankDetailsArray);

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

  const handleDelete = (index) => {
    setBankDetailsArray((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteWithId = async (rowId, index) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_gst_details/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      toast.success("GST Details deleted successfully");
      setBankDetailsArray((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      toast.error("GST Details is not deleted");
      console.error("Error deleting data: ", error);
    }
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
    console.log("ownerDetailsindex12", bankIndex, ownerIndex, field, value);

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

  const handleImage = async (e, index, field) => {
    const file = e.target.files[0];

    try {
      const formData = new FormData();
      const entitytype = "be_person";

      formData.append("entitytype", entitytype);
      formData.append(field, file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/upload_to_s3bucket`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`${field} uploaded successfully!`);
        const uploadedFileUrl = response.data?.uploadedFiles?.[field] || "";

        handleBankDetailsArrayRowChange(index, field, uploadedFileUrl);
      } else {
        toast.error(`Upload failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error uploading ${field}`);
      console.error("Upload error:", error);
    }
  };

  const handleBankDetailsArrayRowChange = (bankIndex, field, value) => {
    setBankDetailsArray((prev) =>
      prev.map((bank, i) =>
        i === bankIndex ? { ...bank, [field]: value } : bank
      )
    );
  };

  const handleClose = () => {
    setValue(2);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_gst_details/add`,
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
          setValue(2);
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
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

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
                className={`${classes.bgwhite} ${classes.boxshadow3} ${
                  classes.borderradius6px
                } ${bankDetailsArray.length !== 1 && classes.pt2}        ( ${
                  classes.pb2
                } ${classes.px1_5} ${classes.mt1}`}
              >
                {console.log("rowdssdf", row)}
                {bankDetailsArray.length !== 1 && (
                  <div className={`${classes.dflex} ${classes.justifyflexend}`}>
                    <IconButton
                      // onClick={() => handleDelete(index)}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (row?.id) {
                          handleDeleteWithId(row.id, index);
                        } else {
                          handleDelete(index);
                        }
                      }}
                    >
                      <LightTooltip title="GST Detail Delete">
                        <DeleteIcon
                          onFocus={(event) => event.stopPropagation()}
                        />
                      </LightTooltip>
                    </IconButton>
                  </div>
                )}

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
                    {console.log(
                      "Autocomplete",
                      pin,
                      row.pin_id,
                      pin?.find((sub) => sub.id === row.pin_id)
                    )}
                    <Autocomplete
                      id="state-autocomplete"
                      value={pin?.find((sub) => sub.id === row.pin_id) || ""}
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
                      options={place[index] || []}
                      value={
                        place[index]?.find((sub) => sub.id === row.place_id) ||
                        ""
                      }
                      onChange={(event, newValue) =>
                        handleBankDetailsArrayRowChange(
                          index,
                          "place_id",
                          newValue.id
                        )
                      }
                      disableClearable
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
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      GST Certificate (3 pager)
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      name="gst_file"
                      onChange={(e) => handleImage(e, index, "gst_file")}
                      type="file"
                      variant="outlined"
                      required
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
                  ></div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>

                  <div
                    className={`${classes.w30} ${classes.mt1_5}  ${classes.dflex} ${classes.justifycenter}`}
                  >
                  {console.log('rowrowrow' , row)}
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          row?.gst_file,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                    >
                      {row?.gst_file?.split("/").pop()}
                    </Link>
                  </div>
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
                    {console.log(
                      "setBankDetailsArray123",
                      bankDetailsArray[index],
                      index,
                      row
                    )}
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
                        setFormDetails={setBankDetailsArray}
                        formDetails={bankDetailsArray}
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
                    {console.log(
                      "openEditModalIndex1234",
                      openEditModalOwnerIndex,
                      openEditModalIndex,
                      index
                    )}
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
                        setFormDetails={setBankDetailsArray}
                        formDetails={bankDetailsArray}
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
