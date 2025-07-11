import { InputAdornment, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import { ReactComponent as NotepadIcon } from "../../../images/examimage/notepadicon.svg";
import { ReactComponent as CheckedIcon } from "../../../images/examimage/checkvector.svg";
import { ReactComponent as CrossIcon } from "../../../images/examimage/crossvector.svg";
import WrongAnswer from "./WrongAnswer";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    margin: "2rem auto",
  },
  containerInner: {
    margin: "3rem 0",
    breakInside: "avoid",
  },
  heading: {
    display: "flex",
    alignItems: "center",
    background: "#D7DAF2",
    padding: "0.4rem 3rem",
    borderRadius: "6px",
    "& .MuiTypography-h3": {
      color: "#252525",
      fontSize: "1rem",
      fontStyle: "normal",
      fontWeight: "600",
      lineHeight: "2.625rem",
      textTransform: "capitalize",
    },
  },
  notepadIcon: {
    margin: "0 0.5rem",
  },
  quizContainer: {
    background: "#FCFCFC",
    padding: "1rem 2rem ",
  },
  direction: {
    margin: "2rem 0",
  },
  question: {
    "& .MuiTypography-caption": {
      color: "#727272",
      fontSize: "0.8rem",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "2.625rem",
      textTransform: "capitalize",
    },
    "& .MuiTypography-h6": {
      color: "#252525",
      fontSize: "0.95rem",
      fontStyle: "normal",
      lineHeight: "1.625rem",
      textTransform: "capitalize",
    },
  },
  optionsContainer: {
    margin: "3rem 0",
  },
  options: {
    margin: "1rem 0",
    padding: "0.6rem",
    background: "#FFF",
    display: "flex",
    alignItems: "center",
    borderRadius: "6px",
    boxShadow: "0px 6px 20px 0px rgba(0, 0, 0, 0.06)",
    "& .MuiTypography-h6": {
      width: "93%",
      color: "#252525",
      fontSize: "0.8rem",
      fontStyle: "normal",
      fontWeight: "600",
      lineHeight: "1.625rem",
      textTransform: "capitalize",
    },
  },
  rightOption: {
    background: "#EEFFF0",
    border: "2px solid #AAFFB2",
  },
  wrongOption: {
    background: "#FFF2F2",
    border: "2px solid #FFC1C1",
  },
  squareBox: {
    width: "28px",
    height: "28px",
    backgroundColor: "rgba(241, 241, 241, 1)",
    fontWeight: "500",
    color: "rgba(33, 33, 33, 1)",
    fontSize: "18px",
    textTransform: "capitalize",
    borderRadius: "4px",
    fontFamily: "'Jost', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  redSquareBox: {
    backgroundColor: "rgba(255, 57, 57, 1)",
    color: "white",
  },
  greenSquareBox: {
    backgroundColor: "rgba(0, 169, 17, 1)",
    color: "white",
  },
  crossIcon: {
    color: "rgba(255, 252, 244, 1)",
    padding: "0.3rem",
    width: "13px",
    height: "13px",
    backgroundColor: "rgba(255, 57, 57, 1)",
    borderRadius: "6px",
  },

  checkIcon: {
    color: "rgba(255, 255, 255, 1)",
    padding: "0.3rem",
    width: "13px",
    height: "13px",
    backgroundColor: "rgba(0, 169, 17, 1)",
    borderRadius: "6px",
  },
}));

function QuestionsAndOptions({ examResultData }) {
  const classes = useStyles();
  const selectLanguage = "english";

  const getAlphabetLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  const isSame = (xs, ys, index) => {
    if (xs.sort().join(",") === ys.sort().join(",")) {
      return true;
    }
    return false;
  };

  return (
    <div className={classes.container}>
      {examResultData.result.map((item, index) => {
        const correctOptionIds = item.correct_option_ids ?? [];
        const selectedOptionIds = item.selected_option_ids ?? [];
        let isNoOptionSelected =
          selectedOptionIds.length === 0 && item.answer === "";
        const isFillUp = item.question_type === "Fill In The Blanks";
        let correctFillUpOption = null;
        if (isFillUp) {
          correctFillUpOption =
            item.options.filter((opt) => opt.correct_option)[0] ?? null;
        }
        if (correctFillUpOption) {
          correctFillUpOption = correctFillUpOption?.solution_en;
        }
        return (
          <div key={item.id} className={classes.containerInner}>
            <div className={classes.heading}>
              <NotepadIcon className={classes.notepadIcon} />
              <Typography variant="h3">
                Question {index + 1} / {examResultData.result.length}
              </Typography>
            </div>
            <div className={classes.quizContainer}>
              <div className={classes.question}>
                <Typography
                  variant="caption"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectLanguage === "english"
                        ? item.question_en
                        : item.question_hi,
                  }}
                />
              </div>
              {(isFillUp && item.answer) || !isFillUp ? (
                <div className={classes.optionsContainer}>
                  {item.options.map((option, optIndex) => {
                    if (!isFillUp || (isFillUp && option.correct_option)) {
                      let success = null;
                      if (option.correct_option) {
                        success = true;
                        if (isFillUp && option.solution_en !== item.answer) {
                          success = false;
                        }
                      } else if (selectedOptionIds.includes(option.id)) {
                        success = false;
                      } else if (isFillUp) {
                        success = false;
                      }

                      return (
                        <div
                          key={option.id}
                          className={`${classes.options} ${
                            success === true
                              ? classes.rightOption
                              : success === false
                              ? classes.wrongOption
                              : ""
                          }`}
                        >
                          {isFillUp ? (
                            <></>
                          ) : (
                            <InputAdornment position="start">
                              <div className={`${classes.squareBox}`}>
                                {isFillUp ? "A" : getAlphabetLetter(optIndex)}
                              </div>
                            </InputAdornment>
                          )}
                          <Typography
                            variant="h6"
                            dangerouslySetInnerHTML={{
                              __html: isFillUp
                                ? item.answer
                                : selectLanguage === "english"
                                ? option.option_en
                                : option.option_hi,
                            }}
                          />
                          <InputAdornment position="end">
                            {(isFillUp
                              ? option.solution_en === item.answer
                              : option.correct_option) && (
                              <CheckedIcon className={classes.checkIcon} />
                            )}
                            {((selectedOptionIds &&
                              selectedOptionIds.includes(option.id) &&
                              !option.correct_option) ||
                              (isFillUp &&
                                option.solution_en !== item.answer)) && (
                              <CrossIcon className={classes.crossIcon} />
                            )}
                          </InputAdornment>
                        </div>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </div>
              ) : (
                <></>
              )}
              {/* Display WrongAnswer component */}
              {isFillUp && correctFillUpOption !== item.answer && (
                <WrongAnswer
                  correctOptionIds={correctOptionIds}
                  options={item.options}
                  selectLanguage={selectLanguage}
                  isNoOptionSelected={isNoOptionSelected}
                  isFillInTheBlank={isFillUp}
                  answer={item?.answer ?? ""}
                  correctFillUpOption={correctFillUpOption}
                  selectedOptionIds={selectedOptionIds}
                  questionType={item.question_type}
                />
              )}
              {!isFillUp &&
                (isNoOptionSelected ||
                  !isSame(selectedOptionIds, correctOptionIds)) && (
                  <WrongAnswer
                    correctOptionIds={correctOptionIds}
                    options={item.options}
                    selectLanguage={selectLanguage}
                    isNoOptionSelected={isNoOptionSelected}
                    isFillInTheBlank={isFillUp}
                    answer={item?.answer ?? ""}
                    correctFillUpOption={correctFillUpOption}
                    selectedOptionIds={selectedOptionIds}
                    questionType={item.question_type}
                  />
                )}

              {/* Display success message if the answer is correct */}
              {((isSame(selectedOptionIds, correctOptionIds, index + 1) &&
                selectedOptionIds.length > 0) ||
                correctFillUpOption === item.answer) && (
                <Typography variant="h6" style={{ color: "green" }}>
                  Your Answer is Correct!
                </Typography>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuestionsAndOptions;
