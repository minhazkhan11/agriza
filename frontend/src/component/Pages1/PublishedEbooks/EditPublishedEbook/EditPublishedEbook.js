import React, { useEffect, useState } from "react";
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
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ReactComponent as RupeesVector } from "../../../images/NotesImage/rupeesvector.svg";

const EditPublishedEbook = (props) => {
  const { open, handleOpenClose, fetchData, info, handleClose,fetchTestSeriesData } = props;
  const [yourCost, setYourCost] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("");
  const [selling, setSellingcost] = useState("");
  const [validity, setValidity] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [exam, setExam] = useState([]);
  const [examId, setExamId] = useState("");

  const [inDaysVisible, setInDaysVisible] = useState(false);
  const [inDateVisible, setInDateVisible] = useState(false);
  console.log(info, "info");
  const [sectionData, setSectionsData] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);

  const [paymentStatus, setPaymentStatus] = useState("");
  const handleCategoryChange = (event, newValue) => {
    setCategoryId(newValue);
    setCategory(newValue);
    setSubcategoryId(null); // Reset subcategory when category changes
    setExamId(null);
    setSubcategory(null);
    setExam(null);
  };
  const handleSubCategoryChange = (event, value) => {
    setSubcategory(value);
    setSubcategoryId(value.id);
    setExam(null);
  };
  const handleExamChange = (event, value) => {
    setExam(value);
    setExamId(value.id);
  };
  const handleSectionChange = (event, value) => {
    setSectionId(value);
  };
  const handleChangeCheckbox = (id) => {
    setSelectedContent(id);
  };

  const classes = useStyles();
  useEffect(() => {
    const token = decryptData(sessionStorage.getItem("token"));
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/exam/mega_menu`,
    })
      .then((response) => {
        console.log(response.data?.categories);
        setCategories(response.data?.categories);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    const token = decryptData(sessionStorage.getItem("token"));
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/notes/sections/${examId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response.data?.sections);
        setSectionsData(response.data?.sections);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [examId]);
  useEffect(() => {
    const token = decryptData(sessionStorage.getItem("token"));
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebooks/publish/ebooks/${info}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response.data?.sections);
        setCategory(response.data?.ebook?.category);
        setSubcategory(response.data?.ebook?.subCategory);
        setMrp(response.data?.ebook?.mrp);
        setDiscount(response.data?.ebook?.discount_percent);
        setSellingcost(response.data?.ebook?.selling_cost);
        setExam(response.data?.ebook?.exam);

        const calculatedCost =
          response.data?.ebook?.selling_cost -
          (response.data?.ebook?.selling_cost * 20) / 100;
        setYourCost(calculatedCost);
        setFormDetails({
          validity: response.data?.ebook?.validity,
          validity_in_days: response.data?.ebook?.validity_in_days,
          validity_in_date: response.data?.ebook?.validity_in_date,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [info]);

  const handleSubmit = () => {
    if (!category) {
      toast.error("Category is required");
      return;
    }
    if (!subcategory) {
      toast.error("Subcategory is required");
      return;
    }

    if (!exam) {
      toast.error("Exam is required");
      return;
    }
    if (!formDetails.validity) {
      toast.error("Validity is required");
      return;
    }
    if (!mrp) {
      toast.error("Mrp is required");
      return;
    }
    if (!discount) {
      toast.error("Discount is required");
      return;
    }
    if (!selling) {
      toast.error("Final Cost is required");
      return;
    }

    const data = {
      eBooks: {
        category_id: category.id,
        sub_category_id: subcategory.id,
        exam_id: exam.id,
        mrp: mrp,
        discount_percent: discount,
        selling_cost: selling,
        purchase_cost: yourCost,
        validity: formDetails.validity,
        validity_in_days: formDetails.validity_in_days,
        validity_in_date: formDetails.validity_in_date,
        // uploadPlans: [],
      },
    };

    console.log(data, "data");
    const token = decryptData(sessionStorage.getItem("token"));
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebooks/publish/ebooks/${info}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          toast.success("Publication updated successfully submitted");
          setTimeout(() => {
            handleOpenClose();
            handleClose();
            fetchTestSeriesData();
          }, 1000);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.response?.data?.message);
      });
  };
  console.log("data", info);
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [formDetails, setFormDetails] = useState({
    validity: "",
    validity_in_days: null,
    validity_in_date: null,
  });
  const handleFormChange = (name, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [name]: value,
    }));
  };
  const handleLifetimeClick = () => {
    setInDaysVisible(false);
    setInDateVisible(false);
    setFormDetails({
      validity: "lifetime",
      validity_in_days: null,
      validity_in_date: null,
    });
  };

  const handleInDaysClick = () => {
    setInDaysVisible(true);
    setInDateVisible(false);
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      validity: "indays",
      validity_in_days: null, // Resetting validity_in_days to null
      validity_in_date: null, // Resetting validity_in_date to null
    }));
  };

  const handleInDateClick = () => {
    setInDaysVisible(false);
    setInDateVisible(true);
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      validity: "indate",
      validity_in_days: null, // Resetting validity_in_days to null
      // validity_in_date should be preserved or updated separately
    }));
  };
  const Mrp = (e) => {
    setMrp(e.target.value);
    setDiscount(null);
    setSellingcost(null);
    setYourCost(null);
  };

  const Cost = (discountValue) => {
    if (!isNaN(discountValue) && discountValue !== "") {
      const parsedDiscount = parseFloat(discountValue); // Parse the discount value as a float

      const calculatedCost = mrp - (mrp * parsedDiscount) / 100;
      const calculatedSellingCost =
        calculatedCost - (calculatedCost * 20) / 100;

      setDiscount(parsedDiscount);
      setYourCost(calculatedSellingCost);
      setSellingcost(calculatedCost);
    } else {
      setDiscount("");
      setYourCost("");
    }
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
                Category <span style={{ color: "red" }}>*</span>
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
                Sub-Category <span style={{ color: "red" }}>*</span>
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={categoryId ? categoryId.subCategories || [] : []}
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
                Exam <span style={{ color: "red" }}>*</span>
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={subcategory ? subcategory.exams || [] : []}
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
            <div className={`${classes.radiobtncont} ${classes.mt0_5}`}>
              <RadioGroup
                aria-label="Duration"
                name="Duration"
                value={formDetails.validity}
                onChange={(e) => handleFormChange("validity", e.target.value)}
              >
                <FormLabel>
                  Validity <span className={classes.textcolorred}>*</span>
                  <Typography
                    variant="caption"
                    display="block"
                    gutterBottom
                  ></Typography>
                </FormLabel>
                {/* <FormControlLabel
                value="lifetime"
                control={
                  <Radio onClick={() => setDurationVisible("Life time")} />
                }
                label="Life time"
              /> */}

                <FormControlLabel
                  value="lifetime"
                  control={<Radio onClick={handleLifetimeClick} />}
                  label="Lifetime"
                />

                <FormControlLabel
                  // value="indays"
                  // control={
                  //   <Radio onClick={() => setDurationVisible("In Days")} />
                  // }
                  // label="In Days"

                  value="indays"
                  control={<Radio onClick={handleInDaysClick} />}
                  label="In Days"
                />
                <FormControlLabel
                  // value="indate"
                  // control={
                  //   <Radio onClick={() => setDurationVisible("In Date")} />
                  // }
                  // label="In Date"

                  value="indate"
                  control={<Radio onClick={handleInDateClick} />}
                  label="In Date"
                />
              </RadioGroup>
            </div>

            {inDaysVisible && (
              <div className={classes.durationinput}>
                <div className={`${classes.inputcontainer} ${classes.w65}`}>
                  <TextField
                    type="number"
                    value={formDetails.validity_in_days}
                    variant="outlined"
                    placeholder="0 days"
                    onChange={(e) =>
                      handleFormChange("validity_in_days", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {inDateVisible && (
              <div className={classes.durationinput}>
                <div className={`${classes.inputcontainer} ${classes.w65}`}>
                  <TextField
                    type="date"
                    variant="outlined"
                    value={formDetails.validity_in_date}
                    onChange={(e) =>
                      handleFormChange("validity_in_date", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            <Typography
              className={`${classes.fontfamilyDMSans} ${classes.fw700} ${classes.fontSize7} ${classes.ml0_5}`}
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
                  MRP <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  onChange={(e) => Mrp(e)}
                  value={mrp}
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
                  Discount <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  onChange={(e) => Cost(e.target.value)}
                  value={discount}
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
                Website Cost <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <TextField
                type="number"
                variant="outlined"
                required
                placeholder="Type Here"
                value={selling}
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
                You Will Get <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <TextField
                type="number"
                variant="outlined"
                required
                value={yourCost}
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
                onClick={() => handleSubmit()}
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

export default EditPublishedEbook;
