import React from "react";
import PageHeader from "../../../PageHeader";
import ViewProduct from "./ViewProduct";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function Product() {
  const classes = useStyles();
  
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Item",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Item",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-item",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewProduct />
  </div>
  );
}
export default Product;