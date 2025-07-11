import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import { ReactComponent as VideoIcon } from "../../../images/onlinevideo/videoicon.svg";
import EditOnlineVideoForm from "./EditOnlineVideoForm";


const EditOnlineVideo = () => {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <VideoIcon />,
      mainheading: "Edit Online Video",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/onlinevideos",
    },
  ];
  return (
   <>
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <EditOnlineVideoForm/>
    </div>
   </>
  )
}

export default EditOnlineVideo
