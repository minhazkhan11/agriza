import React, { useState, useEffect } from "react";
import {
  Button,
  Fade,
  FormLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { decryptData } from "../../../../crypto";
import useStyles from "../../../../styles";
import { Divider } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@material-ui/icons/Clear";
import { Autocomplete } from "@mui/material";
import { ReactComponent as RupeesVector } from "../../../images/NotesImage/rupeesvector.svg";
import axios from "axios";

const EditPublishedLiveClasses = (props) => {
  const { open, handleOpenClose, fetchLiveClassData, info } = props;

  console.log("info", info);

  const decryptedToken = decryptData(sessionStorage.getItem("token"));
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
  const [sellingCost, setSellingCost] = useState("");
  const [finalCost, setFinalCost] = useState("");

  const classes = useStyles();

  const handleCategoryChange = (event, value) => {
    setCategory(value);
    setCategoryId(value.id);
    setSubcategory("");
    setSubcategoryId("");
    setExam("");
    setExamId("");
  };
  const handleSubCategoryChange = (event, value) => {
    setSubcategory(value);
    setSubcategoryId(value.id);
    setExam("");
    setExamId("");
  };
  const handleExamChange = (event, value) => {
    setExam(value);
    setExamId(value.id);
  };

  const Cost = (discountValue) => {
    if (!isNaN(discountValue) && discountValue !== "") {
      const parsedDiscount = parseFloat(discountValue); // Parse the discount value as a float

      const calculatedCost = mrp - (mrp * parsedDiscount) / 100;
      const calculatedSellingCost =
        calculatedCost - (calculatedCost * 20) / 100;

      setDiscount(parsedDiscount);
      setFinalCost(calculatedSellingCost);
      setSellingCost(calculatedCost);
    } else {
      setDiscount("");
      setFinalCost("");
    }
  };
  useEffect(() => {
    if (discount) {
      Cost(discount);
    }
  }, [discount, mrp]);

  useEffect(() => {
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

  //fetch data to prefilled
  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasses/publish/liveclass/${info}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          const liveClassData = response?.data?.liveclassData;

          setCategoryId(liveClassData?.category_id);
          setCategory(liveClassData?.category);
          setSubcategoryId(liveClassData?.sub_category_id);
          setSubcategory(liveClassData?.subCategory);
          setExamId(liveClassData?.exam_id);
          setExam(liveClassData?.exam);
          setMrp(liveClassData?.mrp);
          setDiscount(liveClassData?.discount_percent);
          setSellingCost(liveClassData?.selling_cost);
          const calculatedCost =
            response.data?.note?.selling_cost -
            (response.data?.note?.selling_cost * 20) / 100;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    };

    fetchDataFromAPI();
  }, [info, decryptedToken]);

  const handleSubmit = () => {
    if (!categoryId) {
      toast.error("Category is required");
      return;
    }
    if (!subcategoryId) {
      toast.error("Subcategory is required");
      return;
    }

    if (!examId) {
      toast.error("Section is required");
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
    if (!sellingCost) {
      toast.error("Final Cost is required");
      return;
    }

    const data = {
      liveclass: {
        category_id: categoryId,
        sub_category_id: subcategoryId,
        exam_id: examId,
        mrp: mrp,
        discount_percent: discount,
        selling_cost: sellingCost,
      },
    };

    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasses/publish/liveclass/${info}`,
      data,
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          toast.success("Publishe Edited successfully");
          setTimeout(() => {
            fetchLiveClassData();
            handleOpenClose();
          }, 1000);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.response?.data?.message);
      });
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
                options={category.subCategories || []}
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
                options={subcategory.exams || []}
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
                  MRP <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
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
                  value={discount}
                  onChange={(e) => Cost(e.target.value)}
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
                Website Cost <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                type="number"
                variant="outlined"
                required
                placeholder="Type Here"
                value={sellingCost}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RupeesVector />
                      <Divider orientation="vertical" flexItem />
                    </InputAdornment>
                  ),
                  readOnly: true,
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
                You Will Get <span className={classes.textcolorred}>*</span>
              </FormLabel>

              <TextField
                type="number"
                variant="outlined"
                required
                placeholder="Type Here"
                value={finalCost}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RupeesVector />
                      <Divider orientation="vertical" flexItem />
                    </InputAdornment>
                  ),
                  readOnly: true,
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
                onClick={() => {
                  handleSubmit();
                }}
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

export default EditPublishedLiveClasses;
