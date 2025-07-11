import React, { useEffect, useState } from "react";
import PageHeader from "../../../PageHeader";
import ViewItemVariants from "../ViewItemVariants/ViewItemVariants";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";
import AddPriceList from "./AddPriceList";
import { Backdrop, Modal } from "@material-ui/core";
import PriceUpdate from "./PriceUpdate";
import axios from "axios";
import { decryptData } from "../../../../../crypto";

function ItemVariants() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [open, setOpen] = useState();
  const [openPrice, setOpenPrice] = useState();
  const [rowId, setRowId] = useState();
  const [attributes, setAttributes] = useState([]);

  const handlePopUp = () => {
    setOpen(!open);
  };

  const handlePricePopUp = () => {
    setOpenPrice(!openPrice);
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
        setAttributes(response.data.item_variants);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Item Variants",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Item Variants",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-variant",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewItemVariants
        handlePopUp={handlePopUp}
        handlePricePopUp={handlePricePopUp}
        setRowId={setRowId}
        fetchData={fetchData}
        setAttributes={setAttributes}
        attributes={attributes}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={`${classes.modal}`}
        open={open}
        onClose={handlePopUp}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <AddPriceList handlePopUp={handlePopUp} rowId={rowId} />
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={`${classes.modal}`}
        open={openPrice}
        onClose={handlePricePopUp}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <PriceUpdate handlePricePopUp={handlePricePopUp} rowId={rowId}   fetchData={fetchData}/>
      </Modal>
    </div>
  );
}
export default ItemVariants;
