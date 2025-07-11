// SimpleTabs.js
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CustomTab from "./TabComponent";
import CustomTabPanel from "./TabPanelComponent";
import { a11yProps } from "./Utils";
import useStyles from "../../../../styles";
import EmailSetting from "./EmailSetting/EmailSetting";
import SmsSetting from "./SmsSetting/SmsSetting";
import WhatsappSetting from "./WhatsappSetting/WhatsappSetting";
import Template from "./Template/Template";

export default function SettingsMain({ fetchDataFromAPI }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const items = [
    { id: 1, label: "SMS Setting" },
    { id: 2, label: "WhatsApp Setting" },
    { id: 3, label: "Email Setting" },
    { id: 4, label: "Template" },
  ];
  const items1 = [
    { id: 1, label: <SmsSetting /> },
    { id: 2, label: <WhatsappSetting /> },
    { id: 3, label: <EmailSetting /> },
    { id: 4, label: <Template /> },
  ];

  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
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
