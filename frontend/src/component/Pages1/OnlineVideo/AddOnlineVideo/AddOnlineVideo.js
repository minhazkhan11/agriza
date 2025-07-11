import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import { ReactComponent as VideoIcon } from "../../../images/onlinevideo/videoicon.svg";
import AddOnlineVideoForm from "./AddOnlineVideoForm";

const AddOnlineVideo = () => {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <VideoIcon />,
      mainheading: "Add Online Video",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/onlinevideos",
    },
  ];
  return (
   <>
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <AddOnlineVideoForm/>
    </div>
   </>
  )
}

export default AddOnlineVideo
