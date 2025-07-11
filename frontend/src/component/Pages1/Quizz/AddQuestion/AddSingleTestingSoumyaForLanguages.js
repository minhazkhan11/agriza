import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

const defaultOptions = {
  option: "",
  correct_option: false,
  description: "",
};

const names = [
  'English',
  // 'Hindi',
];

function AddSingle() {
  const classes = useStyles();
  const { rowId } = useParams();
  const initialData = {
    questiontype: "",
    hardnesslevel: "",
    topic: "",
  };
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState(initialData);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quillContent1, setQuillContent1] = useState("");
  const [quillContent4, setQuillContent4] = useState("");
  const [quillContent5, setQuillContent5] = useState("");
  const [selectedCorrectOption, setSelectedCorrectOption] = useState("");

  const [personName, setPersonName] = React.useState(["English"]);
  const handleChangeMulti = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const [alphabetArray] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]);

  const [optionsArray, setOptionsArray] = useState([
    { index: 0, ...defaultOptions },
    { index: 1, ...defaultOptions },
    { index: 2, ...defaultOptions },
  ]);

  const quillModules = {
    toolbar: [
      [
        "bold",
        "italic",
        "underline",
        "strike",
        { script: "sub" },
        { script: "super" },
        { color: [] },
        { background: [] },
      ],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["code-block"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "list",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "link",
    "blockquote",
    "code-block",
    "align",
    "image",
  ];

  const handleClose = () => {
    navigate("/admin/exam");
  };

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  

  useEffect(() => {
    // Define a function to fetch topics
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/subject`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTopics(data.subjects);
        } else {
          // Handle the error, e.g., show an error message to the user
          console.error("API Error:", response.status);
        }
      } catch (error) {
        console.error("API Error:", error);
        // Handle the error, e.g., show an error message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchTopics(); // Call the fetchTopics function
  }, [decryptedToken]);

  const handleSubmit = () => {
    const correctOptionIndex = optionsArray.findIndex(
      (option) => option.correct_option
    );
    // Make sure there is at least one correct option
    if (correctOptionIndex === -1) {
      toast.error("Please select a correct option");
      return;
    }
    // Set correct_option to true for the selected correct option, false for others
    const updatedOptionsArray = optionsArray.map((option, index) => ({
      option: alphabetArray[index],
      correct_option: index === correctOptionIndex,
      description: option.option?option.option:"N/A",
      solution: index === correctOptionIndex ? quillContent4 : null,
    }));
    const data = {
      data: {
        question: {
          exam_id:rowId,
          question_type: formDetails.questiontype,
          hardness_level: formDetails.hardnesslevel,
          subject_id: formDetails.topic,
          question: quillContent1,
          description: quillContent5,
        },
        options: updatedOptionsArray,
      },
    };

console.log("data",data)

    // Make the API call with JSON payload
    
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/question/add`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        if (response.success) {
          toast.success(
            "Question created successfully , navigating to Question page"
          );
          // Display the success toast message for 2 seconds before navigating
          setTimeout(() => {
            // navigate(`/admin/exam`);
          }, 2000);
        } else {
          toast.error("Failed to create Question");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error("Failed to create Question");
      });
  };

  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.mt1}  ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
       
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                *Create Question
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Question Type
                </FormLabel>

                <Select
                  labelId="category-label"
                  id="state"
                  value={formDetails.questiontype}
                  name="questiontype"
                  onChange={handleChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Question Type</em>
                  </MenuItem>

                  <MenuItem value={"Single"}>Single</MenuItem>
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Hardness Level
                </FormLabel>

                <Select
                  labelId="category-label"
                  id="state"
                  value={formDetails.hardnesslevel}
                  name="hardnesslevel"
                  onChange={handleChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  <MenuItem value={"easy"}>Easy</MenuItem>
                  <MenuItem value={"medium"}>Medium</MenuItem>
                  <MenuItem value={"hard"}>Hard</MenuItem>
                  <MenuItem value={"expert"}>Expert</MenuItem>
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  Subject
                </FormLabel>
                <Select
                  labelId="demo-simple-select-placeholder-label-label"
                  id="demo-simple-select-placeholder-label"
                  value={formDetails.topic}
                  name="topic"
                  onChange={handleChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Subject</em>
                  </MenuItem>
                  {loading ? (
                    <MenuItem disabled value="">
                      Loading Subjects...
                    </MenuItem>
                  ) : (
                    topics.map((topic) => (
                      <MenuItem key={topic.id} value={topic.id}>
                        {topic.subject_name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                     <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  Language
                </FormLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChangeMulti}
          variant="outlined"
          // input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={menuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
              </div>
            </div>
            {personName.map((link, index) => (
            <div>
            <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                {link}
              </Typography>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                *Enter Question
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Enter Your Question
                </FormLabel>
                <ReactQuill
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                  value={quillContent1}
                  onChange={setQuillContent1}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                *Options
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Enter Your Question
                </FormLabel>
                {optionsArray?.map((op, index) => (
              <div className={classes.input2}>
                <div
                  className={classes.opt}
                  onClick={() => {
                    // Set the selected correct option to the current option (A, B, C, etc.)
                    setSelectedCorrectOption(alphabetArray[index]);

                    // Update the optionsArray to reflect the selected correct option
                    const updatedOptionsArray = optionsArray.map((o, ind) => {
                      return {
                        ...o,
                        correct_option: ind === index,
                      };
                    });
                    setOptionsArray(updatedOptionsArray);
                  }}
                >
                  <Avatar
                    className={
                      classes?.[op?.correct_option ? "avtar_active" : "avtar"]
                    }
                  >
                    {alphabetArray[index]}
                  </Avatar>
                </div>

                <ReactQuill
                  className={classes.quillanswer}
                  value={op?.option}
                  onChange={(e) => {
                    optionsArray[index]["option"] = e;
                    setOptionsArray([...optionsArray]);
                  }}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
            ))}
              </div>
            </div>

           

            {/* Add or Remove Options */}

            {/* <div className={classes.addicon}> */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconButton style={{ marginRight: "1rem" }}>
                <IndeterminateCheckBoxOutlinedIcon
                  onClick={() => {
                    // Ensure there is at least one option remaining
                    if (optionsArray.length > 1) {
                      const lastOption = optionsArray[optionsArray.length - 1];

                      if (lastOption.correct_option) {
                        // Prevent removing the last option if it is the correct answer
                        toast.error(
                          "Cannot remove the last option as it is the correct answer"
                        );
                      } else {
                        optionsArray.pop(); // Remove the last option
                        setOptionsArray([...optionsArray]);
                      }
                    } else {
                      toast.error(
                        "Cannot remove the last option as it is the only option"
                      );
                    }
                  }}
                />
              </IconButton>
              <IconButton style={{ marginRight: "1rem" }}>
                <AddBoxOutlinedIcon
                  onClick={() => {
                    optionsArray.push({
                      index: optionsArray.length,
                      ...defaultOptions,
                    });
                    setOptionsArray([...optionsArray]);
                  }}
                />
              </IconButton>
            </div>



            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                *Solutions
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Solutions
                </FormLabel>
                {selectedCorrectOption && (
                  <Avatar className={classes.avtar}>
                    {selectedCorrectOption}
                  </Avatar>
                )}
                <ReactQuill
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                  value={quillContent4}
                  onChange={setQuillContent4}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} `}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                *Descriptions
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Type Description to question
                </FormLabel>
                <ReactQuill
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                  value={quillContent5}
                  onChange={setQuillContent5}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
            </div>
           </div>
           ))}
          </div>
     
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className={`${classes.custombtnblue}`}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AddSingle;
