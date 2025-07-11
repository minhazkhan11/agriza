import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { ReactComponent as NameIcon } from "../../../images/learnersimage/nameicon.svg";
import { ReactComponent as PhoneIcon } from "../../../images/learnersimage/phoneicon.svg";
import UploadButtons from "../../../CustomComponent/UploadButton";
import useStyles from "../../../../styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UploadMultipleButton from "../../../CustomComponent/UploadMultipleButton";
import ClearIcon from "@material-ui/icons/Clear";
import CloseIcon from "@material-ui/icons/Close";
import { Autocomplete } from "@mui/material";
import { countries } from "countries-list";

function AddBookForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const initialData = {
    bookname: "",
    bookcode: "",
    category_id: "",
    sub_category_id: "",
    exam_id: "",
    author: "",
    asin_no: "",
    paper_back: "",
    language: "",
    purchase_status: "",
    book_quantity: "",
    cost: "",
    item_weight: "",
    mrp: "",
    stock: "",
    discount: "",
    dimensions: "",
    total_cost: "",
    description: "",
    delivery_info: "",

    file: null,
  };

  const [formDetails, setFormDetails] = useState(initialData);
  const [totalCost, setTotalCost] = useState("");
  useEffect(() => {
    calculateTotalCost();
  }, [formDetails]);

  const calculateTotalCost = () => {
    const sellingCost =
      formDetails.mrp - formDetails.mrp * (formDetails.discount / 100);
    setTotalCost(sellingCost);
  };

  const allCountries = Object.values(countries);
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const handleCountryOfOrigin = (event, value) => {
    setCountryOfOrigin(value);
  };

  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const [subcategory, setSubcategory] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  const [exam, setExam] = useState("");
  const [examId, setExamId] = useState("");
  const [exams, setExams] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/category`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      } else {
        console.error("Failed to fetch categories data");
      }
    } catch (error) {
      console.error("Error fetching categories data:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/sub_category/list/${categoryId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubcategories(data.sub_categories);
      } else {
        console.error("Failed to fetch categories data");
      }
    } catch (error) {
      console.error("Error fetching categories data:", error);
    }
  };
  useEffect(() => {
    fetchSubCategories(categoryId);
  }, [categoryId]);

  const fetchExams = async (subcategoryId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/exam/list/${subcategoryId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExams(data.exams);
      } else {
        console.error("Failed to fetch categories data");
      }
    } catch (error) {
      console.error("Error fetching categories data:", error);
    }
  };
  useEffect(() => {
    fetchExams(subcategoryId);
  }, [subcategoryId]);

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
  // const handleFormChange = (fieldName, value) => {
  //   setFormDetails((prevFormDetails) => ({
  //     ...prevFormDetails,
  //     [fieldName]: value,
  //   }));
  // };



  const handleFormChange = (fieldName, value) => {
    if (fieldName === "discount") {
      const numericValue = Number(value);
      if (numericValue < 0 || numericValue > 100) {
        toast.error("Discount must be between 0 and 100.");
        return; // Early return to prevent setting the state with an invalid value
      }
    }
  
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  




  const handleCancel = () => {
    navigate("/admin/books");
  };

  const handleFormSubmit = async () => {
    if (!formDetails.bookname) {
      toast.error("Please enter the book name.");
      return;
    }

    if (!formDetails.bookcode) {
      toast.error("Please enter the book code.");
      return;
    }
    if (!categoryId) {
      toast.error("Please choose your category.");
      return;
    }
    if (!subcategoryId) {
      toast.error("Please choose your Subcategory.");
      return;
    }
    if (!examId) {
      toast.error("Select your Exam.");
      return;
    }
    if (!formDetails.author) {
      toast.error("Insert Author Name.");
      return;
    }

    if (!formDetails.asin_no) {
      toast.error("Insert ASIN Number.");
      return;
    }
    if (!formDetails.language) {
      toast.error("Select your book Language.");
      return;
    }
    if (!formDetails.paper_back) {
      toast.error("Insert paper back.");
      return;
    }
    if (!formDetails.item_weight) {
      toast.error("Insert Book weight.");
      return;
    }
    if (!countryOfOrigin) {
      toast.error("Please Select Your Book origin.");
      return;
    }
    if (!formDetails.dimensions) {
      toast.error("Insert dimensions.");
      return;
    }
    if (!formDetails.delivery_info) {
      toast.error("Insert delivery info.");
      return;
    }
    if (!formDetails.cost) {
      toast.error("Please Enter Book Cost.");
      return;
    }
    if (!formDetails.mrp) {
      toast.error("Please Enter Book Mrp.");
      return;
    }
    if (!formDetails.discount) {
      toast.error("Please Enter Book Discount.");
      return;
    }
    if (!totalCost) {
      toast.error("Please Enter Total Cost.");
      return;
    }
    if (formDetails.stock === "") {
      toast.error("Please Enter Book Stock.");
      return;
    }

    try {
      const formData = new FormData();

      const requestData = {
        name: formDetails.bookname,
        code: formDetails.bookcode,
        category_id: categoryId,
        sub_category_id: subcategoryId,
        exam_id: examId,
        author: formDetails.author,
        asin_no: formDetails.asin_no,
        language: formDetails.language,
        paper_back: formDetails.paper_back,
        item_weight: formDetails.item_weight,
        country_of_origin: countryOfOrigin.name,
        dimensions: formDetails.dimensions,
        delivery_info: formDetails.delivery_info,
        purchase_cost: formDetails.cost,
        mrp: formDetails.mrp,
        discount_percent: formDetails.discount,
        selling_cost: totalCost,
        stock: formDetails.stock,
        description: formDetails.description,
      };

      const requestDataJSON = JSON.stringify(requestData);

      formData.append("book", requestDataJSON);

      images.forEach((image) => {
        formData.append("files", image);
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/books/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Book created successfully!");
        setTimeout(() => {
          navigate("/admin/books", {
            // state: {
            //   book_name: formDetails.book_name,
            //   book_code: formDetails.book_code,
            //   bookId: response.data.book.id,
            // },
          });
        }, 2000);
      } else {
        toast.error("Book is not created !");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error(error.response.data.message || "Book is not created !");
    }
  };


  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    const newImagePreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(newImagePreviews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, idx) => idx !== index);
    setImages(newImages);

    const newImagePreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(newImagePreviews);
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh75}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Book Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Book Name <span className={classes.textcolorred}>*</span>{" "}
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Book Name*"
                  required
                  onChange={(e) => handleFormChange("bookname", e.target.value)}
                  name="book_name"
                  value={formDetails.bookname}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Code <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Book Code*"
                  onChange={(e) => handleFormChange("bookcode", e.target.value)}
                  required
                  name="book_code"
                  value={formDetails.bookcode}
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
              >
                Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
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
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
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
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Author <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Enter here"
                  onChange={(e) => handleFormChange("author", e.target.value)}
                  value={formDetails.author}
                />
              </div>
            </div>

            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Description
                </FormLabel>
                <TextField
                  className={classes.descriptioninput}
                  type="text"
                  variant="outlined"
                  value={formDetails.description}
                  multiline
                  placeholder="Type description you are posting on the Book post"
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  rows={6}
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
              >
                Upload Image
              </Typography>
              <div
                className={`${classes.dflex} ${classes.w75} ${classes.border1} ${classes.py1} ${classes.px2} ${classes.m0_5}`}
              >
                <div className={classes.uploadinner}>
                  <div className={classes.imagePreviewContainer}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className={classes.imagePreview}>
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          style={{ width: "100px", height: "100px" }}
                        />
                        <CloseIcon
                          className={classes.closeIcon}
                          onClick={() => removeImage(index)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Place the button outside the imagePreviewContainer to position it at the end */}
                  <div className={classes.uploadButtonContainer}>
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file-multiple"
                      multiple
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="contained-button-file-multiple">
                      <Button
                        variant="contained"
                        component="span"
                        className={classes.uploadButton}
                      >
                        Upload Images
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  ASIN No. <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Enter here"
                  onChange={(e) => handleFormChange("asin_no", e.target.value)}
                  value={formDetails.asin_no}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Language <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  labelId="language"
                  id="language"
                  value={formDetails.language}
                  name="language"
                  onChange={(e) => handleFormChange("language", e.target.value)}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  <MenuItem value={"Hindi"}>Hindi</MenuItem>
                  <MenuItem value={"English"}>English</MenuItem>
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Paperback <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Enter here"
                  value={formDetails.paper_back}
                  onChange={(e) =>
                    handleFormChange("paper_back", e.target.value)
                  }
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={` ${classes.textcolorformhead} ${classes.w24} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Item weight <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Enter here"
                  value={formDetails.item_weight}
                  onChange={(e) =>
                    handleFormChange("item_weight", e.target.value)
                  }
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Country of Origin{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={allCountries || []}
                  value={countryOfOrigin}
                  classes={{ inputRoot: classes.inputRoot }}
                  onChange={handleCountryOfOrigin}
                  disableClearable
                  getOptionLabel={(option) => option?.name || ""}
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

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Dimensions <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="00"
                  onChange={(e) =>
                    handleFormChange("dimensions", e.target.value)
                  }
                  value={formDetails.dimensions}
                />
              </div>
            </div>
            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              >
                Delivery Info
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Info <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  className={classes.descriptioninput}
                  type="text"
                  variant="outlined"
                  multiline
                  onChange={(e) =>
                    handleFormChange("delivery_info", e.target.value)
                  }
                  value={formDetails.delivery_info}
                  placeholder="Type here all the delivery instruction or select.."
                  rows={6}
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
              >
                Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Purchasing Cost{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  onChange={(e) => handleFormChange("cost", e.target.value)}
                  variant="outlined"
                  value={formDetails.cost}
                  placeholder="Enter here"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  MRP <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  onChange={(e) => handleFormChange("mrp", e.target.value)}
                  variant="outlined"
                  value={formDetails.mrp}
                  placeholder="Enter here"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Discount in % <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  onChange={(e) => handleFormChange("discount", e.target.value)}
                  value={formDetails.discount}
                  placeholder="Enter here"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={` ${classes.textcolorformhead} ${classes.w24} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Total Cost <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  disabled
                  placeholder="Enter here"
                  value={totalCost}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w50}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Stock <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  placeholder="00"
                  onChange={(e) => handleFormChange("stock", e.target.value)}
                  value={formDetails.stock}
                />
              </div>
            </div>
          </div>

          <div className={`${classes.dflex} ${classes.justifyflexend}`}>
            <Button
              onClick={handleCancel}
              className={`${classes.custombtnoutline}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              className={`${classes.custombtnblue}`}
            >
              Save & Continue
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AddBookForm;
