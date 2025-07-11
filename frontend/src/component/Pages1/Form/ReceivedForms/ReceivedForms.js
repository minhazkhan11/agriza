import React from "react";
import { ReactComponent as Formlogo} from "../../../images/Form/formlogo.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import PageHeader from "../../PageHeader";
import ViewReceivedForms from "./ViewReceivedForms";

function ReceivedForms() {
  const classes = useStyles();

  const PageHeading = [
    {
      id: 1,
      pageicon: <Formlogo />,
      mainheading: "List of Received Forms",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/forms",
    },
  ];
  

 

  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={PageHeading} />

      <div className={classes.mt1}>
        <ViewReceivedForms />
      </div>
    </div>
  );
}
export default ReceivedForms;
