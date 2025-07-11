import React from "react";
import useStyles from "../../../../styles";
import { Box, Tab, Tabs } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CreateSmsTemplate from "./CreateSmsTemplate";
import CreateEmailTemplate from "./CreateEmailTemplate";
import CreateWhatsappTemplate from "./CreateWhatsappTemplate";
import ViewSmsTemplate from "./ViewSmsTemplate";
import ViewEmailTemplate from "./ViewEmailTemplate";
import ViewWhatsappTemplate from "./ViewWhatsappTemplate";
import EditSmsTemplate from "./EditSmsTemplate";
import EditEmailTemplate from "./EditEmailTemplate";
import EditWhatsappTemplate from "./EditWhatsappTemplate";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function Template() {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const [rowId, setRowId] = React.useState(false);

  const handleChange = (event, newValue, id) => {
    setValue(newValue);
    setRowId(id);
  };

  
  const tabs = [
    { id: 1, label: "SMS" },
    { id: 2, label: "Email" },
    { id: 3, label: "Whatsapp" },
  ];
  const tabPannel = [
    { id: 1, label: <ViewSmsTemplate handleChange={handleChange} /> },
    { id: 2, label: <ViewEmailTemplate handleChange={handleChange} /> },
    { id: 3, label: <ViewWhatsappTemplate handleChange={handleChange} /> },
    { id: 4, label: <CreateSmsTemplate handleChange={handleChange} /> },
    { id: 5, label: <CreateEmailTemplate handleChange={handleChange} /> },
    { id: 6, label: <CreateWhatsappTemplate handleChange={handleChange} /> },
    { id: 7, label: <EditSmsTemplate rowId={rowId} handleChange={handleChange} /> },
    { id: 8, label: <EditEmailTemplate rowId={rowId} handleChange={handleChange} /> },
    { id: 9, label: <EditWhatsappTemplate rowId={rowId} handleChange={handleChange} /> },
  ];

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.dflex} ${classes.maxh76} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.mt1}`}
      >
        <div
          className={`${classes.tab2} ${classes.bgwhite} ${classes.pagescroll} ${classes.px1} ${classes.py1} ${classes.w20} ${classes.textalignleft} ${classes.texttransformcapitalize}`}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            scrollButtons="off"
            indicatorColor="none"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={``}
          >
            {tabs.map((item, index) => (
              <Tab label={item.label} {...a11yProps({ index })} />
            ))}
          </Tabs>
        </div>

        <div
          className={`${classes.bgwhite} ${classes.w78} ${classes.h71vh} ${classes.boxshadow3} ${classes.borderradius6px}`}
        >
          {tabPannel.map((data, index) => (
            <TabPanel value={value} index={index}>
              {data.label}
            </TabPanel>
          ))}
        </div>
      </div>
    </>
  );
}
export default Template;
