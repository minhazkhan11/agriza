// SimpleTabs.js
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import CustomTab from "./TabComponent";
import CustomTabPanel from "./TabPanelComponent";
import { a11yProps } from "./Utils";
import AddSingle from "./AddSingle";

import QuestionList from "./QuestionList";
import ImportFromQuestionBank from "./ImportFromQuestionBank";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "1rem",
    flexGrow: 1,
    "& .MuiAppBar-colorPrimary": {
      color: "#fff",
      backgroundColor: "#484848",
    },
    "& .MuiTab-textColorInherit.Mui-selected": {
      color: "#252525",
      backgroundColor: "#FFFFFF",
    },
  },
  tab: {
    margin: "0.5rem",
    padding: "0.7rem",
    minHeight: "auto",
    borderRadius: "6px",
    opacity: 1,
    "&:hover": {
      color: "#252525",
      backgroundColor: "#FFFFFF",
    },
  },
  tabpannel: {},
}));

export default function SimpleTabs({questionsCount}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

   // Function to change tab
   const changeTab = (tabIndex) => {
    setValue(tabIndex);
  };


  const items = [
    { id: 1, label: "Questions List" },
    { id: 2, label: "Add Single Question" },
    // { id: 3, label: "IMPORT FROM QUESTION BANK" },
  ];
  const items1 = [
    { id: 1, label: <QuestionList /> },
    { id: 2, label: <AddSingle /> },
    // { id: 3, label: <ImportFromQuestionBank /> },
  ];

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="none"
          aria-label="simple tabs example"
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
          {index === 1 ? <AddSingle changeTab={changeTab} /> : item.label}
        </CustomTabPanel>
      ))}
    </div>
  );
}