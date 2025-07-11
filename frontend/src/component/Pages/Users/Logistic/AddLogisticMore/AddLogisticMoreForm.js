// SimpleTabs.js
import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import CustomTab from "./TabComponent";
import CustomTabPanel from "./TabPanelComponent";
import { a11yProps } from "./Utils";
import useStyles from "../../../../../styles";
import Basic from "./Basic/Basic";
import BankDetail from "./BankDetail/BankDetail";
import BusinessArea from "./BusinessArea/BusinessArea";
import OwnerDetails from "./OwnerDetails/OwnerDetails";
import StaffContact from "./StaffContact/StaffContact";
import Warehouse from "./Warehouse/Warehouse";
import License from "./License/License";
import Document from "./Document/Document";
import { useLocation } from "react-router-dom";

export default function AddBusinessEntityMoreForm() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const [businessEntityId, setBusinessEntityId] = useState("");
    const [constitutionsName, setconstitutionsName] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const items = [
    { id: 1, label: "Basic" },
    { id: 2, label: "Authorised Details" },
    { id: 3, label: "Bank Detail" },
    { id: 4, label: "Document" },
    // { id: 3, label: "Business Area" },
    // { id: 5, label: "Staff Contact" },
    // { id: 6, label: "Warehouse" },
    // { id: 7, label: "License" },
  ];
  const items1 = [
    {
      id: 1,
      label: (
        <Basic setValue={setValue} setBusinessEntityId={setBusinessEntityId} setconstitutionsName={setconstitutionsName}/>
      ),
    },
    {
      id: 2,
      label: (
        <OwnerDetails setValue={setValue} businessEntityId={businessEntityId} />
      ),
    },
    {
      id: 3,
      label: (
        <BankDetail setValue={setValue} businessEntityId={businessEntityId} />
      ),
    },
    {
      id: 4,
      label: (
        <Document setValue={setValue} businessEntityId={businessEntityId} constitutionsName={constitutionsName}/>
      ),
    },
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
                disabled
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
