import React from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";

// import AddTeacherForm from "./AddTeacherForm";

import { ReactComponent as AreaIcon } from "../../../../images/headericon/addbussinessicon.svg";
import useStyles from "../../../../../styles";
import AddAreaForm from "./AddAreaForm";

function AddArea({ style }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <AreaIcon />,
      mainheading: "Add Area",
      addbtntext: style?.isPopUp ? undefined : "Back",
      addbtnicon: style?.isPopUp ? undefined : <BackIcon />,
      addbtnstyle: style?.isPopUp ? undefined : "transparentbtn",
      path: "/area-list",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div
      className={`${classes.p2} ${classes[style?.width]} ${
        classes[style?.bgcolor]
      }`}
    >
      <PageHeader Heading={Heading} />
      <AddAreaForm style={style} />
    </div>
  );
}
export default AddArea;
