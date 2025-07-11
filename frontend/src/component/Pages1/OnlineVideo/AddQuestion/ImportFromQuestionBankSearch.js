import React from "react";
import useStyles from "../../../../styles";
import { Button, FormLabel, TextField } from "@material-ui/core";

function ImportFromQuestionBankSearch() {
  const classes = useStyles();

  return (
   
 <div
            className={`${classes.py2} ${classes.px1_5} ${classes.dflex} ${classes.alignitemsend}`}
          >
          
            <div className={`${classes.dflex} ${classes.flexdirectioncolumn}`}>
            <FormLabel
              className={`${classes.textcolorformlabel}  ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
         Subject
            </FormLabel>
              <TextField
                className={`${classes.textcolorformlabel}`}
                name="category_name"
                type="text"
                variant="outlined"
                required
                placeholder="Enter Here"
              />
                   </div>
                   <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.ml1}`}>
            <FormLabel
              className={`${classes.textcolorformlabel}  ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
           Topic
            </FormLabel>
              <TextField
                className={`${classes.textcolorformlabel}`}
                name="category_name"
                type="text"
                variant="outlined"
                required
                placeholder="Enter Here"
              />
                   </div>
              <Button
                className={`${classes.custombtnblue} ${classes.ml1}`}
              >
                Search
              </Button>
       
          </div>

  );
}
export default ImportFromQuestionBankSearch;