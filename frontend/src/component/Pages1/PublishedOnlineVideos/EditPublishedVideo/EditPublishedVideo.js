import React, { useState,useEffect } from "react";
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

const EditPublishedVideo = (props) => {
  const { open, handleOpenClose, fetchData, info,fetchTestSeriesData } = props;

  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
const [yourCost,setYourCost]=useState("")

  const [subcategory, setSubcategory] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);
  const [checkCon, setCheckCon] = useState(false);
  const [exam, setExam] = useState("");
  const [examId, setExamId] = useState("");
  const [exams, setExams] = useState([]);

  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [Statusvaluevisible, setFormateValueVisible] = useState("");
  const [selling, setSellingcost] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedLectures, setSelectedLectures] = useState([]);
  const [contentData, setContantData] = useState([]);
  const [content, setContent] = useState([]);

  const classes = useStyles();

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };
  
  const handleCategoryChange = (event, newValue) => {
    setCategoryId(newValue);
    setCategory(newValue);
    setSubcategoryId(null);
    setExamId(null);
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
  
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

 
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
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/onlinevideo/publish/onlinevideo/${info}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data?.sections);
      setCategory(response.data?.onlinevideo?.category);
      setSubcategory(response.data?.onlinevideo?.subCategory);
      setMrp(response.data?.onlinevideo?.mrp);
      setDiscount(response.data?.onlinevideo?.discount_percent);
      setSellingcost(response.data?.onlinevideo?.selling_cost);
      setExam(response.data?.onlinevideo?.exam);
  
      const lecturesData = response.data?.onlinevideo?.lectures.map(lecture => ({
        id: lecture.id,
        payment_status: lecture.payment_status
      }));
      setContantData(lecturesData);
      const calculatedCost = response.data?.onlinevideo?.selling_cost - (response.data?.onlinevideo?.selling_cost * 20) / 100;
      setYourCost(calculatedCost);

      console.log(lecturesData, "lecturesData");
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
      onlinevideo: {
        category_id: category.id,
        sub_category_id: subcategory.id,
        exam: exam.id,
        mrp: mrp,
        discount_percent: discount,
        selling_cost: selling,
         lectures:[],
      },
    };
    console.log(data, "datadata");

    const token = decryptData(sessionStorage.getItem("token"));
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/onlinevideo/publish/onlinevideo/${info}`,
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
            fetchTestSeriesData();
          }, 1000);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.response?.data?.message);
      });
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
        <ToastContainer />

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
                  MRP <span style={{ color: "red" }}>*</span>
                </FormLabel>

                <TextField
                  type="number"
                  variant="outlined"
                  required
                  value={mrp}
                  onChange={(e)=>setMrp(e.target.value)}
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
                  Discount <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  value={discount}
                  onChange={(e)=>Cost(e.target.value)}
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
                placeholder="Type Here"
                value={yourCost}
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

            {/* <div>
              <Typography
                className={`${classes.mt1} ${classes.fontfamilyDMSans} ${classes.fw700} ${classes.fontSize7}`}
              >
                Select Video Lectures{" "}
                <span className={classes.textcolorred}>*</span>
              </Typography>
              <div
                className={` ${classes.borderradius10px} ${classes.border1999} ${classes.p0_5}`}
              >
                {content?.map((data, i) => (
                  <div
                    className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifyspacebetween}`}
                    key={i}
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
                          {data?.content_heading}
                        </Typography>
                      </div>
                    </div>
                    <Divider orientation="vertical" flexItem />
                    <div className={`${classes.dflex}`}>
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight} ${classes.pl0_5}`}
                      >
                        Status: {console.log("contentData", contentData[i])}
                      </FormLabel>
                      <RadioGroup
                        aria-label="Payment Status"
                        value={contentData[i].payment_status} // Use payment_status as value
                        name={`contentRadio${i}`}
                        className={`${classes.dflex} ${classes.flexdirectionrow}`}
                        onChange={(e) => handleContentStatus(e, data.id)}
                      >
                        <FormControlLabel
                          className={`${classes.ml0_5}`}
                          value="free"
                          control={
                            <Radio
                              onClick={() => handleContent(data.id, "free")}
                              style={{ padding: "0.5rem" }}
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
                          control={
                            <Radio
                              onClick={() => handleContent(data.id, "paid")}
                              style={{ padding: "0.5rem" }}
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
            </div> */}

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
                onClick={handleSubmit}
                // type="button" // Ensure type is "button"
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

export default EditPublishedVideo;
