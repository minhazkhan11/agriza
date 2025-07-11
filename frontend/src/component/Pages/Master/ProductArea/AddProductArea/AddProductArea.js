import React from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as ProductIcon } from "../../../../images/headericon/addbussinessicon.svg";
import useStyles from "../../../../../styles";
import AddProductAreaFrom from "./AddProductAreaForm";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";

function AddProductArea() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <ProductIcon />,
      mainheading: "Add Product Area",

      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/product-area-list",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddProductAreaFrom />
    </div>
  );
}
export default AddProductArea;
