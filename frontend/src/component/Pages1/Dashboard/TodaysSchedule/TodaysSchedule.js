import React from "react";
import TableView from "../../../CustomComponent/TableViewDash";
import useStyles from "../../../../styles";
import { Button } from "@material-ui/core";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";

function TodaysSchedule({ dashboardData }) {
  const classes = useStyles();
  const navigate = useNavigate();

  const style = [
    {
      style: "viewtable",
      height: "h54vh",
    },
  ];

  const rows =
    dashboardData?.map((d, index) => ({
      id: d.id ? d.id : "N/A",
      srno: index + 1, // Assuming you want to start serial numbers from 1
      start_time: d?.start_time ? d?.start_time : "N/A",
      end_time: d?.end_time ? d?.end_time : "N/A",
      date: d?.select_date ? d?.select_date : "N/A",
      teacher: d.teacher_name ? d.teacher_name : "N/A",
      batch: d.timetable?.batch?.batch_name ? d.timetable?.batch?.batch_name : "N/A",
      type: d.type ? d.type : "N/A",
      title: d.tittle ? d.tittle : "N/A",
      status: d.status ? d.status : "N/A",
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
      field: "title",
      headerName: "Title",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "batch",
      headerName: "Batch",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "teacher",
      headerName: "Teacher",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "start_time",
      headerName: "Start Time",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => {
        const [hours, minutes] = cellValues?.value?.split(":");

        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        const formattedTime = date.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return <div>{formattedTime}</div>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
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
          Today’s Schedule
        </Typography>
        <Button
          className={`${classes.viewallbtn}`}
          onClick={() => navigate(`/admin/timetable`)}
        >
          View All <KeyboardArrowRightIcon style={{ fontSize: "medium" }} />
        </Button>
      </div>
      <TableView columns={columns} rows={rows} Heading={style} />
    </div>
  );
}

export default TodaysSchedule;
