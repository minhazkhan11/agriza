import React from "react";
import PageHeader from "../PageHeader";
// import AddTeacherForm from "./AddTeacherForm";
import { ReactComponent as TeachersIcon } from "../../images/teachersimage/teachersicon.svg";
import { ReactComponent as BackIcon } from "../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../styles";
import MyProfileForm from "./MyProfileForm";

function MyProfile({ fetchDataFromAPI }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <TeachersIcon />,
      mainheading: "My Profile",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <MyProfileForm fetchDataFromAPI={fetchDataFromAPI} />
    </div>
  );
}
export default MyProfile;
