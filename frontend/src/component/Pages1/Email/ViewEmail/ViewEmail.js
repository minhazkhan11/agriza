import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import { Box, Button, Tab, Tabs, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import PropTypes from "prop-types";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Inbox from "./Inbox";
import MailContent from "./MailContent";
import ProfileIcon from "../../../images/EmailIcon/inboxprofileicon.png";
import SentMail from "./SentMail";

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

function ViewEmail() {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredMail, setFilteredMail] = React.useState([]);

  const [value, setValue] = React.useState(0);
  const [mailOpen, setMailOpen] = React.useState(false);
  const [mailRead, setMailRead] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setMailOpen(false);
  };
  const [mailValue, setMailValue] = useState("");
  const handleMailOpen = (value) => {
    setMailValue(value);
    setMailOpen(true);
    setMailRead(true);
    console.log("mailValue", value);
  };

  const handleBack = () => {
    setMailOpen(false);
  };
  const tabs = [
    { id: 1, label: "Inbox" },
    { id: 2, label: "Sent Email" },
  ];

  const syncMail = async () => {
    const decryptedToken = decryptData(sessionStorage.getItem("token"));

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/mail/sync`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() => {
    syncMail();
    const intervalId = setInterval(syncMail, 60000);
    return () => clearInterval(intervalId);
  }, []);
  console.log("filteredMail", filteredMail?.mails?.status);
  const fetchInboxData = async () => {
    const decryptedToken = decryptData(sessionStorage.getItem("token"));
    const inboxUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/mail/inbox`;
    const sentMailsUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/mail/sent`;
    try {
      const response = await axios.get(value === 0 ? inboxUrl : sentMailsUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });
      return response?.data;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // In your useEffect, add error handling
  useEffect(() => {
    const fetchMailData = async () => {
      try {
        const data = await fetchInboxData();
        if (data) {
          setFilteredMail(data);
        }
      } catch (error) {
        console.error("Error fetching mail data: ", error);
        // You can also add error handling here, like displaying a message to the user
        toast.error("Failed to fetch mail data. Please try again later.");
      }
    };
    fetchMailData();
  }, [value, filteredMail]);

  const row = filteredMail?.mails?.map((d, n) => ({
    id: d?.id,
    image: ProfileIcon,
    name: d.name ? d.name : "N/A",
    tag: "new",
    from: d.from ? d.from : "N/A",
    title: d.subject ? d.subject : "N/A",
    subtitle: "How to do the work property",
    time: d.date ? d.date.substring(0, 10) : "N/A",
    date: d.created_at ? d.created_at.substring(0, 10) : "N/A",
    message: d.message ? d.message : "N/A",
    read: d?.status,
  }));

  const SearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRows = row
    ?.filter((d) => {
      const isSearchMatch =
        d?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        d?.from?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        d?.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        d?.time?.toLowerCase().includes(searchQuery?.toLowerCase());
      // d?.status

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

  const tabPannel = [
    {
      id: 1,
      label: filteredMail?.mails?.length > 0 && (
        <Inbox handleMailOpen={handleMailOpen} Data={filteredRows} />
      ),
    },
    {
      id: 2,
      label: filteredMail?.mails?.length > 0 && (
        <SentMail handleMailOpen={handleMailOpen} Data={filteredRows} />
      ),
    },
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
          <div>
            <TextField
              type="text"
              variant="outlined"
              onChange={SearchChange}
              value={searchQuery}
              required
              placeholder="Search Email"
            />
          </div>
          <Typography
            className={`${classes.my1} ${classes.fontsize3} ${classes.fw600}`}
          >
            MAILBOX
          </Typography>
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
          {!mailOpen ? (
            tabPannel.map((data, index) => (
              <TabPanel value={value} index={index}>
                {data.label}
              </TabPanel>
            ))
          ) : (
            <div>
              <div
                className={`${classes.bgwhite} ${classes.py1_5} ${classes.boxshadow3} ${classes.borderradius6px}`}
              >
                <Button
                  onClick={handleBack}
                  className={`${classes.fontsize3} ${classes.fw600} ${classes.texttransformcapitalize}`}
                >
                  <ArrowLeftIcon /> {mailValue?.title}
                </Button>
              </div>
              <MailContent value1={mailValue} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default ViewEmail;
