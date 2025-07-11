import React, { useRef, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStylesCustom from "../../../../../styles";
import {
  Button,
  Divider,
  ClickAwayListener,
  FormLabel,
  Grow,
  IconButton,
  Paper,
  Popper,
  TextField,
  MenuList,
  Tooltip,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import { Link } from "react-router-dom";

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
  selectedVariants,
  selectedAttributes,
  handleFormChange,
  formDetails,
  unit,
  primaryUnit,
  secondaryUnit,
  coveringUnit,
  handlePrimaryUnitChange,
  handleSecondaryUnitChange,
  handleCoveringUnitChange,
  handlePopUp,
}) {
  const customClasses = useStylesCustom();
  const [expanded, setExpanded] = useState("");

  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleClose = (event) => {
    if (
      event &&
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      {selectedAttributes?.map((link, index) => (
        <div>
          <Paper className={`${customClasses.p1} `}>
            Variant - {link.attribute_name}
            {/* <Button
                  className={`${classes.mr1} ${classes.bgtransparent} ${classes.bghoverwhite} ${classes.boxshadow0} ${classes.w27px} ${classes.p0_5} `}
                  variant="contained"
                  color="primary"
                  ref={anchorRef}
                  aria-controls={open ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <SettingIcon />
                  {open ? (
                    <ExpandLess className={classes.textcolorwhite} />
                  ) : (
                    <ExpandMore className={classes.textcolorwhite} />
                  )}
                </Button> */}
            <Tooltip title="Variant Setting">
              <IconButton
                // className={`${customClasses.mr1} ${customClasses.bgtransparent} ${customClasses.bghoverwhite} ${customClasses.boxshadow0} ${customClasses.w27px} ${customClasses.p0_5} `}
                variant="contained"
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className={`${customClasses.p0} ${customClasses.ml1}`}
                // onClick={handlePopUp}
              >
                <SettingsOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              className={`${customClasses.dropdowncard} `}
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
              
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        <Link to="" className={customClasses.dropdownlink}>
                          <Button
                            fullWidth
                            onClick={() => {
                              handlePopUp();
                              handleClose();
                            }}
                            className={`${customClasses.menuButton} ${customClasses.justifyleft}`}
                          >
                            <span
                              className={`${customClasses.headname} ${customClasses.dflex} ${customClasses.alignitemscenter}`}
                            >
                              Set Regular
                            </span>
                          </Button>

                          <Divider />
                          <Button
                            fullWidth
                            onClick={() => {
                              handlePopUp();
                              handleClose();
                            }}
                            className={`${customClasses.menuButton} ${customClasses.justifyleft}`}
                          >
                            <span
                              className={`${customClasses.headname} ${customClasses.dflex} ${customClasses.alignitemscenter}`}
                            >
                              Set Variable
                            </span>
                          </Button>
                          <Button
                            fullWidth
                            onClick={() => {
                              handlePopUp();
                              handleClose();
                            }}
                            className={`${customClasses.menuButton} ${customClasses.justifyleft}`}
                          >
                            <span
                              className={`${customClasses.headname} ${customClasses.dflex} ${customClasses.alignitemscenter}`}
                            >
                              Set Logical
                            </span>
                          </Button>
                        </Link>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Paper>
          {selectedVariants?.[link.attribute_name]?.map((data, index) => (
            <>
              <Accordion
                square
                expanded={expanded === data.variant}
                onChange={handleChange(data.variant)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <Typography>{data.variant}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    className={`${customClasses.w100} ${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.flexwrapwrap}`}
                  >
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w32}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        SKU
                      </FormLabel>
                      <TextField
                        // value={formDetails.alias}
                        // onChange={(e) =>
                        //   handleFormChange("alias", e.target.value)
                        // }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                      />
                    </div>

   

                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w32}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Mrp
                      </FormLabel>
                      <TextField
                        // value={formDetails.alias}
                        // onChange={(e) =>
                        //   handleFormChange("alias", e.target.value)
                        // }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                      />
                    </div>

                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w32}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Selling Price
                      </FormLabel>
                      <TextField
                        // value={formDetails.alias}
                        // onChange={(e) =>
                        //   handleFormChange("alias", e.target.value)
                        // }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                      />
                    </div>

                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w32}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Cross Price
                      </FormLabel>
                      <TextField
                        // value={formDetails.alias}
                        // onChange={(e) =>
                        //   handleFormChange("alias", e.target.value)
                        // }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                      />
                    </div>

                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w32}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Opening Stock
                      </FormLabel>
                      <TextField
                        // value={formDetails.alias}
                        // onChange={(e) =>
                        //   handleFormChange("alias", e.target.value)
                        // }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                      />
                    </div>

                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w32}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        MOQ
                      </FormLabel>
                      <TextField
                        // value={formDetails.alias}
                        // onChange={(e) =>
                        //   handleFormChange("alias", e.target.value)
                        // }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                      />
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.mt1} ${customClasses.w100}`}
                    >
                      {" "}
                      <Typography
                        className={`${customClasses.w32} ${customClasses.textcolorformhead} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize5} ${customClasses.fontstylenormal} ${customClasses.fw500} ${customClasses.lineheight2_25}`}
                        variant="h6"
                        display="inline"
                      >
                        Other Information
                      </Typography>
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w100}`}
                    >
                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w32}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          Primary unit{" "}
                          <span className={customClasses.textcolorred}>*</span>
                        </FormLabel>

                        <Autocomplete
                          id="state-autocomplete"
                          options={unit || []}
                          value={primaryUnit}
                          onChange={handlePrimaryUnitChange}
                          disableClearable
                          getOptionLabel={(option) => option.unit_name}
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
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w32}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          Secondary unit
                        </FormLabel>

                        <Autocomplete
                          id="state-autocomplete"
                          options={unit || []}
                          value={secondaryUnit}
                          onChange={handleSecondaryUnitChange}
                          disableClearable
                          getOptionLabel={(option) => option.unit_name}
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
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w32}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          Covering unit
                        </FormLabel>

                        <Autocomplete
                          id="state-autocomplete"
                          options={unit || []}
                          value={coveringUnit}
                          onChange={handleCoveringUnitChange}
                          disableClearable
                          getOptionLabel={(option) => option.unit_name}
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
                    </div>

                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.mt1}`}
                    >
                      <div
                        className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w49}`}
                      >
                        <div
                          className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w40}`}
                        >
                          {secondaryUnit && (
                            <>
                              <FormLabel
                                className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                              >
                                Primary Quantity{" "}
                                <span className={customClasses.textcolorred}>
                                  *
                                </span>
                              </FormLabel>
                              <div
                                className={`${customClasses.dflex} ${customClasses.alignitemscenter}`}
                              >
                                <TextField
                                  value={formDetails.primary_quantity}
                                  className={`${customClasses.w68} ${customClasses.mr0_5}`}
                                  onChange={(e) =>
                                    handleFormChange(
                                      "primary_quantity",
                                      e.target.value
                                    )
                                  }
                                  type="text"
                                  variant="outlined"
                                  required
                                  placeholder="Enter Name"
                                />
                                {primaryUnit.unit_name}
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.justifycenter} ${customClasses.w5}`}
                        >
                          {secondaryUnit && (
                            <>
                              <FormLabel
                                className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                              >
                                .
                              </FormLabel>
                              <span> =</span>
                            </>
                          )}
                        </div>
                        <div
                          className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w40}`}
                        >
                          {secondaryUnit && (
                            <>
                              <FormLabel
                                className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                              >
                                Secondary Quantity{" "}
                                <span className={customClasses.textcolorred}>
                                  *
                                </span>
                              </FormLabel>
                              <div
                                className={`${customClasses.dflex} ${customClasses.alignitemscenter}`}
                              >
                                <TextField
                                  value={formDetails.secondary_quantity}
                                  className={`${customClasses.w68} ${customClasses.mr0_5}`}
                                  onChange={(e) =>
                                    handleFormChange(
                                      "secondary_quantity",
                                      e.target.value
                                    )
                                  }
                                  type="text"
                                  variant="outlined"
                                  required
                                  placeholder="Enter Name"
                                />
                                {secondaryUnit.unit_name}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w49}`}
                      >
                        <div
                          className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w40}`}
                        >
                          {coveringUnit && (
                            <>
                              <FormLabel
                                className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                              >
                                Primary Quantity
                                <span className={customClasses.textcolorred}>
                                  *
                                </span>
                              </FormLabel>
                              <div
                                className={`${customClasses.dflex} ${customClasses.alignitemscenter}`}
                              >
                                <TextField
                                  value={formDetails.primary_quantity}
                                  className={`${customClasses.w68} ${customClasses.mr0_5}`}
                                  onChange={(e) =>
                                    handleFormChange(
                                      "primary_quantity",
                                      e.target.value
                                    )
                                  }
                                  type="text"
                                  variant="outlined"
                                  required
                                  placeholder="Enter Name"
                                  disabled
                                />
                                {primaryUnit.unit_name}
                              </div>
                            </>
                          )}
                        </div>

                        <div
                          className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.justifycenter} ${customClasses.w5}`}
                        >
                          {coveringUnit && (
                            <>
                              <FormLabel
                                className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                              >
                                .
                              </FormLabel>
                              <span
                                className={`${customClasses.dflex} ${customClasses.justifycenter} `}
                              >
                                {" "}
                                =
                              </span>
                            </>
                          )}
                        </div>

                        <div
                          className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w40}`}
                        >
                          {coveringUnit && (
                            <>
                              <FormLabel
                                className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                              >
                                Covering Quantity{" "}
                                <span className={customClasses.textcolorred}>
                                  *
                                </span>
                              </FormLabel>
                              <div
                                className={`${customClasses.dflex} ${customClasses.alignitemscenter}`}
                              >
                                <TextField
                                  value={formDetails.covering_quantity}
                                  className={`${customClasses.w68} ${customClasses.mr0_5}`}
                                  onChange={(e) =>
                                    handleFormChange(
                                      "covering_quantity",
                                      e.target.value
                                    )
                                  }
                                  type="text"
                                  variant="outlined"
                                  required
                                  placeholder="Enter Name"
                                />
                                {coveringUnit.unit_name}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.mt1} ${customClasses.w100}`}
                    >
                      {" "}
                      <Typography
                        className={`${customClasses.w32} ${customClasses.textcolorformhead} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize5} ${customClasses.fontstylenormal} ${customClasses.fw500} ${customClasses.lineheight2_25}`}
                        variant="h6"
                        display="inline"
                      >
                        Piece (Bag/Bottle)
                      </Typography>
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween}`}
                    >
                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          length / (mm)
                        </FormLabel>
                        <TextField
                          value={formDetails.piece_length}
                          onChange={(e) =>
                            handleFormChange("piece_length", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          width / (mm)
                        </FormLabel>
                        <TextField
                          value={formDetails.piece_width}
                          onChange={(e) =>
                            handleFormChange("piece_width", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          Thickness / (mm){" "}
                        </FormLabel>
                        <TextField
                          value={formDetails.piece_thickness}
                          onChange={(e) =>
                            handleFormChange("piece_thickness", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          weight
                        </FormLabel>
                        <TextField
                          value={formDetails.piece_weight}
                          onChange={(e) =>
                            handleFormChange("piece_weight", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                      </div>
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.mt1} ${customClasses.w100}`}
                    >
                      {" "}
                      <Typography
                        className={`${customClasses.w32} ${customClasses.textcolorformhead} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize5} ${customClasses.fontstylenormal} ${customClasses.fw500} ${customClasses.lineheight2_25}`}
                        variant="h6"
                        display="inline"
                      >
                        Covering (Bag/Box/Drum)
                      </Typography>
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween}`}
                    >
                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          length / (mm)
                        </FormLabel>
                        <TextField
                          value={formDetails.covering_length}
                          onChange={(e) =>
                            handleFormChange("covering_length", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          width / (mm)
                        </FormLabel>
                        <TextField
                          value={formDetails.covering_width}
                          onChange={(e) =>
                            handleFormChange("covering_width", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          Thickness / (mm){" "}
                        </FormLabel>
                        <TextField
                          value={formDetails.covering_thickness}
                          onChange={(e) =>
                            handleFormChange(
                              "covering_thickness",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          weight
                        </FormLabel>
                        <TextField
                          value={formDetails.covering_weight}
                          onChange={(e) =>
                            handleFormChange("covering_weight", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </>
          ))}
        </div>
      ))}
    </div>
  );
}
