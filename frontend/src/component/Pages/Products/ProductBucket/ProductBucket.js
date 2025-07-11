import React from "react";
import PageHeader from "../../PageHeader";
import ViewProductBucket from "./ViewProductBucket";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import { ReactComponent as Dashboard } from "../../../images/mainheadingicon/Dashboard.svg";
import LearnerDetails from "../../../CustomComponent/LearnerDetails";
import { Search } from "@material-ui/icons";
import { InputAdornment, TextField } from "@material-ui/core";

function ProductBucket() {
  const classes = useStyles();
  const menuProps = {
    // getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  
  // const Heading = [
  //   {
  //     id: 1,
  //     pageicon: <Dashboard />,
  //     mainheading: "Product Bucket",
  //     downloadlink: "Download bulk Sample Files",
  //     // addbtntext: "Search By Product Name",
  //     addbtnicon: (
  //       <TextField
  //         className={`${classes.textcolorformlabel} ${classes.fontsize3}`}
  //         type="text"
  //         variant="outlined"
  //         required
  //         placeholder="Search By Product Name"
  //         // value={searchInput}
  //         // onChange={handleInputChange}
  //       />
  //     ),
  //     addbtnstyle: "bluebtn",
  //   },
  // ];

  const Heading = [
    {
      id: 1,
      pageicon: <Dashboard />,
      mainheading: "Product Bucket",
      // subhead: "Want to Add in Bulk ? ?",
      downloadlink: "Download bulk Sample Files",
      addbtntext: "Search By Product Name",
      addbtnicon: <Search />,
      addbtnstyle: "bluebtn",
      // path: "/create-product",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewProductBucket />
    </div>
  );
}
export default ProductBucket;
