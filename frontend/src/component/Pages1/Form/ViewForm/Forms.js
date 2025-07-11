import React from "react";
import useStyles from "../../../../styles";

import PageHeader from "../../PageHeader";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import { ReactComponent as Formlogo} from "../../../images/Form/formlogo.svg";
import ViewFormList from "./ViewFormList";
;


function Form() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<Formlogo   />,
      mainheading: "Form  ",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create form",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/createform",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <ViewFormList/>
    
    </div>
  );
}
export default Form;