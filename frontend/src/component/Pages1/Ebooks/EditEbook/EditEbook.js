import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as EbookIcon } from "../../../images/EbooksIcon/ebookicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import EditEbookForm from "./EditEbookForm";

function EditEbook() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <EbookIcon />,
      mainheading: "Edit E-Book",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/ebooks",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <EditEbookForm />
    </div>
  );
}
export default EditEbook;
