import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import { ReactComponent as ClassesIcon } from "../../../images/LiveClasses/ClassesIcon.svg";
import AddLiveClassesForm from "./AddLiveClassesForm";


const AddLiveClasses = () => {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <ClassesIcon />,
      mainheading: "Add Live Class",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/liveclasses",
    },
  ];
  return (
   <>
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <AddLiveClassesForm/>
    </div>
   </>
  )
}

export default AddLiveClasses
