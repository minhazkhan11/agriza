import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as WhatsappIcon } from "../../../images/Whatsapp/whatsappicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import ViewInnerWhatsappList from "./ViewInnerWhatsappList";
import { useLocation } from "react-router-dom";

function InnerWhatsappList() {
  const { state } = useLocation();
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <WhatsappIcon />,
      mainheading: `${state?.name} Campaign's Whatsapp List`,
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/whatsapp-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewInnerWhatsappList />
    </div>
  );
}
export default InnerWhatsappList;
