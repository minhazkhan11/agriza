import React from "react";
import {
  makeStyles,
  Box,
  IconButton,
  Typography,
  Divider,
} from "@material-ui/core";
import { ReactComponent as CrossIcon } from "../../../images/examimage/crossvector.svg";

const useStyles = makeStyles((theme) => ({
  circularIcon: {
    color: "rgba(255, 252, 244, 1)",
    padding: "0.5rem",
    width: "13px",
    height: "13px",
    backgroundColor: "rgba(255, 57, 57, 1)",
    borderRadius: "100%",
  },
  horizontalLine: {
    borderTop: "1px solid rgba(234, 234, 234, 1)",
    margin: "20px 0",
  },
  crossAndRedText: {
    display: "flex",
    alignItems: "center",
  },
  textInRed: {
    fontFamily: "'Jost', sans-serif",
    fontWeight: "400",
    fontSize: "18px",
    color: "rgba(255, 57, 57, 1)",
    // margin: "-43px 0px 0px 50px",
  },
  solutionText: {
    fontFamily: "'Jost', sans-serif",
    fontWeight: "400",
    fontSize: "18px",
    margin: "17px 0px 0px 14px",
    color: "rgba(73, 73, 73, 1)",
  },
  paragraphText: {
    fontFamily: "'Jost', sans-serif",
    fontWeight: "300",
    fontSize: "18px",
    color: "rgba(0, 0, 0, 1)",
    padding: "0 13px",
    margin: "10px 0px",
    lineHeight: "24px",
  },
  topicContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "50%",
  },
  topicText: {
    padding: "0 13px",
    fontFamily: "'Jost', sans-serif",
    fontWeight: "400",
    fontSize: "18px",
    color: "rgba(0, 0, 0, 1)",
    [theme.breakpoints.down("sm")]: {
      whiteSpace: "nowrap",
    },
  },
  spanText: {
    fontFamily: "'Jost', sans-serif",
    fontWeight: "500",
    fontSize: "20px",
    color: "rgba(0, 0, 0, 1)",
  },
}));

function WrongAnswer({
  correctOptionIds,
  options,
  selectLanguage,
  isNoOptionSelected,
  selectedOptionIds,
  answer = "",
  isFillInTheBlank = false,
  questionType = "",
  correctFillUpOption,
}) {
  const classes = useStyles();
  const errorMessage = isFillInTheBlank
    ? answer
      ? "Oops! Your Answer Is Wrong."
      : "Oops! You Have Not Answered This Question."
    : isNoOptionSelected
    ? "Oops! You Have Not Selected Any Option For This Question."
    : questionType === "Multiple Choice"
    ? "Your Answer Is Partially Correct."
    : "Oops! Your Answer Is Wrong.";

  const getAlphabetLetter = (index) => {
    if (index === null) return "";
    return String.fromCharCode(65 + index);
  };

  const getSolutionText = (option) => {
    return selectLanguage === "english"
      ? option.solution_en
      : option.solution_hi;
  };

  const FillUpAnswer = () => (
    <Typography variant="body1" className={classes.solutionText}>
      <span className={classes.spanText}>Answer:</span> The correct answer is{" "}
      {options.map((item) =>
        item.correct_option ? (
          <span
            dangerouslySetInnerHTML={{ __html: getSolutionText(item) }}
          ></span>
        ) : (
          <></>
        )
      )}
      {answer ? <span> and you've answered: {answer}</span> : <></>}
    </Typography>
  );
  const MCQAnswer = () => (
    <Typography variant="body1" className={classes.solutionText}>
      <span className={classes.spanText}>Answer:</span> The correct options are:
      {correctOptionIds
        ?.map((id) =>
          getAlphabetLetter(options.findIndex((item) => item.id === id))
        )
        .join(",") ?? ""}{" "}
      {selectedOptionIds.length > 0 ? (
        <>
          <span>and you've selected:</span>
          {selectedOptionIds
            ?.map((id) =>
              getAlphabetLetter(options.findIndex((item) => item.id === id))
            )
            .join(",") ?? ""}
        </>
      ) : (
        <></>
      )}
    </Typography>
  );

  const SCQAnswer = () => (
    <Typography variant="body1" className={classes.solutionText}>
      <span className={classes.spanText}>Answer:</span> The correct option is{" "}
      {correctOptionIds
        ?.map((id) =>
          getAlphabetLetter(options.findIndex((item) => item.id === id))
        )
        .join(",") ?? ""}{" "}
      {selectedOptionIds.length > 0 ? (
        <>
          <span>and you've selected:</span>
          {selectedOptionIds
            ?.map((id) =>
              getAlphabetLetter(options.findIndex((item) => item.id === id))
            )
            .join(",") ?? ""}
        </>
      ) : (
        <></>
      )}
    </Typography>
  );

  return (
    <Box>
      <div className={classes.crossAndRedText}>
        <IconButton>
          <CrossIcon className={classes.circularIcon} />
        </IconButton>
        <Typography variant="body1" className={classes.textInRed}>
          {errorMessage}
        </Typography>
      </div>
      {/* MCQ */}
      {questionType === "Multiple Choice" && <MCQAnswer />}
      {/*  SCQ */}
      {questionType === "Single" && <SCQAnswer />}
      {/* FILL UP */}
      {isFillInTheBlank && <FillUpAnswer />}
      {/* SOLUTION UNCOMMENT FOR SOLUTIONS */}
      {/* <Typography variant="body1" className={classes.paragraphText}>
        <span className={classes.spanText}>Solution:</span>
        {options.map((item) =>
          item.correct_option ? (
            <span
              dangerouslySetInnerHTML={{ __html: getSolutionText(item) }}
            ></span>
          ) : (
            <></>
          )
        )}
      </Typography> */}

      <Divider className={classes.horizontalLine} />
    </Box>
  );
}

export default WrongAnswer;
