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

const defaultOptions = {
  option: "",
  correct_option: false,
  description: "",
};

function AddSingle({ changeTab }) {
  const classes = useStyles();
  const { rowId } = useParams();
  const initialData = {
    questiontype: "Single",
    hardnesslevel: "medium",
    topic: "",
    marks: 0,
    negative_marking: "no",
    negative_marking_score: 0,
    partial_marks: 0,
  };
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState(initialData);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quillContentEnglishQuestion, setQuillContentEnglishQuestion] =
    useState("");
  const [quillContentEnglishSolution, setQuillContentEnglishSolution] =
    useState([]);
  const [quillContentEnglishDescription, setQuillContentEnglishDescription] =
    useState("");
  const [selectedCorrectOption, setSelectedCorrectOption] = useState([]);
  const [optionsArrayEnglish, setOptionsArrayEnglish] = useState([
    { index: 0, ...defaultOptions },
    { index: 1, ...defaultOptions },
    { index: 2, ...defaultOptions },
    { index: 3, ...defaultOptions },
  ]);

  // State variables for Hindi content
  const [quillContentHindiQuestion, setQuillContentHindiQuestion] =
    useState("");
  const [quillContentHindiSolution, setQuillContentHindiSolution] =
    useState("");
  const [quillContentHindiDescription, setQuillContentHindiDescription] =
    useState("");
  const [optionsArrayHindi, setOptionsArrayHindi] = useState([
    { index: 0, ...defaultOptions },
    { index: 1, ...defaultOptions },
    { index: 2, ...defaultOptions },
    { index: 3, ...defaultOptions },
  ]);

  // Add these states for storing Hindi and English solutions for Fill in the Blanks
  const [fillInTheBlankSolutionHindi, setFillInTheBlankSolutionHindi] =
    useState("");
  const [fillInTheBlankSolutionEnglish, setFillInTheBlankSolutionEnglish] =
    useState("");

  // Update for Hindi Solution
  const handleFillInTheBlanksHindiSolutionChange = (event) => {
    setFillInTheBlankSolutionHindi(event.target.value);
  };

  // Update for English Solution
  const handleFillInTheBlanksEnglishSolutionChange = (event) => {
    setFillInTheBlankSolutionEnglish(event.target.value);
  };

  // const handleOptionClick = (alphabet, index, language) => {
  //   if (personName.includes(language)) {
  //     // Update English options
  //     const newOptionsEnglish = optionsArrayEnglish.map((option, i) => ({
  //       ...option,
  //       correct_option: i === index,
  //     }));

  //     // Update Hindi options
  //     const newOptionsHindi = optionsArrayHindi.map((option, i) => ({
  //       ...option,
  //       correct_option: i === index,
  //     }));

  //     // Set the updated options for both languages
  //     setOptionsArrayEnglish(newOptionsEnglish);
  //     setOptionsArrayHindi(newOptionsHindi);

  //     setSelectedCorrectOption(alphabet);
  //   } else {
  //     toast.error(`Please select ${language} language first`);
  //   }
  // };
  // const handleOptionClick = (alphabet, index, language) => {
  //   if (personName.includes(language)) {
  //     if (formDetails.questiontype === "Single") {
  //       // Update English options for single choice
  //       const newOptionsEnglish = optionsArrayEnglish.map((option, i) => ({
  //         ...option,
  //         correct_option: i === index, // Only the selected index will be true
  //       }));

  //       // Update Hindi options for single choice
  //       const newOptionsHindi = optionsArrayHindi.map((option, i) => ({
  //         ...option,
  //         correct_option: i === index, // Only the selected index will be true
  //       }));

  //       // Set the updated options for both languages
  //       setOptionsArrayEnglish(newOptionsEnglish);
  //       setOptionsArrayHindi(newOptionsHindi);

  //       // Set the selected correct option as a single selection
  //       setSelectedCorrectOption([alphabet]); // Store as an array with the single selection
  //     } else if (formDetails.questiontype === "Multiple Choice") {
  //       // For multiple choice questions, toggle the correct option
  //       const newOptionsEnglish = optionsArrayEnglish.map((option, i) => ({
  //         ...option,
  //         correct_option:
  //           i === index ? !option.correct_option : option.correct_option, // Toggle the selected option
  //       }));

  //       const newOptionsHindi = optionsArrayHindi.map((option, i) => ({
  //         ...option,
  //         correct_option:
  //           i === index ? !option.correct_option : option.correct_option, // Toggle the selected option
  //       }));

  //       // Set the updated options for both languages
  //       setOptionsArrayEnglish(newOptionsEnglish);
  //       setOptionsArrayHindi(newOptionsHindi);

  //       // Collect the currently selected options correctly
  //       const selectedOptions = newOptionsEnglish
  //         .filter((option) => option.correct_option) // Filter for selected options
  //         .map((option) => option.alphabet); // Make sure to access the correct property

  //       // Update the selected correct option without empty values
  //       setSelectedCorrectOption(selectedOptions); // Update to only include selected options
  //       console.log("selectedOptions", selectedOptions);
  //     }
  //   } else {
  //     toast.error(`Please select ${language} language first`);
  //   }
  // };

  const handleOptionClick = (alphabet, index, language) => {
    if (personName.includes(language)) {
      if (formDetails.questiontype === "Multiple Choice") {
        // For Multiple Choice, toggle the correct_option for the clicked option
        const newOptionsEnglish = optionsArrayEnglish.map((option, i) => ({
          ...option,
          correct_option:
            i === index ? !option.correct_option : option.correct_option,
        }));

        const newOptionsHindi = optionsArrayHindi.map((option, i) => ({
          ...option,
          correct_option:
            i === index ? !option.correct_option : option.correct_option,
        }));

        setOptionsArrayEnglish(newOptionsEnglish);
        setOptionsArrayHindi(newOptionsHindi);
      } else {
        // For other question types (e.g., Single Choice), only allow one correct option
        const newOptionsEnglish = optionsArrayEnglish.map((option, i) => ({
          ...option,
          correct_option: i === index,
        }));

        const newOptionsHindi = optionsArrayHindi.map((option, i) => ({
          ...option,
          correct_option: i === index,
        }));

        setOptionsArrayEnglish(newOptionsEnglish);
        setOptionsArrayHindi(newOptionsHindi);
      }

      setSelectedCorrectOption(alphabet);
    } else {
      toast.error(`Please select ${language} language first`);
    }
  };

  // Log to see the selected correct option
  console.log("selectedCorrectOption", selectedCorrectOption);

  console.log("optionsArrayEnglish", optionsArrayEnglish); // Log the selected options

  // useEffect to log selectedCorrectOption when it changes
  useEffect(() => {
    console.log("selectedCorrectOption", selectedCorrectOption);
  }, [selectedCorrectOption]);

  const [personName, setPersonName] = React.useState([]);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const handleLanguageDropdownOpen = () => {
    setLanguageDropdownOpen(true);
  };

  const handleLanguageDropdownClose = () => {
    setLanguageDropdownOpen(false);
  };

  const handleChangeMulti = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
    handleLanguageDropdownClose();
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
    changeTab(0);
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

  const [names, setNames] = useState([]);
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const fetchLanguages = async (rowId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/language/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success) {
        const languages = response.data.languages.map((lang) =>
          capitalizeFirstLetter(lang.language)
        );
        setNames(languages); // Update the state with the capitalized language names
        setPersonName(languages); // Pre-select the fetched languages
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchLanguages(rowId);
  }, [rowId]);

  useEffect(() => {
    // Define a function to fetch topics
    const fetchSubjects = async (rowId) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/subject/by_exam/${rowId}`,
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

    fetchSubjects(rowId); // Call the fetchSubjects function
  }, [decryptedToken]);

  const handleEnglishSolutionChange = (value) => {
    setQuillContentEnglishSolution(value);
  };

  const handleHindiSolutionChange = (value) => {
    setQuillContentHindiSolution(value);
  };

  const validateFields = () => {
    // Check if question type, hardness level, and topic are selected
    if (
      !formDetails.questiontype ||
      !formDetails.hardnesslevel ||
      !formDetails.topic
    ) {
      toast.error("Please fill all the fields in the form.");
      return false;
    }

    // Check if at least one language is selected
    if (personName.length === 0) {
      toast.error("Please select at least one language.");
      return false;
    }

    // Check if questions are filled for selected languages
    if (personName.includes("English") && !quillContentEnglishQuestion) {
      toast.error("Please enter the question in English.");
      return false;
    }
    if (personName.includes("Hindi") && !quillContentHindiQuestion) {
      toast.error("Please enter the question in Hindi.");
      return false;
    }

    // Check if options are filled for selected languages
    // (You can add similar checks for options in Hindi)
    for (let option of optionsArrayEnglish) {
      if (
        personName.includes("English") &&
        !option.option &&
        formDetails.questiontype !== "Fill In The Blanks"
      ) {
        toast.error("Please enter all options in English.");
        return false;
      }
    }

    for (let option of optionsArrayHindi) {
      if (
        personName.includes("Hindi") &&
        !option.option &&
        formDetails.questiontype !== "Fill In The Blanks"
      ) {
        toast.error("Please enter all options in Hindi.");
        return false;
      }
    }

    // Check if correct option is selected
    if (
      !selectedCorrectOption &&
      formDetails.questiontype !== "Fill In The Blanks"
    ) {
      toast.error("Please select the correct option.");
      return false;
    }

    // Check if solutions are provided for the correct options
    if (
      personName.includes("English") &&
      selectedCorrectOption &&
      !quillContentEnglishSolution
    ) {
      toast.error("Please enter the solution in English.");
      return false;
    }
    if (
      personName.includes("Hindi") &&
      selectedCorrectOption &&
      !quillContentHindiSolution
    ) {
      toast.error("Please enter the solution in Hindi.");
      return false;
    }

    //     // Check if descriptions are provided
    // if (personName.includes("English") && !quillContentEnglishDescription) {
    //   toast.error("Please enter the description in English.");
    //   return false;
    // }
    // if (personName.includes("Hindi") && !quillContentHindiDescription) {
    //   toast.error("Please enter the description in Hindi.");
    //   return false;
    // }

    return true; // All validations passed
  };

  // const handleSubmit = () => {
  //   // Validate fields before API call
  //   if (!validateFields()) {
  //     return; // Stop the function if validation fails
  //   }

  //   let isCorrectOptionSelected = false;

  //   // Check if a correct option is selected in Hindi or English
  //   if (personName.includes("English")) {
  //     isCorrectOptionSelected = optionsArrayEnglish.some(
  //       (option) => option.correct_option
  //     );
  //   }
  //   if (personName.includes("Hindi")) {
  //     isCorrectOptionSelected =
  //       isCorrectOptionSelected ||
  //       optionsArrayHindi.some((option) => option.correct_option);
  //   }

  //   if (
  //     !isCorrectOptionSelected &&
  //     formDetails.questiontype !== "Fill In The Blanks"
  //   ) {
  //     toast.error("Please select a correct option");
  //     return;
  //   }

  //   // Construct the updated options array

  //   let updatedOptionsArray = optionsArrayEnglish.map((optionEng, index) => {
  //     let hindiOption = optionsArrayHindi[index] || {};

  //     // Check if the formDetails questiontype is "Fill In The Blanks"
  //     let isCorrect = false;
  //     let englishSolution = ""; // Initialize variable to hold the solution for English
  //     let hindiSolution = ""; // Initialize variable to hold the solution for Hindi

  //     if (formDetails.questiontype === "Fill In The Blanks") {
  //       isCorrect = index === 0; // Set the first option as correct for "Fill In The Blanks"
  //       englishSolution = isCorrect ? quillContentEnglishSolution || "" : ""; // Properly assign solution
  //       hindiSolution = isCorrect ? quillContentHindiSolution || "" : "";
  //     } else {
  //       isCorrect = optionEng.correct_option || hindiOption.correct_option; // Default behavior for other question types
  //       englishSolution = isCorrect
  //         ? quillContentEnglishSolution[index] || ""
  //         : ""; // Assign solution based on index
  //       hindiSolution = isCorrect ? quillContentHindiSolution[index] || "" : "";
  //     }

  //     return {
  //       option_en: optionEng.option,
  //       option_hi: hindiOption.option || "",
  //       correct_option: isCorrect,
  //       solution_en: englishSolution, // Set the correct English solution
  //       solution_hi: hindiSolution, // Set the correct Hindi solution
  //       description_en: "",
  //       description_hi: "",
  //     };
  //   });

  //   console.log(updatedOptionsArray);

  //   const data = {
  //     data: {
  //       question: {
  //         exam_id: rowId,
  //         question_type: formDetails.questiontype,
  //         hardness_level: formDetails.hardnesslevel,
  //         subject_id: formDetails.topic,
  //         mark: formDetails.marks,
  //         negative_marking: formDetails.negative_marking,
  //         negative_mark: formDetails.negative_marking_score,
  //         ...(formDetails.questiontype === "Multiple Choice" && {
  //           partial_mark: formDetails.partial_marks,
  //         }),
  //         question_en: quillContentEnglishQuestion,
  //         question_hi: quillContentHindiQuestion,
  //         description_en: quillContentEnglishDescription,
  //         description_hi: quillContentHindiDescription,
  //       },
  //       options: updatedOptionsArray,
  //     },
  //   };

  //   fetch(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/question/add`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${decryptedToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.success) {
  //         toast.success(
  //           "Question created successfully, navigating to Question List Page"
  //         );
  //         setTimeout(() => {
  //           changeTab(0);
  //         }, 2000);
  //       } else {
  //         toast.error(data.message || "Failed to create Question");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("API Error:", error);
  //       toast.error(error.toString());
  //     });
  // };
  const handleSubmit = () => {
    // Validate fields before API call
    if (!validateFields()) {
      return; // Stop the function if validation fails
    }

    let isCorrectOptionSelected = false;

    // Check if a correct option is selected in Hindi or English
    if (personName.includes("English")) {
      isCorrectOptionSelected = optionsArrayEnglish.some(
        (option) => option.correct_option
      );
    }
    if (personName.includes("Hindi")) {
      isCorrectOptionSelected =
        isCorrectOptionSelected ||
        optionsArrayHindi.some((option) => option.correct_option);
    }

    // If no correct option is selected and the question type is not "Fill In The Blanks"
    if (
      !isCorrectOptionSelected &&
      formDetails.questiontype !== "Fill In The Blanks"
    ) {
      toast.error("Please select a correct option");
      return;
    }

    // Construct the updated options array
    let updatedOptionsArray = optionsArrayEnglish.map((optionEng, index) => {
      let hindiOption = optionsArrayHindi[index] || {};

      let isCorrect = false;
      let englishSolution = "";
      let hindiSolution = "";

      // For "Fill In The Blanks", the solution will be a string, so concatenate or use the values directly
      if (formDetails.questiontype === "Fill In The Blanks") {
        isCorrect = index === 0; // First option is correct for "Fill In The Blanks"
        englishSolution = fillInTheBlankSolutionEnglish || ""; // Send the entire solution as a string for English
        hindiSolution = fillInTheBlankSolutionHindi || ""; // Send the entire solution as a string for Hindi
      } else {
        // For other question types, set correct option and assign solutions based on option correctness
        isCorrect = optionEng.correct_option || hindiOption.correct_option;
        englishSolution = isCorrect
          ? quillContentEnglishSolution[index] || ""
          : "";
        hindiSolution = isCorrect ? quillContentHindiSolution[index] || "" : "";
      }

      return {
        option_en: optionEng.option,
        option_hi: hindiOption.option || "",
        correct_option: isCorrect,
        solution_en: englishSolution, // Send solution as string
        solution_hi: hindiSolution, // Send solution as string
        description_en: "", // Add descriptions if necessary
        description_hi: "", // Add descriptions if necessary
      };
    });

    // Log the constructed options array for debugging
    console.log(updatedOptionsArray);

    const data = {
      data: {
        question: {
          exam_id: rowId,
          question_type: formDetails.questiontype,
          hardness_level: formDetails.hardnesslevel,
          subject_id: formDetails.topic,
          mark: formDetails.marks,
          negative_marking: formDetails.negative_marking,
          negative_mark: formDetails.negative_marking_score,
          ...(formDetails.questiontype === "Multiple Choice" && {
            partial_mark: formDetails.partial_marks,
          }),
          question_en: quillContentEnglishQuestion,
          question_hi: quillContentHindiQuestion,
          description_en: quillContentEnglishDescription,
          description_hi: quillContentHindiDescription,
        },
        options: updatedOptionsArray,
      },
    };

    // Send API request to add the question
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
            "Question created successfully, navigating to Question List Page"
          );
          setTimeout(() => {
            changeTab(0); // Redirect after success
          }, 2000);
        } else {
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
        className={`${classes.mt1}  ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.h60vh}`}
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
                  <MenuItem value={"Fill In The Blanks"}>
                    Fill in the blanks
                  </MenuItem>
                  <MenuItem value={"Multiple Choice"}>Multiple Choice</MenuItem>
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
            </div>
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
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
                  disabled
                  value={personName}
                  onChange={handleChangeMulti}
                  open={languageDropdownOpen}
                  onOpen={handleLanguageDropdownOpen}
                  onClose={handleLanguageDropdownClose}
                  variant="outlined"
                  renderValue={(selected) => selected.join(", ")}
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
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Marks
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  name="marks"
                  onChange={handleChange}
                  value={formDetails.marks}
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Negative Marking{" "}
                </FormLabel>
                <Select
                  labelId="negativemarking-label"
                  id="negativemarking"
                  value={formDetails.negative_marking}
                  name="negative_marking"
                  onChange={handleChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  <MenuItem value={"yes"}>Yes</MenuItem>
                  <MenuItem value={"no"}>No</MenuItem>
                </Select>
              </div>
            </div>
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Negative Marking Score{" "}
                </FormLabel>
                <TextField
                  type="float"
                  variant="outlined"
                  required
                  name="negative_marking_score"
                  value={formDetails.negative_marking_score}
                  onChange={handleChange}
                  placeholder="Type Here"
                  disabled={formDetails.negative_marking === "no"}
                />
              </div>
              {formDetails.questiontype === "Multiple Choice" ? (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Partial Marking{" "}
                  </FormLabel>
                  <TextField
                    type="number"
                    variant="outlined"
                    name="partial_marks"
                    onChange={handleChange}
                    value={formDetails.partial_marks}
                    placeholder="Type Here"
                  />
                </div>
              ) : (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                ></div>
              )}
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              ></div>
            </div>
            {personName.map((link, index) => (
              <div key={index} className={classes.mt1}>
                <Typography className={classes.centeredTitle} variant="h6">
                  {capitalizeFirstLetter(link)}
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
                      value={
                        link === "Hindi"
                          ? quillContentHindiQuestion
                          : quillContentEnglishQuestion
                      }
                      onChange={
                        link === "Hindi"
                          ? setQuillContentHindiQuestion
                          : setQuillContentEnglishQuestion
                      }
                      modules={quillModules}
                      formats={quillFormats}
                    />
                  </div>
                </div>
                {formDetails.questiontype !== "Fill In The Blanks" && (
                  <>
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
                          Enter Your Options
                        </FormLabel>

                        {optionsArrayEnglish.map((optionEng, optionIndex) => {
                          const optionHin =
                            optionsArrayHindi[optionIndex] || {};

                          return (
                            <div
                              key={optionIndex}
                              className={`${classes.input2} ${classes.optionContainer}`}
                            >
                              <div
                                className={classes.opt}
                                onClick={() =>
                                  handleOptionClick(
                                    alphabetArray[optionIndex],
                                    optionIndex,
                                    link
                                  )
                                }
                              >
                                <Avatar
                                  className={
                                    (link === "English" &&
                                      optionEng.correct_option) ||
                                    (link === "Hindi" &&
                                      optionHin.correct_option)
                                      ? // ? classes.optionCorrect
                                        // : classes.optionSelected
                                        classes.avtar_active
                                      : classes.avtar
                                  }
                                >
                                  {alphabetArray[optionIndex]}{" "}
                                  {/* Display the alphabet label here */}
                                </Avatar>
                              </div>
                              <ReactQuill
                                className={classes.quillanswer}
                                value={
                                  link === "Hindi"
                                    ? optionHin.option
                                    : optionEng.option
                                }
                                onChange={(e) => {
                                  const newOptionsEnglish = [
                                    ...optionsArrayEnglish,
                                  ];
                                  const newOptionsHindi = [
                                    ...optionsArrayHindi,
                                  ];

                                  if (link === "English") {
                                    newOptionsEnglish[optionIndex].option = e;
                                  } else {
                                    // Ensure that Hindi options array has enough elements
                                    if (!newOptionsHindi[optionIndex]) {
                                      newOptionsHindi[optionIndex] = {
                                        ...defaultOptions,
                                      };
                                    }
                                    newOptionsHindi[optionIndex].option = e;
                                  }

                                  setOptionsArrayEnglish(newOptionsEnglish);
                                  setOptionsArrayHindi(newOptionsHindi);
                                }}
                                modules={quillModules}
                                formats={quillFormats}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add or Remove Options */}

                    {/* <div className={classes.addicon}> */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "3rem",
                      }}
                    >
                      <Button
                        className={classes.addmorebtn}
                        onClick={() => {
                          optionsArrayEnglish.push({
                            index: optionsArrayEnglish.length,
                            ...defaultOptions,
                          });
                          setOptionsArrayEnglish([...optionsArrayEnglish]);
                        }}
                      >
                        Add More
                      </Button>
                      <Button
                        style={{ marginLeft: "1rem" }}
                        className={classes.removebtn}
                        onClick={() => {
                          // Ensure there is at least one option remaining
                          if (optionsArrayEnglish.length > 1) {
                            const lastOption =
                              optionsArrayEnglish[
                                optionsArrayEnglish.length - 1
                              ];

                            if (lastOption.correct_option) {
                              // Prevent removing the last option if it is the correct answer
                              toast.error(
                                "Cannot remove the last option as it is the correct answer"
                              );
                            } else {
                              optionsArrayEnglish.pop(); // Remove the last option
                              setOptionsArrayEnglish([...optionsArrayEnglish]);
                            }
                          } else {
                            toast.error(
                              "Cannot remove the last option as it is the only option"
                            );
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                )}

                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <Typography
                    className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    *Solutions
                  </Typography>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Solution:
                    </FormLabel>

                    {/* For Single Question Type */}
                    {formDetails.questiontype === "Single" &&
                      selectedCorrectOption && (
                        <>
                          <Avatar className={classes.avtar}>
                            {selectedCorrectOption}
                          </Avatar>
                          <ReactQuill
                            className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                            value={
                              link === "Hindi"
                                ? quillContentHindiSolution
                                : quillContentEnglishSolution
                            }
                            onChange={
                              link === "Hindi"
                                ? handleHindiSolutionChange
                                : handleEnglishSolutionChange
                            }
                            modules={quillModules}
                            formats={quillFormats}
                          />
                        </>
                      )}

                    {/* For Single Question Type */}
                    {/* {formDetails.questiontype === "Fill In The Blanks" && (
                      <>
                        <ReactQuill
                          className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                          value={
                            link === "Hindi"
                              ? quillContentHindiSolution
                              : quillContentEnglishSolution
                          }
                          onChange={
                            link === "Hindi"
                              ? handleHindiSolutionChange
                              : handleEnglishSolutionChange
                          }
                          modules={quillModules}
                          formats={quillFormats}
                        />
                      </>
                    )} */}

                    {formDetails.questiontype === "Fill In The Blanks" && (
                      <>
                        <TextField
                          className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                          value={
                            link === "Hindi"
                              ? fillInTheBlankSolutionHindi
                              : fillInTheBlankSolutionEnglish
                          }
                          onChange={
                            link === "Hindi"
                              ? handleFillInTheBlanksHindiSolutionChange
                              : handleFillInTheBlanksEnglishSolutionChange
                          }
                          type="number" // Set to number type for numeric input
                          variant="outlined"
                          fullWidth
                        />
                      </>
                    )}

                    {/* For Multiple Choice Question Type */}
                    {formDetails.questiontype === "Multiple Choice" &&
                      optionsArrayEnglish.map((optionEng, optionIndex) => {
                        const optionHin = optionsArrayHindi[optionIndex] || {};

                        // Only show solution input if the option is marked correct
                        if (
                          optionEng.correct_option ||
                          optionHin.correct_option
                        ) {
                          return (
                            <div
                              key={optionIndex}
                              className={classes.solutionContainer}
                            >
                              <Avatar className={classes.avtar}>
                                {alphabetArray[optionIndex]}{" "}
                                {/* Display the corresponding option letter */}
                              </Avatar>
                              <ReactQuill
                                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.quilladdsinglequestion}`}
                                value={
                                  link === "Hindi"
                                    ? quillContentHindiSolution[optionIndex] ||
                                      ""
                                    : quillContentEnglishSolution[
                                        optionIndex
                                      ] || ""
                                }
                                onChange={(e) => {
                                  // Update the respective solution for the selected option
                                  if (link === "Hindi") {
                                    const newHindiSolutions = [
                                      ...quillContentHindiSolution,
                                    ];
                                    newHindiSolutions[optionIndex] = e;
                                    setQuillContentHindiSolution(
                                      newHindiSolutions
                                    );
                                  } else {
                                    const newEnglishSolutions = [
                                      ...quillContentEnglishSolution,
                                    ];
                                    newEnglishSolutions[optionIndex] = e;
                                    setQuillContentEnglishSolution(
                                      newEnglishSolutions
                                    );
                                  }
                                }}
                                modules={quillModules}
                                formats={quillFormats}
                              />
                            </div>
                          );
                        }
                        return null; // Don't render anything for options not marked as correct
                      })}
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
                      value={
                        link === "Hindi"
                          ? quillContentHindiDescription
                          : quillContentEnglishDescription
                      }
                      onChange={
                        link === "Hindi"
                          ? setQuillContentHindiDescription
                          : setQuillContentEnglishDescription
                      }
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
