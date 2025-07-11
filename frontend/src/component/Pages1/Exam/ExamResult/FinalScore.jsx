import { Divider, Typography, makeStyles } from "@material-ui/core";
import React from "react";
// import ScoreImage from "../../images/scoreimage.png";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    margin: "3rem auto",
    textAlign: "center",
    "& .MuiTypography-caption": {
      fontFamily: "Jost",
      fontSize: "1.2rem",
      fontWeight: "500",
      color: "#223852",
    },
    "& .MuiTypography-h6": {
      fontFamily: "Jost",
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#223852",
    },
  },
  imageContainer: {},
  yourScore: {
    margin: "2rem auto",
    background: "#E7E7E799",
    width: "15%",
    padding: "0.3rem 2rem",
    borderRadius: "6px",
  },
  incorrectCorrectTime: {
    display: "flex",
    justifyContent: "center",
    margin: "2rem 0",
  },
  divider: {
    margin: "0 3rem",
  },
}));

function FinalScore({ examResultData }) {
  const classes = useStyles();

  console.log("SummeryExamdata", examResultData.summary);
  console.log("examResultDataInScorePG", examResultData);

  return (
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        {/* <img src={ScoreImage} alt="Score" /> */}
      </div>
      <div className={classes.yourScore}>
        <Typography variant="caption">Your Score</Typography>
        <Typography variant="h6">
          {examResultData.summary.received_marks} /{" "}
          {examResultData.summary.total_marks}
        </Typography>
      </div>
      <div className={classes.incorrectCorrectTime}>
        <div>
          <Typography variant="caption">INCORRECT</Typography>
          <Typography variant="h6">
            {examResultData.summary.incorrect_answer}
          </Typography>
        </div>
        <Divider className={classes.divider} orientation="vertical" flexItem />
        <div>
          <Typography variant="caption">CORRECT</Typography>
          <Typography variant="h6">
            {examResultData.summary.correct_answer}
          </Typography>
        </div>
        <Divider className={classes.divider} orientation="vertical" flexItem />
        <div>
          <Typography variant="caption">TIME TAKEN</Typography>
          <Typography variant="h6">
            {examResultData.summary.time_taken} Minutes
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default FinalScore;
