import React from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
// import AddTeacherForm from "./AddTeacherForm";

import { ReactComponent as RegionIcon } from "../../../../images/headericon/addbussinessicon.svg";
import useStyles from "../../../../../styles";
import AddRegionForm from "./AddRegionForm";

function AddRegion({ style }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <RegionIcon />,
      mainheading: "Add Region",
      addbtntext: style?.isPopUp ? undefined : "Back",
      addbtnicon: style?.isPopUp ? undefined : <BackIcon />,
      addbtnstyle: style?.isPopUp ? undefined : "transparentbtn",
      path: "/region-list",
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
      <AddRegionForm style={style} />
    </div>
  );
}
export default AddRegion;
