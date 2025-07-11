import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginTop: "1rem",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  w46: {
    width: "46%",
  },
  w8: {
    width: "8%",
  },
  w100: {
    width: "100% !important",
  },

  tablecheckbox: {
    "& .MuiCheckbox-colorPrimary.Mui-checked": {
      color: "#FD6E38 !important",
    },
    "& .MuiIconButton-colorPrimary": {
      color: "#FD6E38 !important",
    },
  },

  list: {
    width: 200,
    height: "50vh !important",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  btncontainer: {
    display: "flex  !important",
    justifyContent: "flex-end  !important",
    marginTop: "0.5rem !important",
  },
  custombtnblue: {
    background: "#FD6E38 !important",
    color: "white !important",
    fontSize: "1rem !important",
    fontFamily: "Outfit !important",
    fontWeight: "600 !important",
    textTransform: "capitalize !important",
    padding: "0.4rem 2rem !important",
    "&:hover": {
      background: "#FD6E38 !important",
      color: "white !important",
    },
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function AssignItem({ businessEntityId }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setLeft(response.data.item_variants);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = () => {
    if (right.length === 0) {
      toast.warn("Please select at least one item variant.");
      return;
    }

    const variantIds = right.map((item) => item.id);

    const data = {
      assigned: {
        vendor_be_id: businessEntityId,
        item_variants_id: variantIds,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/assigned_item_variant_to_vendor/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Item Assign Successfully");
        setTimeout(() => {
          navigate("/vendor-list");
        }, 1000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card className={classes.w100}>
      <CardHeader
        className={`${classes.cardHeader} ${classes.tablecheckbox}`}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
                       color="primary"
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        className={`${classes.list} ${classes.w100}`}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon className={`${classes.tablecheckbox}`}>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                  color="primary"
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.variant_name} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <>
      <ToastContainer />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid className={classes.w46} item>
          {customList("Choices", left)}
        </Grid>
        <Grid className={classes.w8} item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid className={classes.w46} item>
          {customList("Chosen", right)}
        </Grid>
      </Grid>
      <div className={`${classes.btncontainer}`}>
        <Button
          className={`${classes.custombtnblue}`}
          onClick={handleFormSubmit}
        >
          Submit
        </Button>
      </div>
    </>
  );
}
