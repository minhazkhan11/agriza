import React from "react";
import { ReactComponent as Formlogo } from "../../../images/Form/formlogo.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import PageHeader from "../../PageHeader";
import InputForm from "./EditInputForm";

function EditForm() {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <Formlogo />,
      mainheading: "Edit Form",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path:"/admin/forms",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <InputForm />
    </div>
  );
}
export default EditForm;
