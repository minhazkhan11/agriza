import React, { useState } from "react";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import { Modal, Backdrop } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useNavigate, useParams } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import QAPopup from "./QAPopup";
import ListHeader from "./ListHeader";

function ViewReceivedFeedback({ feedBack }) {
  const classes = useStyles();
  const style = [
    {
      style: "viewtable",
      height: "h49vh",
    },
  ];

  const [responses, setResponses] = useState();
  const { rowId } = useParams();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const handleOpenClose = (Id) => {
    setResponses(Id);
    setOpen(!open);
  };

  const row =
    feedBack?.learners?.map((d, n) => ({
      sno: n + 1,
      id: d.id ? d.id : "N/A",
      student_name: d.full_name ? d.full_name : "N/A",
      status: d.status
        ? d.status === "not_given"
          ? "Not Given"
          : "Given"
        : "N/A",
      question: d.fields ? d.fields : "N/A",
    })) || [];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const columns = [
    {
      field: "sno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 50,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "student_name",
      headerName: "Student Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 150,
      autoPageSize: false,
      renderCell: (cellValues) => {
        return (
          <div
            className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          >
            <Button
              disabled={cellValues.row.status === "Not Given"}
              className={`${
                cellValues.row.status === "Not Given"
                  ? classes.disabledbtn
                  : classes.custombtnblue
              }`}
              onClick={() => {
                handleOpenClose(cellValues.row.question);
              }}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.pagescroll} ${classes.maxh76} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <ListHeader />
        <TableView columns={columns} rows={row} Heading={style} />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleOpenClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <QAPopup
          handleOpenClose={handleOpenClose}
          open={open}
          responses={responses}
        />
      </Modal>
    </>
  );
}
export default ViewReceivedFeedback;
