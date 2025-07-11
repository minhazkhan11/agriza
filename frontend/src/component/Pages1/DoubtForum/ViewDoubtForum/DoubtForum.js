import React from "react";
import useStyles from "../../../../styles";

import PageHeader from "../../PageHeader";
import { ReactComponent as DoubtForumIcon } from "../../../images/doutforumimage/dooutformicon.svg";
import DetailsDoubts from "./DetailsDoubts";
import ViewDoubtForumList from "./ViewdoubtforumList";

;


function DoubtForum() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<DoubtForumIcon />,
      mainheading: "Doubt Forum !  ",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      // addbtntext:"Create SMS",
      // addbtnicon: <AddIcon />,
      // addbtnstyle: "bluebtn",
      // path:"/admin/createform",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <DetailsDoubts/>
      <ViewDoubtForumList/>
  
    
    </div>
  );
}
export default DoubtForum;