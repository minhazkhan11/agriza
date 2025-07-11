import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { Button, Typography } from "@mui/material";
import useStyles from "../../../styles";

export default function BasicTable() {
  const classes = useStyles();
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const [rows, setRows] = useState([
    createData("Banner", "a"),
    createData("About Us", "a"),
    createData("Gallery", "a"),
    createData("All Videos", "a"),
    createData("Our Faculties", "a"),
    createData("Testimonials", "a"),
    createData("Get In Touch", "a"),
  ]);

  const handleDragEnd = (e) => {
    if (!e.destination) return;
    let tempData = Array.from(rows);
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setRows(tempData);
  };
  return (
    <Paper className={` ${classes.mt1_5}`}>
      <Typography
        variant="h5"
        className={`${classes.fontsize4} ${classes.p1} ${classes.fw600}`}
      >
        Teamplate Name
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className={`${classes.bgdarkblue}`}>
            <TableRow>
              <TableCell
                align="center"
                className={` ${classes.textcolorwhite}  ${classes.w5} `}
              >
                Drag
              </TableCell>
              <TableCell
                className={` ${classes.textcolorwhite}`}
                align="center"
              >
                Heading
              </TableCell>
              <TableCell
                className={` ${classes.textcolorwhite}`}
                align="center"
              >
                Content
              </TableCell>
              <TableCell
                className={` ${classes.textcolorwhite}  ${classes.w10}`}
                align="center"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <Droppable droppableId="droppable-1">
            {(provider) => (
              <TableBody ref={provider.innerRef} {...provider.droppableProps}>
                {rows.map((row, index) => (
                  <Draggable
                    key={row.name}
                    draggableId={row.name}
                    index={index}
                  >
                    {(provider) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        {...provider.draggableProps}
                        ref={provider.innerRef}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          {...provider.dragHandleProps}
                        >
                          <DragIndicatorIcon />
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.calories}</TableCell>
                        <TableCell align="center">
                          <Button>Edit</Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provider.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </Paper>
  );
}
