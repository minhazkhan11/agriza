import React from "react";
import PageHeader from "../../PageHeader";

import { ReactComponent as BankIcon } from "../../../images/headericon/bankicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import AddBankForm from "./AddBankForm";

function AddBank({ fetchDataFromAPI }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <BankIcon />,
      mainheading: "Add Bank",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddBankForm fetchDataFromAPI={fetchDataFromAPI} />
    </div>
  );
}
export default AddBank;
