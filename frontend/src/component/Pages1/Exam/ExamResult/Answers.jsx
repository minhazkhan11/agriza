import { Divider, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import QuestionsAndOptions from "./QuestionsAndOptions";

const useStyles = makeStyles((theme) => ({
  container: {},
  headingMain: {
    width: "100%",
    "& .MuiTypography-h3": {
      color: "#223852",
      textAlign: "center",
      fontSize: "1rem",
      fontStyle: "normal",
      fontWeight: "600",
      lineHeight: "2.625rem",
      textTransform: "capitalize",
    },
  },
  divider: {
    width: "5%",
    textAlign: "center",
    margin: "0rem auto",
    height: "5px",
    background: "#4565B7",
    borderRadius: "6px",
  },
}));

function Answers({ examResultData, ref }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.headingMain} ref={ref}>
        <Typography variant="h3">Your Answers</Typography>
        <Divider className={classes.divider} />
      </div>
      <QuestionsAndOptions examResultData={examResultData} />
    </div>
  );
}

export default Answers;
