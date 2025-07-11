import React, { useState } from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as TestSeriesIcon } from "../../../images/TestSeriesIcon/testseriesicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewTestSeries from "./ViewTestSeries";
import PublishedIcon from "@material-ui/icons/Publish";

function TestSeries() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpenClose = (data) => {
    setOpen(!open);
  };

  const Heading = [
    {
      id: 1,
      pageicon: <TestSeriesIcon />,
      mainheading: "Test Series",
      addbtntext: "Add",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/admin/addtestseries",
      publishbtn: "yes",
      publishIcon: <PublishedIcon className={`${classes.mr1}`} />,
      publishtext: "Publish",
      publishbtnstyle: "bluebtn",
    },
  ];

  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} handleOpenClose={handleOpenClose} />
      <ViewTestSeries open={open} handleOpenClose={handleOpenClose} />
    </div>
  );
}
export default TestSeries;
