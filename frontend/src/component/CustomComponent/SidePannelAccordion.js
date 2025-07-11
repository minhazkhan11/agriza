import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStyles from "../../styles";

export default function UploadButtons({ data }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <Accordion 
    className={`${classes.boxshadow0} ${classes.bgtransparent} ${classes.accordianroot}`}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        className={`${classes.accordianhead} ${classes.py0_5} ${classes.borderradius6px} ${classes.mx0_5} ${classes.textdecorationnone} ${classes.dflex} ${classes.justifycenter} `}
      >
        <ListItemIcon>{data.icon}</ListItemIcon>
        <ListItemText primary={data.name} />
      </AccordionSummary>
      <AccordionDetails className={`${classes.bgwhite}`}>
        <List>
          {data.menu.map((data, index) => (
            <ListItem button key={index}>
              <ListItemIcon>{data.icon}</ListItemIcon>
              <Link
                to={data.to}
                className={`${classes.link}  ${classes.borderradius6px} ${classes.mx0_5} ${classes.textdecorationnone} ${classes.dflex}  `}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <ListItemText className={`${classes.tab1} ${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.opacity1} ${classes.p0_5} ${classes.mhauto}`} primary={data.name} />
              </Link>
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
