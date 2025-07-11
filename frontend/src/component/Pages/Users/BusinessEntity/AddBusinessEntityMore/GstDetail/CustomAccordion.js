import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStylesCustom from "../../../../../../styles";
import {
  Button,
  FormLabel,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { decryptData } from "../../../../../../crypto";
import axios from "axios";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from "@material-ui/icons/Delete";

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions({
  handlePopUp,
  ownerDetails,
  pin,
  handleAddOwnerDetailsArrayRow,
  mainindex,
  setFormDetails,
  handleEdit,
}) {
    const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const customClasses = useStylesCustom();
  const [expanded, setExpanded] = useState("");
  const [place, setPlace] = useState([]);
  const [adminIndex, setAdminIndex] = useState(null);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleMakeAdmin = (bankIndex, ownerIndex) => {
    setFormDetails((prev) =>
      prev.map((bank, i) =>
        i === bankIndex
          ? {
              ...bank,
              persons: bank.persons.map((owner, j) => ({
                ...owner,
                admin: j === ownerIndex ? "yes" : "no", // Only one owner can be admin at a time
              })),
            }
          : bank
      )
    );
  
    setAdminIndex(ownerIndex);
  };

  const handleDelete = (bankIndex, ownerIndex) => {
    setFormDetails((prev) =>
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
    ownerDetails?.forEach((data, index) => {
      if (data.pincode_id) {
        fetchPlace(index, data.pincode_id);
      }
    });
  }, [ownerDetails]);

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
      <Paper
        className={`${customClasses.p1} ${customClasses.mb1} ${customClasses.boxshadow9} ${customClasses.bgskylite}`}
      >
        Key Managerial Persons Details
        <Tooltip title="Variant Setting">
          <IconButton
            onClick={() => {
              handlePopUp(mainindex);
              handleAddOwnerDetailsArrayRow(mainindex);
            }}
            className={`${customClasses.p0} ${customClasses.ml1}`}
          >
            <AddBoxOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Paper>
      {ownerDetails?.map((data, index) => (
        <div className={`${customClasses.dflex}`}>
          <span className={`${customClasses.mt1} ${customClasses.mr0_5}`}>
            {index + 1}
          </span>
          <Accordion
            square
            expanded={expanded === data?.first_name}
            onChange={handleChange(data?.first_name)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
                 <div
                className={`${customClasses.w100} ${customClasses.dflex} ${customClasses.justifyspacebetween}`}
              >
                <Typography>{data?.first_name}</Typography>
                <div>
                   <Button
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleMakeAdmin(mainindex,index);
                                    }}
                                    onFocus={(event) => event.stopPropagation()}
                                    variant={adminIndex === index ? "contained" : "outlined"}
                                    color={adminIndex === index ? "primary" : "default"}
                                  >
                                    {adminIndex === index ? "Manager" : "Make Manager"}
                                  </Button>
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEdit(mainindex,index);
                    }}
                    onFocus={(event) => event.stopPropagation()}
                  >
                    <LightTooltip title="Edit">
                      <EditOutlinedIcon />
                    </LightTooltip>
                  </IconButton>
                  <IconButton>
                    <LightTooltip title="Delete">
                      <DeleteIcon
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(mainindex , index);
                        }}
                        onFocus={(event) => event.stopPropagation()}
                      />
                    </LightTooltip>
                  </IconButton>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div
                className={`${customClasses.w100} ${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.flexwrapwrap}`}
              >
                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Owner/Partner/Director Name{" "}
                    <span className={customClasses.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={data?.first_name}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    disabled
                  />
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Father Name
                  </FormLabel>
                  <TextField
                    value={data?.father_name}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    disabled
                  />
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Email {console.log('data' , data)}
                  </FormLabel>
                  <TextField
                    value={data?.email}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    disabled
                  />
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Phone <span className={customClasses.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={data?.phone}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    disabled
                  />
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Alternate Phone No.
                  </FormLabel>
                  <TextField
                    value={data?.alternative_phone}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    disabled
                  />
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.w100}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Residential Address{" "}
                    <span className={customClasses.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={data?.r_address}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    disabled
                  />
                </div>

                {/* {rDistrictStateTehsil.state && (
                  <div
                    className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                  >
                    <FormLabel
                      className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                    >
                      State
                    </FormLabel>

                    <Select
                      labelId="category-label"
                      id="country"
                      required
                      value={rDistrictStateTehsil.state.state_name}
                      displayEmpty
                      className={customClasses.selectEmpty}
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
                    className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                  >
                    <FormLabel
                      className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
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
                      className={customClasses.selectEmpty}
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
                    className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                  >
                    <FormLabel
                      className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
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
                      className={customClasses.selectEmpty}
                      MenuProps={menuProps}
                      variant="outlined"
                      disabled
                    >
                      <MenuItem value={rDistrictStateTehsil.tehsil.tehsil_name}>
                        {rDistrictStateTehsil.tehsil.tehsil_name}
                      </MenuItem>
                    </Select>
                  </div>
                )} */}

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Pincode{" "}
                    <span className={customClasses.textcolorred}>*</span>
                  </FormLabel>

                  <TextField
                    value={
                      pin?.find((sub) => sub.id === data.pincode_id)
                        ?.pin_code || ""
                    }
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    disabled
                  />
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w30}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Place <span className={customClasses.textcolorred}>*</span>
                  </FormLabel>

                  <TextField
                    value={
                      place[index]?.find((sub) => sub.id === data.place_id)
                        ?.place_name || ""
                    }
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    disabled
                  />
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </>
  );
}
