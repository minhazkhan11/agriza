import React from "react";
import TableView from "../../../../CustomComponent/TableViewDash";
import useStyles from "../../../../../styles";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

function UpcomingExam({ dashboardData }) {
  const classes = useStyles();

  const style = [
    {
      style: "viewtable",
      height: "h54vh",
    },
  ];

  const navigate = useNavigate();

  function convertDateFormat(originalDate) {
    return new Date(originalDate).toISOString().slice(0, 10).split("-").reverse().join("-");
  }

  const rows =
    dashboardData?.map((d, i) => ({
      id: d.id ? d.id : "N/A",
      srno: i+1,
      exam_name: d.exam_name ? d.exam_name : "N/A",
      course_name: d.course.course_name ? d.course.course_name : "N/A",
      questions: d.question_count ? d.question_count : "N/A",
      duration: d.duration ? d.duration : "N/A",
      total_score: d.total_score ? d.total_score : "N/A",
      start_date: d.start_date ? convertDateFormat(d.start_date) : "N/A",
      active_status: d.active_status ? d.active_status : "N/A",
    })) || [];

  const columns = [
    {
      field: "srno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "exam_name",
      headerName: "Exam Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "course_name",
      headerName: "Course",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "questions",
      headerName: "Question",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "duration",
      headerName: "Duration",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "total_score",
      headerName: "TotalScore",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "start_date",
      headerName: "Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center",
    //   sortable: true,
    //   disableColumnMenu: true,
    //   width: 150,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => {
    //     const isActive = cellValues.row.active_status === "active";
    //     return (
    //       <div
    //         className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
    //       >
    //         <IconButton
    //           className={`${classes.w15}`}
    //           aria-describedby={id}
    //           onClick={(event) => {
    //             handleClick(event, cellValues.row.id);
    //           }}
    //         >
    //           <ArrowLeftIcon fontSize="small" />
    //         </IconButton>
    //         <Typography
    //           className={`${classes.dflex} ${classes.alignitemscenter}`}
    //           variant="h6"
    //         >
    //           {/* {isActive ? <ActiveIcon /> : <InactiveIcon fontSize="small" />} */}
    //           <ActiveIcon />
    //           {cellValues.row.active_status}
    //         </Typography>
    //         <Popover
    //           id={id}
    //           open={popoveropen && selectedRowId === cellValues.row.id}
    //           anchorEl={anchorEl}
    //           onClose={handleClose}
    //           anchorOrigin={{
    //             vertical: "center",
    //             horizontal: "left",
    //           }}
    //           transformOrigin={{
    //             vertical: "center",
    //             horizontal: "right",
    //           }}
    //         >
    //           <Paper>
    //             <IconButton
    //               // onClick={(event) => {
    //               //   handleStatus(
    //               //     cellValues.row.id,
    //               //     cellValues.row.active_status
    //               //   );
    //               // }}
    //             >
    //               <LightTooltip title="Disable">
    //                 <VisibilityOffOutlinedIcon />
    //               </LightTooltip>
    //             </IconButton>
    //             <IconButton
    //               // onClick={() => {
    //               //   handleButtonClick("editquizz", cellValues.row.id);
    //               // }}
    //             >
    //               <LightTooltip title="Edit">
    //                 <SettingsIcon />
    //               </LightTooltip>
    //             </IconButton>
    //             <IconButton>
    //               <LightTooltip title="Delete">
    //                 <DeleteIcon
    //                   // onClick={() => deleteDataOfRow(cellValues.row.id)}
    //                 />
    //               </LightTooltip>
    //             </IconButton>
    //           </Paper>
    //         </Popover>
    //       </div>
    //     );
    //   },
    // },
  ];

  const row = [
    {
      id: 1,
      subject: "History of united nation",
      examname: "SBI CLERK 2024 | Speed Maths 25 Question",
      assigned: "Amar Sir",
      students: "28",
      active_status: "Taken",
    },
    {
      id: 2,
      subject: "History of united nation",
      examname: "SBI CLERK 2024 | Speed Maths 25 Question",
      assigned: "Amar Sir",
      students: "28",
      active_status: "Taken",
    },
    {
      id: 3,
      subject: "History of united nation",
      examname: "SBI CLERK 2024 | Speed Maths 25 Question",
      assigned: "Amar Sir",
      students: "28",
      active_status: "Taken",
    },
  ];
  return (
    <div
      className={`${classes.mt1_5} ${classes.bgwhite} ${classes.p0_5}  ${classes.boxshadow1} ${classes.borderradius6px}`}
    >
      <div
        className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
      >
        <Typography
          className={`${classes.my1} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fw700}`}
        >
          Upcoming Exam
        </Typography>
        <Button
          className={`${classes.viewallbtn}`}
          onClick={() => navigate(`/admin/exam`)}
        >
          View All <KeyboardArrowRightIcon style={{ fontSize: "medium" }} />
        </Button>
      </div>
      <TableView columns={columns} rows={rows} Heading={style} />
    </div>
  );
}

export default UpcomingExam;
