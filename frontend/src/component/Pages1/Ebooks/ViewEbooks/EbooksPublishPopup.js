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
const EbooksPublishPopup = (props) => {
  const { open, handleOpenClose, fetchData, info, handleClose } = props;
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
  const [contentData, setContantData] = useState([]);
const [yourCost,setYourCost]=useState("");
  const [inDaysVisible, setInDaysVisible] = useState(false);
  const [inDateVisible, setInDateVisible] = useState(false);
  const [content, setContent] = useState([]);
  const [sectionData, setSectionsData] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);
  const [checkCon, setCheckCon] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState("");
  const handleCategoryChange = (event, newValue) => {
    setCategoryId(newValue);
    setCategory(newValue);
    setSubcategoryId(null); // Reset subcategory when category changes
    setExamId(null); // Reset exam when category changes
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
  const handleChangeCheckbox = (id, isChecked) => {
    let updatedSelectedContent = [...selectedContent];
  
    if (isChecked) {
        updatedSelectedContent.push(id);
    } else {
        updatedSelectedContent = updatedSelectedContent.filter((contentId) => contentId !== id);
    }
  
    setSelectedContent(updatedSelectedContent);
};

const handleContent = (status, id) => {
  let updatedData = [...contentData]; 

  const existingContentIndex = updatedData.findIndex((item) => item.id === id);

  if (existingContentIndex === -1) {
    const newContent = { id: id, payment_status: status };
    updatedData.push(newContent);
    console.log("New content added successfully:", newContent);
  } else {
    updatedData[existingContentIndex].payment_status = status; 
    console.log("Payment status updated successfully:", updatedData[existingContentIndex]);
  }

  setContantData(updatedData);
};



  
  const handleSubmit = () => {
    if (!categoryId.id) {
      toast.error("Category is required");
      return;
    }
    if (!subcategory.id) {
      toast.error("Subcategory is required");
      return;
    }
    
    if (!examId) {
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
      category_id: categoryId.id,
      sub_category_id: subcategory.id,

      exam_id: examId,

      mrp: mrp,
      discount_percent: discount,
      selling_cost: selling,
      validity: formDetails.validity,
      validity_in_days: formDetails.validity_in_days,
      validity_in_date: formDetails.validity_in_date,
      uploadPlans: contentData,
    };

    const token = decryptData(sessionStorage.getItem("token"));
    const formData = new FormData();
    formData.append("ebook", JSON.stringify(data));
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebooks/ebook/add/${info}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          toast.success("Publication added successfully submitted");
          setTimeout(() => {
            handleOpenClose();
            handleClose();
            fetchData();
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
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      validity: "lifetime",
      validity_in_days: null,
      validity_in_date: null,
    }));
  };

  const handleInDaysClick = () => {
    setInDaysVisible(true);
    setInDateVisible(false);
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      validity: "indays",
      validity_in_days: formDetails.validity_in_days,
      validity_in_date: null,
    }));
  };

  const handleInDateClick = () => {
    setInDaysVisible(false);
    setInDateVisible(true);
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      validity: "indate",
      validity_in_days: null,
      validity_in_date: formDetails.validity_in_date,
    }));
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      const token = decryptData(sessionStorage.getItem("token"));

      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebook_upload_plans/by_ebookid/${info}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          setContent(response.data.upload_plans);
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    };

    fetchDataFromAPI();
  }, [info]);
  const rows = content?.map((data, index) => ({
    id: data.id,
    name: data.ebook.name,
  }));
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
            Publishing Details
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

            <div className={classes.radiobtncont}>
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

                <FormControlLabel
                  value="lifetime"
                  control={<Radio onClick={handleLifetimeClick} />}
                  label="Lifetime"
                />

                <FormControlLabel
                  value="indays"
                  control={<Radio onClick={handleInDaysClick} />}
                  label="In Days"
                />
                <FormControlLabel
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
                  onChange={(e) => setMrp(e.target.value)}
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
                value={selling}

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
                You Will Get <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <TextField
                type="number"
                variant="outlined"
                required
                // onChange={(e) => setSellingcost(e.target.value)}
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
            <div>
              <Typography
                className={`${classes.mt1} ${classes.fontfamilyDMSans} ${classes.fw700} ${classes.fontSize7}`}
              >
                Select Upload Plans
                <span className={classes.textcolorred}>*</span>
              </Typography>
              <div
                className={` ${classes.borderradius10px} ${classes.border1999} ${classes.p0_5}`}
              >
                 {content?.map((data, i) => (
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
                              checked={selectedContent.includes(data.id)}
                              onChange={(e) =>
                                handleChangeCheckbox(data.id, e.target.checked)
                              }
                              name={`checkbox-${i}`}
                              color="primary"
                            />
                          }
                        />
                      </div>
                      <div>
                        <Typography
                          variant="h4"
                          className={`${classes.fontfamilyoutfit} ${classes.fontsize1}`}
                        >
                          {data?.ebook?.name}
                        </Typography>
                      </div>
                    </div>
                    <Divider orientation="vertical" flexItem />
                    <div className={`${classes.dflex}`}>
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight} ${classes.pl0_5}`}
                      >
                        Status :
                      </FormLabel>
                      <RadioGroup
                        aria-label="Test Series Formate"
                        name="Test Series Formate"
                        className={`${classes.dflex} ${classes.flexdirectionrow}`}
                      >
                        <FormControlLabel
                          className={`${classes.ml0_5}`}
                          value="free"
                          name="free"
                          control={
                            <Radio
                              style={{ padding: "0.5rem" }}
                              onClick={(e) => handleContent("free", data.id)}
                              disabled={!selectedContent.includes(data.id)} // Disable the radio button if the content is not selected
                            />
                          }
                          label={
                            <Typography
                              className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400}`}
                            >
                              Free
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          className={`${classes.ml1}`}
                          value="paid"
                          name="paid"
                          control={
                            <Radio
                              style={{ padding: "0.5rem" }}
                              onClick={(e) => handleContent("paid", data.id)}
                              disabled={!selectedContent.includes(data.id)} // Disable the radio button if the content is not selected
                            />
                          }
                          label={
                            <Typography
                              className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400}`}
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

export default EbooksPublishPopup;
