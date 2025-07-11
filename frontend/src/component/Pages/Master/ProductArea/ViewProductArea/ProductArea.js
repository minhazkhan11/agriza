import React from "react";
import PageHeader from "../../../PageHeader";
import ViewProductArea from "./ViewProductArea";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function ProductArea() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Product Area",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Product Area",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-product-area",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewProductArea />
    </div>
  );
}
export default ProductArea;
