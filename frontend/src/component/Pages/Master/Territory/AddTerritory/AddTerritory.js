import React from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as TerritoryIcon } from "../../../../images/headericon/addbussinessicon.svg";
import useStyles from "../../../../../styles";
import AddTerritoryAreaForm from "./AddTerritoryForm";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";

function AddTerritoryArea({ style }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <TerritoryIcon />,
      mainheading: "Add Territory",

      addbtntext: style?.isPopUp ? undefined : "Back",
      addbtnicon: style?.isPopUp ? undefined : <BackIcon />,
      addbtnstyle: style?.isPopUp ? undefined : "transparentbtn",
      path: "/territory-list",
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
      <AddTerritoryAreaForm style={style} />
    </div>
  );
}
export default AddTerritoryArea;
