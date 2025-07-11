import React from "react";
import { ReactComponent as BookIcon } from "../../../images/BooksIcon/bookicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewBooks from "./ViewBooks";
import PageHeaderPopup from "../../../CustomComponent/PageHeaderPopup";


function Books() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<BookIcon />,
      mainheading: "Books",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Add",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/addbook",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeaderPopup Heading={Heading}/>
      <ViewBooks/>
    </div>
  );
}
export default Books;