import React from "react";
import PageHeader from "../../PageHeader";
import PublishedIcon from '@material-ui/icons/Publish';
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewPublishedNotes from "./ViewPublishedNotes";


function PublishedNotes() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<PublishedIcon />,
      mainheading: "Published Notes",
      
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewPublishedNotes/>
    </div>
  );
}
export default PublishedNotes;