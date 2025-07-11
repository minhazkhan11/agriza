import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  startAdornment,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";
import { Avatar, Divider, IconButton } from "@material-ui/core";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@material-ui/icons/Clear";
import { Category } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import { Autocomplete } from "@mui/material";
import { ReactComponent as RupeesVector } from "../../../images/NotesImage/rupeesvector.svg";

const EditPublishedTestSeries = (props) => {
  const { open, handleOpenClose, fetchData, rows } = props;

  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const [subcategory, setSubcategory] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  const [exam, setExam] = useState("");
  const [examId, setExamId] = useState("");
  const [exams, setExams] = useState([]);

  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [Statusvaluevisible, setFormateValueVisible] = useState("");
  const [radioValue, setRadioValue] = useState("no");
  const [selectedState, setSelectedState] = useState("");

  const classes = useStyles();

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };
  const handleCategoryChange = (event, value) => {
    setCategory(value);
    setCategoryId(value.id);
  };
  const handleSubCategoryChange = (event, value) => {
    setSubcategory(value);
    setSubcategoryId(value.id);
  };
  const handleExamChange = (event, value) => {
    setExam(value);
    setExamId(value.id);
  };
  const [selectedTestSeries, setSelectedTestSeries] = useState("");

  const handleChangeCheckbox = (id) => {
    setSelectedTestSeries(id);
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
      <Fade in={open}>
        <div
          className={`${classes.ebookpopup} ${classes.p1} ${classes.positionrelative} `}
        >
          <Button className={`${classes.closebtn}`}>
            <ClearIcon
              className={`${classes.textcolorwhite}`}
              onClick={() => {
                handleOpenClose();
              }}
            />
          </Button>

          <Typography
            className={`${classes.lightblackcolor} ${classes.fontfamilyDMSans} ${classes.fontsize} ${classes.fw700} ${classes.lineheight} ${classes.ml2}`}
          >
            Edit Publishing Details
          </Typography>
          <Divider className={`${classes.mt1} ${classes.background00577B}`} />
          <div className={`${classes.pagescroll} ${classes.maxh75}`}>
            <div
              className={`${classes.dflex} ${classes.justifycenter} ${classes.flexdirectioncolumn} ${classes.mx0_5}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} 
             `}
              >
                Category <span className={classes.textcolorred}>*</span>
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={categories || []}
                value={category}
                classes={{ inputRoot: classes.inputRoot }}
                onChange={handleCategoryChange}
                disableClearable
                getOptionLabel={(option) => option?.category_name || ""}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Here"
                    variant="outlined"
                  />
                )}
                selectOnFocus
                openOnFocus
              />
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} 
             `}
              >
                Sub-Category <span className={classes.textcolorred}>*</span>
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={subcategories || []}
                value={subcategory}
                classes={{ inputRoot: classes.inputRoot }}
                onChange={handleSubCategoryChange}
                disableClearable
                getOptionLabel={(option) => option?.sub_category_name || ""}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Here"
                    variant="outlined"
                  />
                )}
                selectOnFocus
                openOnFocus
              />
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} 
             `}
              >
                Exam <span className={classes.textcolorred}>*</span>
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={exams || []}
                value={exam}
                classes={{ inputRoot: classes.inputRoot }}
                onChange={handleExamChange}
                disableClearable
                getOptionLabel={(option) => option?.exam_name || ""}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Here"
                    variant="outlined"
                  />
                )}
                selectOnFocus
                openOnFocus
              />
            </div>
            <div className={`${classes.dflex} ${classes.mt1} `}>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} ${classes.w20}
             `}
              >
                Validity <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <RadioGroup
                aria-label="Test Series Formate"
                name="Test Series Formate"
                className={`${classes.dflex} ${classes.flexdirectionrow} `}
                // value={formateValue}
                // onChange={handleChangeStatusRadio}

                // value={formDetails.test_series_format}
                // onChange={(e) =>
                //   handleFormChange("test_series_format", e.target.value)
                // }
              >
                <FormControlLabel
                  className={`${classes.ml0_5}`}
                  value="full length"
                  name="full length"
                  control={
                    <Radio
                      style={{ padding: "0.5rem" }}
                      onClick={() => setFormateValueVisible("full length")}
                    />
                  }
                  label={
                    <Typography
                      className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400}  `}
                    >
                      Life Time
                    </Typography>
                  }
                />
                <FormControlLabel
                  className={`${classes.ml1}`}
                  value="sectional"
                  name="section_id"
                  control={
                    <Radio
                      onClick={() => setFormateValueVisible("sectional")}
                      style={{ padding: "0.5rem" }}
                    />
                  }
                  label={
                    <Typography
                      className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400} `}
                    >
                      In Days
                    </Typography>
                  }
                />
                <FormControlLabel
                  className={`${classes.ml1}`}
                  value="topic"
                  name="topic_id"
                  control={
                    <Radio
                      onClick={() => setFormateValueVisible("topic")}
                      style={{ padding: "0.5rem" }}
                    />
                  }
                  label={
                    <Typography
                      className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400}  `}
                    >
                      In Dates
                    </Typography>
                  }
                />
              </RadioGroup>
            </div>
            <div
              className={`  ${classes.justifyflexend} ${classes.dflex} ${classes.mt1}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              {Statusvaluevisible === "sectional" && (
                <div className={`${classes.w40} `}>
                  <TextField
                    type="text"
                    variant="outlined"
                    //   required
                    placeholder="Type days"
                    //   onChange={(e) => {
                    //     setExam(e.target.value);
                    //   }}
                    //   value={exam}
                  />
                </div>
              )}
              {Statusvaluevisible === "topic" && (
                <div className={`${classes.w24} ${classes.mr3}`}>
                  <TextField
                    id="date"
                    //   label="Select Date"
                    type="date"
                    variant="outlined"
                    //   value={selectedDate}
                    //   onChange={handleDateChange}
                    //   InputLabelProps={{
                    //     shrink: true,
                    //   }}
                  />
                </div>
              )}
            </div>
            <Typography
              className={`${classes.fontfamilyDMSans} ${classes.fw700} ${classes.fontSize7} ${classes.ml0_5} ${classes.mt0_5}`}
            >
              Your Cost
            </Typography>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mx0_5}  `}
            >
              <div className={`${classes.w49}`}>
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} 
             `}
                >
                  MRP <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RupeesVector />
                        <Divider orientation="vertical" flexItem />
                      </InputAdornment>
                    ),
                  }}
                />
                <br />
              </div>
              <div className={`${classes.w49}`}>
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} 
             `}
                >
                  Discount <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RupeesVector />
                        <Divider orientation="vertical" flexItem />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifycenter} ${classes.flexdirectioncolumn} ${classes.mx0_5}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} 
             `}
              >
                Your Cost <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                type="number"
                variant="outlined"
                required
                placeholder="Type Here"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RupeesVector />
                      <Divider orientation="vertical" flexItem />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Typography
              className={`${classes.mt1} ${classes.fontfamilyDMSans} ${classes.fw700} ${classes.fontSize7}`}
            >
              Final Cost
            </Typography>
            <div
              className={`${classes.dflex} ${classes.justifycenter} ${classes.flexdirectioncolumn} ${classes.mx0_5}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} 
             `}
              >
                Final Cost <span className={classes.textcolorred}>*</span>
              </FormLabel>

              <TextField
                type="number"
                variant="outlined"
                required
                placeholder="Type Here"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RupeesVector />
                      <Divider orientation="vertical" flexItem />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Typography
              className={`${classes.fontfamilyDMSans} ${classes.fw400} ${classes.fontsize2} ${classes.lightbrowncolor} ${classes.my0_5} ${classes.mx0_5}`}
            >
              *Note :Final Cost after adding 20% of Parikshado
            </Typography>

            <div>
              <Typography
                className={`${classes.mt1} ${classes.fontfamilyDMSans} ${classes.fw700} ${classes.fontSize7}`}
              >
                Select Test Series <span className={classes.textcolorred}>*</span>
              </Typography>
              <div
                className={` ${classes.borderradius10px} ${classes.border1999} ${classes.p0_5}`}
              >
                {rows?.map((data, i) => (
                  <div
                    className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifyspacebetween}`}
                  >
                    <div
                      className={`${classes.dflex} ${classes.alignitemscenter} ${classes.p0_5} ${classes.w40}`}
                    >
                      <div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedTestSeries.checkedA}
                              onChange={() => {
                                handleChangeCheckbox(data.id);
                              }}
                              name="checkedA"
                              color="primary"
                              data-indeterminate="false"
                              aria-label="Select All Rows checkbox"
                            />
                          }
                        />
                      </div>
                      <div>
                        <Typography
                          variant="h4"
                          className={`${classes.fontfamilyoutfit} ${classes.fontsize1}`}
                        >
                          {data?.name}
                        </Typography>
                      </div>
                    </div>
                      <Divider orientation="vertical" flexItem />
                    <div className={`${classes.dflex}`}>
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5}
             `}
                      >
                        Status :
                      </FormLabel>
                      <RadioGroup
                        aria-label="Test Series Formate"
                        name="Test Series Formate"
                        className={`${classes.dflex} ${classes.flexdirectionrow} `}
                        // value={formateValue}
                        // onChange={handleChangeStatusRadio}

                        // value={formDetails.test_series_format}
                        // onChange={(e) =>
                        //   handleFormChange("test_series_format", e.target.value)
                        // }
                      >
                        <FormControlLabel
                          className={`${classes.ml0_5}`}
                          value="full length"
                          name="full length"
                          control={
                            <Radio
                              style={{ padding: "0.5rem" }}
                              onClick={() =>
                                setFormateValueVisible("full length")
                              }
                            />
                          }
                          label={
                            <Typography
                              className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400}  `}
                            >
                              Free
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          className={`${classes.ml1}`}
                          value="sectional"
                          name="section_id"
                          control={
                            <Radio
                              onClick={() =>
                                setFormateValueVisible("sectional")
                              }
                              style={{ padding: "0.5rem" }}
                            />
                          }
                          label={
                            <Typography
                              className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400} `}
                            >
                              Paid
                            </Typography>
                          }
                        />
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1} `}
            >
              <Button
                className={`${classes.border1}  ${classes.fontFamilyJost} ${classes.fw600}  ${classes.lightbrowncolor} ${classes.borderradius0375} ${classes.m0_5} ${classes.w30}`}
                onClick={() => {
                  handleOpenClose();
                }}
              >
                Cancel
              </Button>
              <Button
                className={`${classes.fontFamilyJost} ${classes.fw600} ${classes.bgdarkblue} ${classes.textcolorwhite}  ${classes.m0_5} ${classes.w30}`}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default EditPublishedTestSeries;
