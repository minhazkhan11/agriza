import { Fragment, useState, useEffect } from "react";
import uuid from "react-uuid";
import Nestable from "react-nestable";
//Material UI Components
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
//Form Elements
import {
  TextFieldInput,
  TextArea,
  RadioInput,
  DateInput,
} from "./elements";
import CheckboxInput from "./elements/CheckboxInput.jsx";
import FileInput from "./elements/FileInput.jsx";
import { formEl } from "./constants.js";
import useStyles from "../../../../styles.js";
//Components
import Header from "./Header";

const FormBuilder = () => {
  const classes = useStyles();

  const initVal = formEl[0]?.value;

  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");

  const [formData, setFormData] = useState("text");

  const initialData = {
    id: uuid(),
    value: null,
    type: formData,
    required: false,
  };
  const [data, setData] = useState([initialData]);

  const [headerData, setHeaderData] = useState({ title: "", description: "" });

  const items = data;

  const addElement = () => {
    const newElement = {
      id: uuid(), // Generate a new unique ID
      value: null,
      type: initVal,
      required: false,
    };
    setData((prevState) => [...prevState, newElement]);
    setFormData(initVal);
  };

  const deleteEl = (id) => {
    setData((prevState) => prevState.filter((val) => val.id !== id));
  };

  const addAfter = (elArray, index, newEl) => {
    return [...elArray.slice(0, index + 1), newEl, ...elArray.slice(index + 1)];
  };

  const duplicateElement = (elId, elType) => {
    let elIdx = data.findIndex((el) => el.id === elId);
    let newEl = {
      id: uuid(),
      value: null,
      type: elType,
      required: false,
    };
    let newArr = addAfter(data, elIdx, newEl);
    setData(newArr);
  };

  const handleOnChangeSort = ({ items }) => {
    setData(items);
  };

  const handleValue = (id, value) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, value: value };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  const handleRequired = (id) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, required: !el.required };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  const handleElType = (id, type) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, type: type };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  const addOption = (id, newOption) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        const objVal = "options" in el ? el?.options : [];
        return { ...el, options: [...objVal, newOption] };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  const handleDate = (id, dateVal) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, date: dateVal };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  const handleOptionValues = (elId, optionId, optionVal) => {
    let newArr = data.map((el) => {
      if (el.id === elId) {
        el?.options &&
          el?.options.map((opt) => {
            if (opt.id === optionId) {
              opt.value = optionVal;
            }
          });
        return el;
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  const deleteOption = (elId, optionId) => {
    let newArr = data.map((el) => {
      if (el.id === elId) {
        let newOptions =
          el?.options && el?.options.filter((opt) => opt.id !== optionId);
        return { ...el, options: newOptions };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  const handleHeaderDataChange = (headerData) => {
    setHeaderData(headerData);
  };

  const handleQuillDataChange = (content) => {

  };

  //Render items
  const renderElements = ({ item }) => {
    switch (item.type) {
      case "text":
        return (
          <TextFieldInput
            data={data}
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      case "textarea":
        return (
          <TextArea
            data={data}
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );

      case "radio":
        return (
          <RadioInput
            data={data}
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            addOption={addOption}
            handleOptionValues={handleOptionValues}
            deleteOption={deleteOption}
            duplicateElement={duplicateElement}
          />
        );
      case "checkbox":
        return (
          <CheckboxInput
            data={data}
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            addOption={addOption}
            handleOptionValues={handleOptionValues}
            deleteOption={deleteOption}
            duplicateElement={duplicateElement}
          />
        );
      case "date":
        return (
          <DateInput
            data={data}
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            handleDate={handleDate}
            duplicateElement={duplicateElement}
          />
        );

      case "file":
        return (
          <FileInput
            data={data}
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  return (
    <div
    
      style={{
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        borderTop: "3px solid #146A8E",
        padding: "20px",
        background: "#fff",
      }}
    >
      <Fragment>
        <Grid container spacing={1} direction="row" justifyContent="flex-end">
          <Grid item md={12}>
            <Header
              title={title} // Title field
              setTitle={setTitle}
              description={description} // Description field
              setDescription={setDescription}
              onHeaderDataChange={handleHeaderDataChange}
              onQuillDataChange={handleQuillDataChange} // Pass callback function
            />
            <Nestable
              items={items}
              renderItem={renderElements}
              maxDepth={1}
              onChange={handleOnChangeSort}
            />
          </Grid>
          <div>
            <Tooltip title="Add Element" aria-label="add-element">
              <Button
                aria-label="add-element"
                onClick={addElement}
                sx={{ position: "sticky", top: 30 }}
                className={classes.addmorebtn}
              >
                Add More
              </Button>
            </Tooltip>
          </div>
        </Grid>
      </Fragment>
    </div>
  );
};
export default FormBuilder;
