// SimpleTabs.js
import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import CustomTab from "./TabComponent";
import CustomTabPanel from "./TabPanelComponent";
import { a11yProps } from "./Utils";
import useStyles from "../../../../../styles";
import EditBasic from "./EditBasic/EditBasic";
import EditBankDetail from "./EditBankDetail/EditBankDetail";
import EditGstDetail from "./EditGstDetail/GstDetail";
import EditOwnerDetails from "./EditOwnerDetails/EditOwnerDetails";
import EditDocument from "../EditBusinessEntity/EditDocument/EditDocument";
import ChangePassword from "../../../Setting/ChangePassword/ChangePassword";
import { useLocation } from "react-router-dom";

export default function EditBusinessEntityMoreForm() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { state, pathname } = useLocation();
  const editbusinessEntityId = state?.be_information.id;
  const businessEntityconstitutionsName =
    state?.be_information.constitutions_id.name;

  const isMyProfile = pathname === "/myprofile";

  const [businessEntityId, setBusinessEntityId] =
    useState(editbusinessEntityId);

  const [constitutionsName, setconstitutionsName] = useState(
    businessEntityconstitutionsName
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const items = [
    { id: 1, label: "Basic" },
    // { id: 2, label: "Authorised Details" },
    { id: 2, label: "GST Detail" },
    { id: 3, label: "Bank Detail" },
    { id: 4, label: "Document" },
    ...(isMyProfile ? [{ id: 5, label: "Change Password" }] : []),
    // { id: 3, label: "Business Area" },
    // { id: 5, label: "Staff Contact" },
    // { id: 6, label: "Warehouse" },
    // { id: 7, label: "License" },
  ];
  const items1 = [
    {
      id: 1,
      label: (
        <EditBasic
          setValue={setValue}
          setBusinessEntityId={setBusinessEntityId}
          setconstitutionsName={setconstitutionsName}
        />
      ),
    },
    // {
    //   id: 2,
    //   label: (
    //     <EditOwnerDetails
    //       setValue={setValue}
    //       businessEntityId={businessEntityId}
    //     />
    //   ),
    // },
    {
      id: 2,
      label: (
        <EditGstDetail setValue={setValue} businessEntityId={businessEntityId} />
      ),
    },
    {
      id: 3,
      label: (
        <EditBankDetail
          setValue={setValue}
          businessEntityId={businessEntityId}
        />
      ),
    },
    
    {
      id: 4,
      label: (
        <EditDocument
          setValue={setValue}
          businessEntityId={businessEntityId}
          constitutionsName={constitutionsName}
        />
      ),
    },
    ...(isMyProfile
      ? [{ id: 5, label: <ChangePassword setValue={setValue} /> }]
      : []),
    // { id: 3, label: <BusinessArea setValue={setValue} businessEntityId={businessEntityId}/> },

    // { id: 5, label: <StaffContact setValue={setValue} businessEntityId={businessEntityId}/> },
    // { id: 6, label: <Warehouse setValue={setValue} businessEntityId={businessEntityId}/> },
    // { id: 7, label: <License setValue={setValue} businessEntityId={businessEntityId}/> },
  ];

  return (
    <div className={`${classes.pb0} ${classes.pt1}`}>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="none"
            aria-label="simple tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            {items.map((item) => (
              <CustomTab
                className={classes.tab}
                key={item.id}
                label={item.label}
                id={item.id}
                index={item.id - 1}
                onChange={handleChange}
                {...a11yProps(item.id)}
                disabled={!isMyProfile}
              />
            ))}
          </Tabs>
        </AppBar>
        {items1.map((item, index) => (
          <CustomTabPanel
            key={item.id}
            value={value}
            index={index}
            id={item.id}
          >
            {item.label}
          </CustomTabPanel>
        ))}
      </div>
    </div>
  );
}
