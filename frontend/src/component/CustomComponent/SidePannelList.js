import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { ReactComponent as Ellipse } from "../images/mainheadingicon/ellipse.svg";
import { ReactComponent as LeafIcon } from "../images/mainheadingicon/leaflist.svg";
import { Link } from "react-router-dom";
import useStyles from "../../styles";
import { useLocation } from "react-router-dom";
import { InputAdornment, Popper, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { ReactComponent as Dashboard } from "../images/mainheadingicon/Dashboard.svg";
import { ReactComponent as Master } from "../images/mainheadingicon/Master.svg";
import { ReactComponent as Users } from "../images/mainheadingicon/Users.svg";
import { ReactComponent as Enquiry } from "../images/mainheadingicon/Enquiry.svg";
import { ReactComponent as Customers } from "../images/mainheadingicon/Customers.svg";
import { ReactComponent as Billing } from "../images/mainheadingicon/Billing.svg";
import { ReactComponent as Comunity } from "../images/mainheadingicon/Comunity.svg";
import { ReactComponent as Payments } from "../images/mainheadingicon/Payments.svg";
import { ReactComponent as Marketing } from "../images/mainheadingicon/Marketing.svg";
import { ReactComponent as Settings } from "../images/mainheadingicon/Settings.svg";
import { ReactComponent as Staff } from "../images/mainheadingicon/Staff.svg";
import { ReactComponent as Reports } from "../images/mainheadingicon/Reports.svg";
import { ReactComponent as Products } from "../images/mainheadingicon/Products.svg";
import { ReactComponent as Lead } from "../images/mainheadingicon/Lead.svg";
import { ReactComponent as Orders } from "../images/mainheadingicon/Orders.svg";
import { ReactComponent as Dispatched } from "../images/mainheadingicon/Dispatched.svg";
import { ReactComponent as Discounts } from "../images/mainheadingicon/Discounts.svg";
import { ReactComponent as Upgrade } from "../images/mainheadingicon/Upgrade.svg";
import { ReactComponent as Vendor } from "../images/mainheadingicon/Vendor.svg";
import { ReactComponent as Items } from "../images/mainheadingicon/itemprice.svg";
import { ReactComponent as Authorizations } from "../images/mainheadingicon/authorization.svg";
import { ReactComponent as OformIssue } from "../images/mainheadingicon/Oformissue.svg";
import { ReactComponent as Activity } from "../images/mainheadingicon/activity.svg";
import { decryptData } from "../../crypto";

export default function NestedList({ MainHeading, menuCollapse }) {
  const classes = useStyles();
  const location = useLocation();
  const { pathname } = location;

  const [searchTerm, setSearchTerm] = useState("");

  // Create a state to keep track of the currently open dropdown index
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [openSubDropdownIndex, setOpenSubDropdownIndex] = useState(null);
  const decryptedUserRole = decryptData(sessionStorage.getItem("userRole"));

  const handleToggle = (index) => {
    // Toggle the dropdown at the specified index
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
    // setOpenDropdownIndex(null)   // Close any open sub-dropdowns when main dropdown is null
  };

  const handleSubToggle = (subIndex) => {
    setOpenSubDropdownIndex((prevSubIndex) =>
      prevSubIndex === subIndex ? null : subIndex
    );
  };

  const filterMenu = (menu) => {
    return menu
      .flatMap((item) => {
        if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return item; // Keep item if it matches the search directly
        } else if (item.menu) {
          return filterMenu(item.menu); // Return only matching submenu items
        } else if (item.child_menu) {
          return filterMenu(item.child_menu); // Return only matching child menu items
        }
        return []; // Remove items that don't match
      })
      .filter(Boolean); // Remove null or empty results
  };

  const filteredMenu = filterMenu(MainHeading);

  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuEnter = (e, menuNumber) => {
    setHoveredMenu(menuNumber);
    setAnchorEl(e.currentTarget);
  };

  const handleMenuLeave = () => {
    setHoveredMenu(null);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const iconComponents = {
    Dashboard: Dashboard,
    Master: Master,
    Items: Items,
    Authorizations: Authorizations,
    Products: Products,
    Users: Users,
    Enquiry: Enquiry,
    Customers: Customers,
    OformIssue: OformIssue,
    Billing: Billing,
    Payments: Payments,
    Comunity: Comunity,
    Marketing: Marketing,
    Settings: Settings,
    Staff: Staff,
    Reports: Reports,
    Lead: Lead,
    Orders: Orders,
    Dispatched: Dispatched,
    Discounts: Discounts,
    Upgrade: Upgrade,
    Vendor: Vendor,
    Activity: Activity,
  };

  return (
    <>
      <TextField
        className={`${classes.textcolorformlabel} ${classes.fontsize3} ${classes.inputborder} ${classes.inputpadding} ${classes.mt0_5}`}
        style={{
          width: "100%",
          padding: "0 !important",
        }}
        type="text"
        variant="outlined"
        required
        placeholder="Search"
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        {decryptedUserRole === "user" && (
          <Link
            className={` ${classes.textdecorationnone}`}
            to="/dashboard"
            // to={data.path}
          >
            <ListItem
              className={`${classes.borderradius6px} ${classes.p0_5} ${
                classes.link
              } ${classes.textcolorblue} ${classes.textcolorblue}  ${
                pathname === "/dashboard" ? classes.activedropdown : classes.abc
              }`}
              button
            >
              <ListItemIcon
                className={`${classes.minwidth30px} ${
                  { menuCollapse } && classes.collapse_icon_width
                }`}
              >
                {/* {data.icon} */}
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                className={menuCollapse && classes.dnone}
              />
            </ListItem>
          </Link>
        )}

        {filteredMenu.map((data, index) => {
          const IconComponent = iconComponents[data.icon];
          if (data.type === "dropdown") {
            return (
              <div key={index} onMouseLeave={handleMenuLeave}>
                <ListItem
                  className={`${classes.borderradius6px} ${classes.pl0_5} ${
                    classes.link
                  } ${classes.textcolorblue} ${
                    openDropdownIndex === index
                      ? classes.activedropdown
                      : classes.rootwidth
                  }`}
                  button
                  onClick={() => handleToggle(index)}
                  onMouseEnter={(e) => handleMenuEnter(e, data.name)}
                  aria-describedby={id}
                >
                  <ListItemIcon
                    className={`${classes.minwidth30px} ${
                      menuCollapse && classes.collapse_icon_width
                    }`}
                  >
                    {IconComponent && <IconComponent />}
                  </ListItemIcon>
                  <ListItemText
                    primary={data.name}
                    className={menuCollapse && classes.dnone}
                  />
                  {!menuCollapse &&
                    (openDropdownIndex === index ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                </ListItem>
                {!menuCollapse && (
                  <Collapse
                    in={openDropdownIndex === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {data?.menu?.map((list, subIndex) => {
                        if (list.type === "dropdown") {
                          return (
                            <div className={`${classes.mx0_5}`} key={subIndex}>
                              <ListItem
                                className={`${classes.borderradius6px} ${
                                  classes.pl0_5
                                } ${classes.sublink} ${classes.textcolorblue} ${
                                  openSubDropdownIndex === subIndex
                                    ? classes.activesubdropdown
                                    : classes.rootwidth
                                }`}
                                // className={`${classes.borderradius6px} ${
                                //   classes.textcolorblue
                                // } ${classes.textdecorationnone} ${
                                //   classes.link2
                                // } ${classes.textcolorblue}  ${
                                //   pathname === list.path
                                //     ? classes.activelink
                                //     : classes.abc
                                // }`}
                                button
                                onClick={() => handleSubToggle(subIndex)}
                              >
                                <ListItemIcon className={classes.minwidth20px}>
                                  <LeafIcon />
                                </ListItemIcon>
                                <ListItemText primary={list.name} />
                                {openSubDropdownIndex === subIndex ? (
                                  <ExpandLess />
                                ) : (
                                  <ExpandMore />
                                )}
                              </ListItem>

                              <Collapse
                                in={openSubDropdownIndex === subIndex}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding>
                                  {list.child_menu.map(
                                    (subList, innerIndex) => (
                                      <Link
                                        key={innerIndex}
                                        className={classes.textdecorationnone}
                                        to={subList?.path}
                                      >
                                        <ListItem
                                          className={`${
                                            classes.borderradius6px
                                          } ${classes.textcolorblue} ${
                                            classes.textdecorationnone
                                          } ${classes.link2} ${
                                            classes.textcolorblue
                                          }  ${
                                            pathname === subList.path
                                              ? classes.activelink
                                              : classes.abc
                                          }`}
                                          button
                                        >
                                          <ListItemIcon
                                            className={classes.minwidth20px}
                                          >
                                            <Ellipse />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={subList.name}
                                          />
                                        </ListItem>
                                      </Link>
                                    )
                                  )}
                                </List>
                              </Collapse>
                            </div>
                          );
                        } else {
                          return (
                            <div className={`${classes.mx0_5}`} key={subIndex}>
                              <Link
                                key={subIndex}
                                className={classes.textdecorationnone}
                                to={list?.path}
                                onClick={() => handleSubToggle(subIndex)}
                              >
                                <ListItem
                                  className={`${classes.borderradius6px} ${
                                    classes.pl0_5
                                  } ${classes.sublink} ${
                                    classes.textcolorblue
                                  } ${
                                    pathname === list.path
                                      ? classes.activesubdropdown
                                      : classes.rootwidth
                                  }`}
                                  button
                                >
                                  <ListItemIcon
                                    className={classes.minwidth20px}
                                  >
                                    <LeafIcon />
                                  </ListItemIcon>
                                  <ListItemText primary={list.name} />
                                </ListItem>
                              </Link>
                            </div>
                          );
                        }
                      })}
                    </List>
                  </Collapse>
                )}
                {menuCollapse && (
                  <Popper
                    id={id}
                    open={hoveredMenu === data.name && open}
                    anchorEl={anchorEl}
                    className={classes.sidepanelpopup}
                    onMouseLeave={handleMenuLeave}
                  >
                    {hoveredMenu && (
                      <List component="div" disablePadding>
                        {data.menu.map((list, subIndex) => (
                          <Link
                            key={subIndex}
                            className={` ${classes.textdecorationnone}`}
                            to={list?.path}
                            onClick={handleMenuLeave}
                          >
                            <ListItem
                              key={subIndex}
                              className={`${classes.borderradius6px} ${
                                classes.textcolorblue
                              } ${classes.textdecorationnone} ${
                                classes.link2
                              } ${classes.textcolorblue}  ${
                                pathname === list.path
                                  ? classes.activelink
                                  : classes.abc
                              }`}
                              button
                            >
                              <ListItemIcon className={classes.minwidth20px}>
                                <Ellipse />
                              </ListItemIcon>
                              <ListItemText primary={list.name} />
                            </ListItem>
                          </Link>
                        ))}
                      </List>
                    )}
                  </Popper>
                )}
              </div>
            );
          } else {
            return (
              <Link
                key={index}
                className={` ${classes.textdecorationnone}`}
                to={data?.path}
                // to={data.path}
                onClick={() => handleToggle(index)}
              >
                <ListItem
                  className={`${classes.borderradius6px} ${classes.p0_5} ${
                    classes.link
                  } ${classes.textcolorblue} ${classes.textcolorblue}  ${
                    pathname === data.path
                      ? classes.activedropdown
                      : classes.abc
                  }`}
                  button
                >
                  <ListItemIcon
                    className={`${classes.minwidth30px} ${
                      menuCollapse && classes.collapse_icon_width
                    }`}
                  >
                    {/* {data.icon} */}
                    {IconComponent && <IconComponent />}
                  </ListItemIcon>
                  <ListItemText
                    primary={data.name}
                    className={menuCollapse && classes.dnone}
                  />
                </ListItem>
              </Link>
            );
          }
        })}
      </List>
    </>
  );
}
