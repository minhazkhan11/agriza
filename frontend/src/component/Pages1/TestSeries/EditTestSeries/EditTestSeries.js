import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as TestSeriesIcon } from "../../../images/TestSeriesIcon/testseriesicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import EditTestSeriesForm from "./EditTestSeriesForm";

function EditTestSeries() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <TestSeriesIcon />,
      mainheading: "Edit Test Series",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/testseries",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <EditTestSeriesForm />
    </div>
  );
}
export default EditTestSeries;
