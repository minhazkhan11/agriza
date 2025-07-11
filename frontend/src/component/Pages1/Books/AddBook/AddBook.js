import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as BookIcon } from "../../../images/BooksIcon/bookicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import AddBookForm from "./AddBookForm";

function AddBook() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <BookIcon />,
      mainheading: "Create Book",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/books",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <AddBookForm />
    </div>
  );
}
export default AddBook;
