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
import { ReactComponent as Dashboard } from "../images/mainheadingicon/dashboard.svg";
import { ReactComponent as Master } from "../images/mainheadingicon/master.svg";

import { ReactComponent as Ellipse } from "../images/mainheadingicon/ellipse.svg";
import { Link } from "react-router-dom";
import useStyles from "../../styles";
import { useLocation } from "react-router-dom";
import { Popper } from "@material-ui/core";
import { ReactComponent as Learner } from "../images/mainheadingicon/learner.svg";
import { ReactComponent as Teacher } from "../images/mainheadingicon/teacher.svg";
import { ReactComponent as Exam } from "../images/mainheadingicon/exam.svg";
import { ReactComponent as DoubtForum } from "../images/mainheadingicon/doubtforum.svg";
import { ReactComponent as Marketing } from "../images/mainheadingicon/marketing.svg";
import { ReactComponent as Settings } from "../images/mainheadingicon/setting.svg";
import { ReactComponent as ReportIcon } from "../images/mainheadingicon/reports.svg";
import { ReactComponent as Content } from "../images/mainheadingicon/content.svg";
import { ReactComponent as ContentPublication } from "../images/mainheadingicon/contentpublication.svg";
import { ReactComponent as KaroManage } from "../images/mainheadingicon/karomanage.svg";
import { ReactComponent as CoachingIcon } from "../images/mainheadingicon/coaching.svg";
import { ReactComponent as TimeTableIcon } from "../images/mainheadingicon/timetable.svg";
import { ReactComponent as FeedbackIcon } from "../images/mainheadingicon/feedback.svg";
import { ReactComponent as UpgradeIcon } from "../images/mainheadingicon/upgrade.svg";
import { ReactComponent as BookIcon } from "../images/mainheadingicon/book.svg";
import { ReactComponent as WalletIcon } from "../images/mainheadingicon/wallet.svg";
import { ReactComponent as SettlementIcon } from "../images/mainheadingicon/settlementicon.svg";
import { ReactComponent as TestSeries } from "../images/mainheadingicon/testseries.svg";
import { ReactComponent as LiveClasses } from "../images/mainheadingicon/liveclasses.svg";
import { ReactComponent as WebDesign } from "../images/mainheadingicon/webdesign.svg";
import { ReactComponent as AppDesign } from "../images/mainheadingicon/appdesign.svg";

export default function NestedList({ MainHeading, menuCollapse }) {
  const classes = useStyles();
  const location = useLocation();
  const { pathname } = location;

  // Create a state to keep track of the currently open dropdown index
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const handleToggle = (index) => {
    // Toggle the dropdown at the specified index
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

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
    Learner: Learner,
    Teacher: Teacher,
    Exam: Exam,
    DoubtForum: DoubtForum,
    Marketing: Marketing,
    Settings: Settings,
    ReportIcon: ReportIcon,
    Content: Content,
    ContentPublication: ContentPublication,
    KaroManage: KaroManage,
    CoachingIcon: CoachingIcon,
    TimeTable: TimeTableIcon,
    FeedbackIcon: FeedbackIcon,
    UpgradeIcon: UpgradeIcon,
    BookIcon: BookIcon,
    WalletIcon: WalletIcon,
    SettlementIcon: SettlementIcon,
    TestSeries: TestSeries,
    LiveClasses: LiveClasses,
    WebDesign: WebDesign,
    AppDesign: AppDesign,
  };
  

  return (
    <>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        {MainHeading.map((data, index) => {
          const IconComponent = iconComponents[data.icon];
          if (data.type === "dropdown") {
            return (
              <div key={index} onMouseLeave={handleMenuLeave} >
                <ListItem
                  className={`${classes.borderradius6px} ${classes.pl0_5} ${classes.mb0_5}  ${
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
                  {menuCollapse &&
                    (hoveredMenu === data.name ? (
                      <ChevronLeftIcon />
                    ) : (
                      <ChevronRightIcon />
                    ))}
                </ListItem>
                {!menuCollapse && (
                  <Collapse
                    in={openDropdownIndex === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {data.menu.map((list, subIndex) => (
                        <Link
                          key={subIndex}
                          className={` ${classes.textdecorationnone}`}
                          to={list.validity ? list?.path : "/admin/upgrade"}
                        >
                          <ListItem
                            className={`${classes.borderradius6px} ${
                              classes.textcolorblue
                            } ${classes.textdecorationnone} ${classes.link2} ${
                              classes.textcolorblue
                            }  ${
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
                to={data.validity ? data?.path : "/admin/upgrade"}
                // to={data.path}
                onClick={() => handleToggle(index)}
              >
                <ListItem
                  className={`${classes.borderradius6px} ${classes.mb0_5}  ${classes.p0_5} ${
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
