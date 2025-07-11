import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStylesCustom from "../../../../../styles";
import {
  Button,
  FormLabel,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import UploadPreview from "../../../../CustomComponent/UploadPreview";
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

  const handleMakeAdmin = (index) => {
    setFormDetails((prev) => {
      const updatedOwners = prev.owner_details.map((owner, i) => ({
        ...owner,
        admin: i === index ? "yes" : "no", // Only the selected index gets "yes"
      }));

      return { ...prev, owner_details: updatedOwners };
    });

    setAdminIndex(index);
  };

  const handleDelete = (index) => {
    setFormDetails((prev) => ({
      ...prev,
      owner_details: prev.owner_details.filter((_, i) => i !== index),
    }));
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
    ownerDetails.forEach((data, index) => {
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
        Owner/Partner/Director Details
        {/* <Tooltip title="Add Owner">
          <IconButton
            onClick={() => {
              handlePopUp(mainindex);
              handleAddOwnerDetailsArrayRow(mainindex);
            }}
            className={`${customClasses.p0} ${customClasses.ml1}`}
          >
            <AddBoxOutlinedIcon />
          </IconButton>
        </Tooltip> */}
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
                    disabled
                    onClick={(event) => {
                      event.stopPropagation();
                      handleMakeAdmin(index);
                    }}
                    onFocus={(event) => event.stopPropagation()}
                    variant={data.role === "admin" ? "contained" : "outlined"}
                    color={data.role === "admin" ? "primary" : "default"}
                  >
                    {data.role === "admin" ? "Admin" : "Make Admin"}
                    {console.log("adminIndex", adminIndex, data)}
                  </Button>
                  {/* <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEdit(index);
                    }}
                    onFocus={(event) => event.stopPropagation()}
                    variant={data.role === "admin" ? "contained" : "outlined"}
                    color={data.role === "admin" ? "primary" : "default"}
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
                          handleDelete(index);
                        }}
                        onFocus={(event) => event.stopPropagation()}
                      />
                    </LightTooltip>
                  </IconButton> */}
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
                    value={data.first_name}
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
                    value={data.father_name}
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
                    Email
                  </FormLabel>
                  <TextField
                    value={data.email}
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
                    value={data.phone}
                    name="category_name"
                    type="text"
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      pattern: "[0-9]{10}",
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        !/^\d$/.test(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
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
                    value={data.alternative_phone}
                    name="category_name"
                    type="text"
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      pattern: "[0-9]{10}",
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        !/^\d$/.test(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    disabled
                  />
                </div>
                <div
                  className={`${customClasses.w30} ${customClasses.mt1_5}  ${customClasses.dflex} ${customClasses.justifycenter}`}
                ></div>
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
                    value={data.r_address}
                    name="r_address"
                    type="text"
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                    placeholder="Type Here"
                    // fullWidth
                    disabled
                  />
                </div>

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
                <div
                  className={`${customClasses.w30} ${customClasses.mt1_5}  ${customClasses.dflex} ${customClasses.justifycenter}`}
                ></div>

                <div
                  className={`${customClasses.w30} ${customClasses.mt1_5} ${customClasses.dflex} ${customClasses.justifycenter}`}
                >
                  <UploadPreview
                    thumbnailImagePreview={
                      data.photo && !(typeof data.photo == "string")
                        ? URL.createObjectURL(data.photo)
                        : data.photo
                    }
                  />
                </div>

                <div
                  className={`${customClasses.w30} ${customClasses.mt1_5}  ${customClasses.dflex} ${customClasses.justifycenter}`}
                >
                  <UploadPreview
                    thumbnailImagePreview={
                      data.aadhar_upload &&
                      !(typeof data.aadhar_upload == "string")
                        ? URL.createObjectURL(data.aadhar_upload)
                        : data.aadhar_upload
                    }
                  />
                </div>

                <div
                  className={`${customClasses.w30} ${customClasses.mt1_5}  ${customClasses.dflex} ${customClasses.justifycenter}`}
                >
                  <UploadPreview
                    thumbnailImagePreview={
                      data.pan_upload && !(typeof data.pan_upload == "string")
                        ? URL.createObjectURL(data.pan_upload)
                        : data.pan_upload
                    }
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
