import React, { useState, useEffect } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import FinalScore from "./FinalScore";
import Answers from "./Answers";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { Print } from "@material-ui/icons";
import { useReactToPrint } from "react-to-print";

const useStyles = makeStyles((theme) => ({
  container: {},
  headingMain: {
    width: "100%",
    background: "#4565B7",
    "& .MuiTypography-h3": {
      color: "#FFF",
      textAlign: "center",
      fontSize: "1.3rem",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "2.625rem",
      textTransform: "capitalize",
    },
  },
  pdfBtn: {
    background: "#00577B !important",
    color: "white !important",
    fontSize: "0.87rem !important",
    fontFamily: "Outfit !important",
    fontWeight: "600 !important",
    textTransform: "capitalize !important",
    padding: "0.3rem 0.6rem !important",
    "&:hover": {
      background: "#00577B !important",
      color: "white !important",
    },
  },
  pdfContainer: {
    display: "flex",
    justifyContent: "flex-end",
    margin: "8px",
  },
}));

function ExamScore() {
  const classes = useStyles();
  const location = useLocation();

  // const examResultData = JSON.parse(location.state?.examResult);

  let examResultData;
  try {
    examResultData = JSON.parse(location.state?.examResult);
  } catch (error) {
    console.error("Error parsing examResultData:", error);
  }

  const componentRef = React.useRef(null);

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
    document.getElementById("elementId").classList.remove("hide-print");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    document.getElementById("elementId").classList.add("hide-print");

    return Promise.resolve();
  }, []);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "AwesomeFileName",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  return (
    <div className={classes.container} id="pdf-container" ref={componentRef}>
      <div className={classes.headingMain}>
        <Typography variant="h3">Exam Score!</Typography>
      </div>
      <div className={[classes.pdfContainer]}>
        <Button
          id="elementId"
          endIcon={<Print />}
          onClick={printFn}
          title="Print Results"
          size="large"
          className={[classes.pdfBtn]}
        >
          PDF
        </Button>
      </div>
      {examResultData && <FinalScore examResultData={examResultData} />}
      {examResultData && examResultData.result && (
        <Answers examResultData={examResultData} />
      )}
    </div>
  );
}

export default ExamScore;
