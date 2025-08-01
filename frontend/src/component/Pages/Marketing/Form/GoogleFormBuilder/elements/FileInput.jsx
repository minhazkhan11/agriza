import { Fragment, useState } from "react";
// Material UI Components
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
// Icons
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Form Elements
import { formEl } from "../constants";

const FileInput = ({
  data,
  item,
  handleValue,
  deleteEl,
  handleRequired,
  handleElType,
  duplicateElement,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [editorHtml, setEditorHtml] = useState(item?.value);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (html) => {
    setEditorHtml(html);
    handleValue(item.id, html);
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
              <ReactQuill
                value={editorHtml}
                onChange={(value)=>{handleChange(value)}}
                placeholder="File Input Label"
                style={{
                  marginBottom: "20px",
                }}
              />
              {/* <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={(e) => {
                  handleValue(item.id, e);
                  handleFileChange(e);
                }}
                multiple={false}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Selected"
                  style={{ maxWidth: "100%", marginTop: "10px" }}
                />
              )} */}
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

export default FileInput;
