import React from "react";
import PageHeader from "../PageHeader";
import { ReactComponent as FormsIcon } from "../../images/mainheadingicon/form.svg";
import useStyles from "../../../styles";
import FillFormDetails from "./FillFormDetails";


function FormSubmission() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<FormsIcon />,
      mainheading: "Form Submission",
      
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}  ${classes.m0auto}`}>
      <PageHeader Heading={Heading}/>
      <FillFormDetails/>
    </div>
  );
}
export default FormSubmission;