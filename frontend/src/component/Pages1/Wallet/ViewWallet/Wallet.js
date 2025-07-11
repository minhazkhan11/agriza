import React from "react";
import useStyles from "../../../../styles";

import PageHeader from "../../PageHeader";
import { ReactComponent as WalletIcon } from "../../../images/mainheadingicon/wallet.svg";
import ViewWallet from "./ViewWallet";


function Wallet() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<WalletIcon />,
      mainheading: "Wallet",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <ViewWallet/>
  
    
    </div>
  );
}
export default Wallet;