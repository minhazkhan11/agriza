import React from "react";
import PageHeader from "../../../PageHeader";
import AddCountryForm from "./AddCountryForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";


function AddCountry() {
  const classes = useStyles();




  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Create Country",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/country-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <AddCountryForm />
    </div>
  );
}
export default AddCountry;
