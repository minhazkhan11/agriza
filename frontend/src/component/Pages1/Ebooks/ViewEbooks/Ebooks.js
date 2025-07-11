import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as BookIcon } from "../../../images/BooksIcon/bookicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewEbooks from "./ViewEbooks";


function Ebooks() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<BookIcon />,
      mainheading: "Ebooks",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Add",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/addebook",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewEbooks/>
    </div>
  );
}
export default Ebooks;