import React from "react";
import PageHeader from "../../PageHeader";
import PublishedIcon from '@material-ui/icons/Publish';
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewPublishedOnlineVideos from "./ViewPublishedOnlineVideos";


function PublishedOnlineVideos() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<PublishedIcon />,
      mainheading: "Published Online Videos",
      
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewPublishedOnlineVideos/>
    </div>
  );
}
export default PublishedOnlineVideos;