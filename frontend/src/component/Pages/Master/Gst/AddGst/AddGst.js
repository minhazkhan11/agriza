import React from "react";
import PageHeader from "../../../PageHeader";
import AddGstForm from "./AddGstForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";

function AddGst({ style }) {
  const classes = useStyles();
  

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Create GST",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: style?.isPopUp ? undefined : "Back",
          addbtnicon: style?.isPopUp ? undefined : <BackIcon />,
          addbtnstyle: style?.isPopUp ? undefined : "transparentbtn",
      path: "/gst-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes[style?.width]} ${
        classes[style?.bgcolor]
      }`}>
      <PageHeader Heading={Heading} />
      <AddGstForm style={style}/>
    </div>
  );
}
export default AddGst;
