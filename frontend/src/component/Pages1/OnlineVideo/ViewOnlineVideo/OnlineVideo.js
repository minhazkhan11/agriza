import React from "react";
import useStyles from "../../../../styles";
import PageHeader from "../../PageHeader";
import { ReactComponent as VideoIcon } from "../../../images/onlinevideo/videoicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import ViewOnlineVideo from "./ViewOnlineVideo";

const OnlineVideo = () => {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <VideoIcon />,
      mainheading: "Online Video",
      // subhead: "Want to Add Bulk Videos ?",
      downloadlink: "Download bulk Sample Files",
      addbtntext: "Add Video",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/admin/addonlinevideo",
      // showDownloadButton: "yes"
    },
  ];
  return (
    <>
      <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
        <PageHeader Heading={Heading} />
        <ViewOnlineVideo />
      </div>
    </>
  );
};

export default OnlineVideo;
