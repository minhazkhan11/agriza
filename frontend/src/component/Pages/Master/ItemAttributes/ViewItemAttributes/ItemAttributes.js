import React from "react";
import PageHeader from "../../../PageHeader";
import ViewItemAttributes from "./ViewItemAttributes";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function ItemAttributes() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Item Attributes",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Item Attributes",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-item-attribute",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewItemAttributes />
  </div>
  );
}
export default ItemAttributes;