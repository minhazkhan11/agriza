import React, { useState, useEffect } from "react";
import SidePannel from "./component/Menu/SidePannel";
import Header from "./component/Menu/header";
import DemoMenuDataBe from "./DemoMenuDataBe";
import ThemeProvider from "./ThemeProvider";
import useStyles from "./styles";
import LayoutData from "./data";
import axios from "axios";
import { decryptData } from "./crypto";
import HomePageRoutes from "./Routes";
import DemoMenuData from "./DemoMenuData";
import { useLocation, useNavigate } from "react-router-dom";
import useShortcut from "./UseShortcut";

function App() {
  const decryptedUserRole = decryptData(sessionStorage.getItem("userRole"));
  const navigate = useNavigate();
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuCollapse, setMenuCollapse] = useState(false);
  const [parsedUserData, setParsedUserData] = useState("");
  const [header, setHeader] = useState([]);
  const [planName, setplanName] = useState("");

  const location = useLocation();
  const [formId, setFormId] = useState("");
  const [formFound, setFormFound] = useState(false);
  useEffect(() => {
    // Parse formId from the URL
    const pathArray = location.pathname.split("/");
    const id = pathArray[pathArray.length - 1];
    setFormId(id);
  }, [location]);

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const decryptedUserName = JSON.stringify(
    decryptData(sessionStorage.getItem("userName"))
  );

  useEffect(() => {
    if (decryptedUserName) {
      setParsedUserData(decryptedUserName.trim().replace(/"/g, ""));
    }
  }, []);

  const [globalProfileImageState, setGlobalProfileImageState] = useState({
    image: "",
    name: "",
  });

  const dynamicPath = window.location.pathname.substring(1);
  const layoutData = LayoutData.find((item) => item.name === dynamicPath);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const decryptedToken = decryptData(sessionStorage.getItem("token"));
    const decryptedUserName = decryptData(sessionStorage.getItem("userName"));
    if (decryptedToken && decryptedUserName) {
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleMenuCollapse = () => {
    setMenuCollapse(!menuCollapse);
  };

  const fetchMainMenuDataFromAPI = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/main_menu`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data?.menu;
        const plan = response.data?.plan_name;

        setHeader(data);
        setplanName(plan);

        sessionStorage.setItem("main_menu", JSON.stringify(data));
        localStorage.setItem("main_menu", JSON.stringify(data));
      } else {
        console.log("data not found");
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    fetchMainMenuDataFromAPI();
  }, [decryptedToken]);

  // useEffect(() => {
  //   // This function will be called whenever right-click happens
  //   const handleRightClick = (event) => {
  //     event.preventDefault();  // This prevents the default right-click menu from showing up
  //     alert("Right-click is disabled.");  // You can also show an alert or do something else here
  //   };

  //   // Attach the event listener to the document (whole page)
  //   document.addEventListener('contextmenu', handleRightClick);

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener('contextmenu', handleRightClick);
  //   };
  // }, []);

  // //Disable Inspect
  // useEffect(() => {
  //   const blockDevTools = (event) => {
  //     // Disable F12 and other DevTools shortcuts
  //     if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73 && event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'C' || event.key === 'J')) ||
  //       (event.ctrlKey && event.key === 'U')) {
  //       event.preventDefault();  // Block F12 or Ctrl+Shift+I
  //       alert('Attempt for opening developer tools detected.');
  //     }
  //   };

  //   // Listen for keypress events
  //   document.addEventListener('keydown', blockDevTools);

  //   return () => {
  //     document.removeEventListener('keydown', blockDevTools);
  //   };
  // }, []);

  useShortcut([
    { keys: "ctrl+b", callback: () => navigate("/vendor-list") },
    { keys: "ctrl+h", callback: () => navigate("/dashboard") },
    { keys: "ctrl+shift+u", callback: () => alert("You pressed Ctrl+Shift+U") },
    { keys: "ctrl+i", callback: () => alert("You pressed Ctrl+i") },
  ]);

  return (
    <React.StrictMode>
      <ThemeProvider>
        {({ darkMode, toggleDarkMode }) => (
          <div className={`${classes.dflex} ${classes.w100}`}>
            {isLoggedIn && (
              <div
                className={`${menuCollapse ? classes.w5 : classes.w18}`}
                // onMouseEnter={() => setMenuCollapse(false)}
                // onMouseLeave={() => setMenuCollapse(true)}
              >
                <SidePannel
                  menuCollapse={menuCollapse}
                  globalProfileImageState={globalProfileImageState}
                  fetchMainMenuDataFromAPI={fetchMainMenuDataFromAPI}
                  header={header}
                  setMenuCollapse={setMenuCollapse}
                />
              </div>
            )}

            <div
              className={
                layoutData
                  ? `${classes.w100}`
                  : `${classes.w100} ${classes.h100vh} ${
                      formFound && classes.m0auto
                    }`
              }
            >
              {isLoggedIn && (
                <div className={classes.header}>
                  <Header
                    handleMenuCollapse={handleMenuCollapse}
                    menuCollapse={menuCollapse}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </div>
              )}
              <HomePageRoutes
                isLoggedIn={isLoggedIn}
                planName={planName}
                // fetchDataFromAPI={fetchDataFromAPI}
                layoutData={layoutData}
                handleLogin={handleLogin}
                formFound={formFound}
                header={header}
              />
            </div>
          </div>
        )}
      </ThemeProvider>
    </React.StrictMode>
  );
}
export default App;
