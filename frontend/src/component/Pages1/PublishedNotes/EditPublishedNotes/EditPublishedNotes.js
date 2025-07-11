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
import kycicon from "../../../images/PopupScreenIcon/kycicon.png";
import ClearIcon from "@material-ui/icons/Clear";
import { ReactComponent as RupeesVector } from "../../../images/NotesImage/rupeesvector.svg";
import { Autocomplete } from "@mui/material";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const EditPublishedNotes = (props) => {
  const {
    open,
    handleOpenClose,
    fetchData,
    info,
    handleClose,
    fetchTestSeriesData,
  } = props;
  const [Statusvaluevisible, setFormateValueVisible] = useState("");
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
  const [checkCon, setCheckCon] = useState(false);
  const [state, setState] = useState({
    checkedA: true,
  });
  const [sectionData, setSectionsData] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);

  const handleChangeStatusRadio = (event, id) => {
    console.log("event", event.target.value);
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
  const handleSectionChange = (event, value) => {
    setSectionId(value);
  };
  const [content, setContent] = useState([]);
  const [contentData, setContantData] = useState(new Array(content.length).fill({ payment_status: '' }));

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
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/notes/publish/note/${info}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response.data?.sections);
        setCategory(response.data?.note?.category);
        setSubcategory(response.data?.note?.subCategory);
        setSectionId(response.data?.note?.section);
        setValidity(response.data?.note?.validity);
        setMrp(response.data?.note?.mrp);
        setDiscount(response.data?.note?.discount_percent);
        setSellingcost(response.data?.note?.selling_cost);
        setContent(response.data?.note?.contents);
        setContantData(response.data?.note?.contents);
        const calculatedCost = response.data?.note?.selling_cost - (response.data?.note?.selling_cost * 20) / 100;
        setYourCost(calculatedCost);
  
        console.log(contentData, "contentData");
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

    if (!sectionId) {
      toast.error("Section is required");
      return;
    }
    if (!validity) {
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
      note: {
        category_id: categoryId.id,
        sub_category_id: subcategory.id,
        section_id: sectionId.id,
        mrp: mrp,
        discount_percent: discount,
        selling_cost: selling,
        validity: validity,
        contents: contentData,
      },
    };
    console.log(data, "datadata");

    const token = decryptData(sessionStorage.getItem("token"));
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/notes/publish/note/${info}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          toast.success("Publication update successfully submitted");
          setTimeout(() => {
            fetchTestSeriesData();
            handleOpenClose();
          }, 1000);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.response?.data?.message);
      });
  };

  const handleChangeCheckbox = (id, isChecked) => {
    // Toggle the selection
    if (isChecked) {
      // If the content is being checked, add it to selectedContent
      setSelectedContent([...selectedContent, id]);
    } else {
      // If the content is being unchecked, remove it from selectedContent
      const updatedContent = selectedContent.filter((contentId) => contentId !== id);
      setSelectedContent(updatedContent);
  
      // Remove the content from contentData
      setContantData((prevData) => prevData.filter((content) => content.id !== id));
    }
  };
  
  const handleContentStatus = (e, id) => {
    const status = e.target.value;
    const alreadyExists = contentData.some((item) => item.id === id);

    if (!alreadyExists) {
      const newContent = { id: id, payment_status: status };
      setContantData((prevData) => [...prevData, newContent]);
      console.log(contentData, "New content added successfully");
    } else {
      const updatedData = contentData.map((item) => {
        if (item.id === id) {
          return { ...item, payment_status: status };
        }
        return item;
      });
      setContantData(updatedData);
      console.log(contentData, "Content updated successfully");
    }
  };
  const handleContent = (id, status) => {
    const alreadyExists = contentData.some((item) => item.id === id);

    if (!alreadyExists) {
      const newContent = { id: id, payment_status: status };
      setContantData((prevData) => [...prevData, newContent]);
      console.log(contentData, "New content added successfully");
    } else {
      const updatedData = contentData.map((item) => {
        if (item.id === id) {
          return { ...item, payment_status: status };
        }
        return item;
      });
      setContantData(updatedData);
      console.log(contentData, "Content updated successfully");
    }
  };
  const [yourCost,setYourCost]=useState("")
  
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
          className={`${classes.notespopup} ${classes.p1} ${classes.positionrelative} `}
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
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mx0_5} ${classes.mt0_5}  `}
            >
              <div className={`${classes.w49}`}>
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
              </div>
              <div className={`${classes.w49}`}>
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
              </div>
            </div>
           
            <div
              className={`${classes.dflex}  ${classes.mx0_5} ${classes.justifycenter} ${classes.flexdirectioncolumn}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} 
             `}
              >
                Section <span style={{ color: "red" }}>*</span>
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={sectionData || []}
                value={sectionId}
                classes={{ inputRoot: classes.inputRoot }}
                onChange={handleSectionChange}
                disableClearable
                getOptionLabel={(option) => option?.section_name || ""}
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

            <div className={`${classes.dflex} ${classes.mt0_5} `}>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}
              ${classes.pl0_5} ${classes.w20}
             `}
              >
                Validity <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <RadioGroup
                aria-label="Test Series Formate"
                name="Test Series Formate"
                className={`${classes.dflex} ${classes.flexdirectionrow} `}
              >
                <FormControlLabel
                  className={`${classes.ml0_5}`}
                  value="1 month"
                  control={<Radio style={{ padding: "0.5rem" }} />}
                  label={
                    <Typography
                      className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400}  `}
                    >
                      1 Month
                    </Typography>
                  }
                  checked={validity === "1 month"} // Set checked prop based on validity state
                  onChange={() => setValidity("1 month")} // Update validity state
                />

                <FormControlLabel
                  className={`${classes.ml1}`}
                  value="6 month"
                  control={<Radio style={{ padding: "0.5rem" }} />}
                  label={
                    <Typography
                      className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400} `}
                    >
                      6 Month
                    </Typography>
                  }
                  checked={validity === "6 month"} // Set checked prop based on validity state
                  onChange={() => setValidity("6 month")} // Update validity state
                />

                <FormControlLabel
                  className={`${classes.ml1}`}
                  value="12 month"
                  control={<Radio style={{ padding: "0.5rem" }} />}
                  label={
                    <Typography
                      className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400}  `}
                    >
                      12 Month
                    </Typography>
                  }
                  checked={validity === "12 month"} // Set checked prop based on validity state
                  onChange={() => setValidity("12 month")} // Update validity state
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
            </div>

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
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
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
                  value={discount}
                  required
                  placeholder="Type Here"
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
                Select Notes Content{" "}
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

            <div className={`${classes.dflex} ${classes.justifyflexend} `}>
              <Button
                onClick={() => {
                  handleOpenClose();
                }}
                className={`${classes.border1}  ${classes.fontFamilyJost} ${classes.fw600}  ${classes.lightbrowncolor} ${classes.borderradius0375} ${classes.m0_5} ${classes.w30}`}
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

export default EditPublishedNotes;
