import React from "react";
import PageHeader from "../../PageHeader";
import PublishedIcon from '@material-ui/icons/Publish';
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewPublishedTestSeries from "./ViewPublishedTestSeries";


function PublishedTestSeries() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<PublishedIcon />,
      mainheading: "Published Test Series",
      
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewPublishedTestSeries/>
    </div>
  );
}
export default PublishedTestSeries;