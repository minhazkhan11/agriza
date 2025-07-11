import React from "react";
import PageHeader from "../../PageHeader";
import PublishedIcon from '@material-ui/icons/Publish';
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewPublishedEbooks from "./ViewPublishedEbooks";


function PublishedEbooks() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<PublishedIcon />,
      mainheading: "Published Ebooks",
      
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewPublishedEbooks/>
    </div>
  );
}
export default PublishedEbooks;