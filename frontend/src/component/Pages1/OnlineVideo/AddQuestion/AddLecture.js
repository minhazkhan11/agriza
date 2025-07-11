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
import InputLabel from "@material-ui/core/InputLabel";
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
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import girl from "../../../images/onlinevideo/girl.png";

const defaultOptions = {
  option: "",
  correct_option: false,
  description: "",
};

const names = [
  "English",
  // 'Hindi',
];

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #C8C8C8",
    fontSize: 16,
    padding: "8px 26px 10px 12px",
    color: "#7A7A7A",
    "&:focus": {
      border: "1px solid rgba(0, 0, 0, 0.87)",
      background: "#FFF",
    },
    "&:hover": {
      border: "1px solid rgba(0, 0, 0, 0.87)",
      background: "#FFF",
    },
  },
}))(InputBase);

function AddLecture() {
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
      typeof value === "string" ? value.split(",") : value
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
    navigate("/admin/onlinevideos");
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
      description: option.option ? option.option : "N/A",
      solution: index === correctOptionIndex ? quillContent4 : null,
    }));
    const data = {
      data: {
        question: {
          exam_id: rowId,
          question_type: formDetails.questiontype,
          hardness_level: formDetails.hardnesslevel,
          subject_id: formDetails.topic,
          question: quillContent1,
          description: quillContent5,
        },
        options: updatedOptionsArray,
      },
    };

    console.log("data", data);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/question/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(
            "Question created successfully, navigating to Question page"
          );
          setTimeout(() => {
            navigate(`/admin/exam`);
          }, 2000);
        } else {
          // Display the error message from the response
          toast.error(data.message || "Failed to create Question");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error(error.toString());
      });
  };

  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.mt1}  ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh52}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py1} ${classes.px1_5}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Lecture Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Lecture Name
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Lecture No.
                </FormLabel>

                <TextField
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  Duration
                </FormLabel>
                <FormControl>
                  <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    MenuProps={menuProps}
                    value={-1}
                    input={<BootstrapInput />}
                  >
                    <MenuItem
                      value={-1}
                      className={`${classes.textplaceholdercolor} `}
                    >
                      Choose Here
                    </MenuItem>
                    <MenuItem value={10}>Math</MenuItem>
                    <MenuItem value={20}>Bio</MenuItem>
                    <MenuItem value={30}>Hindi</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}  `}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight} ${classes.mt1} `}
                >
                  Lecture Date
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}  ${classes.mt1}`}
                >
                  Lecture Host
                </FormLabel>

                <FormControl>
                  <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    MenuProps={menuProps}
                    value={-1}
                    input={<BootstrapInput />}
                  >
                    <MenuItem
                      value={-1}
                      className={`${classes.textplaceholdercolor} `}
                    >
                      Choose Here
                    </MenuItem>
                    <MenuItem value={10}>YouTube</MenuItem>
                    <MenuItem value={20}>Server</MenuItem>
                    <MenuItem value={30}>Google Drive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight} ${classes.mt1}`}
                >
                  Uploaded Video
                </FormLabel>
                <TextField
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="raised-button-file"
                  type="file"
                />
                <label htmlFor="raised-button-file">
                  <Button
                    component="span"
                    variant="outlined"
                    className={` ${classes.w100}`}
                  >
                    Browse
                  </Button>
                </label>
              </div>
            </div>
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}  `}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight} ${classes.mt1} `}
                >
                  Description
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  rows={5}
                  multiline
                />
              </div>
            </div>
          </div>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Preview Info
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w40}`}
              >
                <img src={girl} alt="img" />
              </div>
              <div className={`${classes.w30}  ${classes.p1} `}>
                <Typography
                  className={`${classes.w100} ${classes.textblack}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw700} `}
                >
                  #1: Airbnb’s Director of Experience, Katie Dill, tell us......
                </Typography>
                <Typography
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyDMSans}${classes.fw400}  ${classes.fontsize3} `}
                >
                  Vicky Zhao [BEEAMP]
                </Typography>
                <Typography
                  className={`${classes.ligthcolor}  ${classes.mt1} ${classes.fontfamilyDMSans}${classes.fw400}  ${classes.fontsize3} `}
                >
                  Generate Lorem Ipsum placeholder text for use in your graphic,
                  print and web layouts Generate Lorem Ipsum placeholder text
                  for use in your graphic, print and web Generate Lorem Ipsum
                  placeholder text for use in your graphic, print and web
                  layouts layouts,.....,.....
                </Typography>
                <Typography  className={`${classes.textblack}  ${classes.mr1} ${classes.fontfamilyDMSans}${classes.fw700}  ${classes.fontsize1} `}>1m Views . 6 years ago</Typography>
              </div>
            </div>
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
              Publish
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AddLecture;
