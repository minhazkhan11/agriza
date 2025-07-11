import React, { useState, Fragment } from "react";
import uuid from "react-uuid";
//Material UI Components
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

//Icons
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

//Form Elements
import { formEl } from "../constants";

const CheckboxInput = ({
  data,
  item,
  handleValue,
  deleteEl,
  handleRequired,
  handleElType,
  addOption,
  handleOptionValues,
  deleteOption,
  duplicateElement,
}) => {
  const [editorHtml, setEditorHtml] = useState("");

  const handleChange = (html) => {
    setEditorHtml(html);
    // Invoke the callback to pass the updated content to the parent component
    handleValue(item.id, html); // Assuming handleValue updates the data in FormBuilder
  };

  //Create new option
  const createNewOption = (id) => {
    const data = {
      id: uuid(),
      value: "",
    };
    addOption(id, data);
  };

  return (
    <Fragment>
      <Paper elevation={1}>
        {/* <Box sx={{ textAlign: "center" }}>
          <DragIndicatorIcon
            sx={{ transform: "rotate(-90deg)", cursor: "all-scroll" }}
          />
        </Box> */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={9}>
              {/* <TextField
                defaultValue={item.value}
                variant="outlined"
                onBlur={(e) => handleValue(item.id, e)}
                fullWidth
                required={item.required}
                placeholder="Checkbox Label"
                sx={{ mb: 2 }}
              /> */}
              <ReactQuill
                value={editorHtml}
                onChange={handleChange}
                onBlur={(e) => handleValue(item.id, e)}
                placeholder="Checkbox Input Label"
                style={{
                  marginBottom: "20px",
                }}
              />
              {item.options &&
                item.options.length > 0 &&
                item.options.map((opt, key) => (
                  <Box sx={{ display: "flex" }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      placeholder={`Checkbox Option ${key + 1}`}
                      defaultValue={opt?.value}
                      key={opt?.id}
                      // sx={{ mb: 1 }}
                      sx={{ mb: 2, marginTop: "1rem" }}
                      onBlur={(e) =>
                        handleOptionValues(item?.id, opt?.id, e.target.value)
                      }
                    />
                    <Tooltip title="Delete Option" aria-label="delete-option">
                      <IconButton
                        aria-label="delete-option"
                        onClick={() => deleteOption(item.id, opt?.id)}
                        sx={{ ml: 2 }}
                      >
                        <DeleteOutlineOutlinedIcon color="secondary" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              <Button variant="text" onClick={() => createNewOption(item.id)}>
                Add Option
              </Button>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="el-type-label">Type</InputLabel>
                <Select
                  labelId="el-type-label"
                  id="el-type"
                  label="Type"
                  value={item.type}
                  onChange={(e) => handleElType(item.id, e.target.value)}
                >
                  {formEl &&
                    formEl.map((el, key) => (
                      <MenuItem key={key} value={el.value}>
                        {el.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Divider light />
        <FormGroup row sx={{ alignItems: "center" }}>
          {data.length > 1 && (
            <Tooltip title="Delete Element" aria-label="delete-element">
              <IconButton
                aria-label="delete-element"
                onClick={() => deleteEl(item.id)}
                sx={{ ml: 2 }}
              >
                <DeleteOutlineOutlinedIcon color="secondary" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Duplicate Element" aria-label="duplicate-element">
            <IconButton
              aria-label="duplicate-element"
              onClick={() => duplicateElement(item.id, item.type)}
              sx={{ ml: 2 }}
            >
              <FileCopyIcon color="secondary" />
            </IconButton>
          </Tooltip>

          <FormControlLabel
            control={
              <Switch
                checked={item.required}
                onChange={() => handleRequired(item.id)}
                name="required-field"
                color="secondary"
              />
            }
            label="Required"
            sx={{ ml: 2 }}
          />
        </FormGroup>
      </Paper>
    </Fragment>
  );
};

export default CheckboxInput;
