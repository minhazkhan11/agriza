import { makeStyles } from "@material-ui/core";
import popupbackground from "./component/images/PopupScreenIcon/popupbackground.png";

const useStyles = makeStyles((theme) => ({
  // Update button style for better visibility
  uploadButton: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    margin: theme.spacing(1),
  },

  // Style for the container holding the image previews and the upload button
  imagePreviewContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center", // Ensure alignment
    justifyContent: "flex-start", // Align items to the start
    marginBottom: theme.spacing(2), // Space below the container
  },

  // Preview image styles
  imagePreview: {
    position: "relative",
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  // Close icon styles
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    cursor: "pointer",
    color: "red",
    backgroundColor: "white",
    borderRadius: "50%",
  },

  closeiconpop: {
    fill: "#fff",
    width: "25px",
    height: "25px",
  },

  input: {
    display: "none",
  },

  fileinput: {
    "& input": {
      border: "1px solid rgba(0, 0, 0, 0.23)",
      borderRadius: "4px",
      padding: "10.5px 14px !important",
    },
  },

  // Additional style to position the upload button separately
  uploadButtonContainer: {
    display: "flex",
    justifyContent: "flex-start", // Adjust this as needed
    width: "100%", // Ensure it spans the full width of the container
  },

  containerfluid: {
    width: "100%",
    // marginTop:'3rem',
  },
  container: {
    maxWidth: "1250px",
    margin: "0 auto",
  },
  optionContainer: {
    marginBottom: theme.spacing(4), // Adjust this value as needed
    // Add other styling if necessary
    "& .ql-editor": {
      paddingLeft: "3rem",
    },
  },
  centeredTitle: {
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    // Add more styles as needed
  },
  durationinput: {
    display: "flex",
    justifyContent: "flex-end",
  },

  tableRow: {
    "&:not(:last-child)": {
      marginBottom: "3rem",
    },
  },

  tablecolumn: {
    "& .MuiFormControlLabel-root": {
      marginLeft: "0",
      marginRight: "0",
    },
  },

  arrowicon: {
    position: "absolute",
    left: "-10px",
    padding: "0.2rem 0.8rem",
  },
  statusGiving: {
    padding: "0.3rem 0.5rem",
    backgroundColor: "orange",
    width: "100%",
    color: "white",
    textAlign: "center",
    borderRadius: "20px",
    position: "relative",
    "& .MuiTypography-h6": {
      fontSize: "1rem",
      fontFamily: "DM Sans !important",
      fontWeight: "500",
    },
  },
  statusNotGiving: {
    padding: "0.3rem 0.5rem",
    backgroundColor: "#FF3B5F", // A light red shade
    width: "100%",
    color: "white",
    textAlign: "center",
    borderRadius: "20px",
    position: "relative",
    "& .MuiTypography-h6": {
      fontSize: "1rem",
      fontFamily: "DM Sans !important",
      fontWeight: "500",
    },
  },
  statusSubmitted: {
    padding: "0.3rem 0.5rem",
    backgroundColor: "#2196F3", // A more vibrant blue
    width: "100%",
    color: "white",
    textAlign: "center",
    borderRadius: "20px",
    position: "relative",
    "& .MuiTypography-h6": {
      fontSize: "1rem",
      fontFamily: "DM Sans !important",
      fontWeight: "500",
    },
  },

  // background css starts
  bgnone: {
    background: "none !important",
  },
  // bgblue: {
  //   background: "#29272E !important",
  // },
  bgblue: {
    background: "#1C1823 !important",
  },
  bggrey: {
    background: "#E9F1EF !important",
  },
  bggrey1: {
    background: "#FAFAFA !important",
  },
  bgsky: {
    background: "#1C1823 !important",
  },
  bgskylite: {
    background: "#FEF4EA !important",
  },
  bgcream: {
    background: "#FDF3E9 !important",
  },
  bgdarkblue: {
    background: "#1C1823 !important",
  },
  bgdarkblue1: {
    background: "#FEF4EA !important",
  },
  bgwhite: {
    background: "#FFFFFF !important",
  },
  bgtransparent: {
    background: "transparent !important",
  },
  bgorange: {
    background: "#FFAD5B !important",
  },
  bg535353: {
    background: "#535353",
  },
  lightskyblue: {
    background: " #F3FCFF",
  },
  bgbackground1: {
    background: `url(${popupbackground})`,
  },
  backgroundnorepeat: {
    backgroundRepeat: "no-repeat",
  },
  backgroundcover: {
    backgroundSize: "cover",
  },
  background00577B: {
    background: "#00577B",
  },

  bghoverwhite: {
    "&:hover": {
      "& svg": {
        fill: "#FD6E38",
      },
    },
  },
  bggreen: {
    background: "#DFFFF7 !important",
  },
  popupclosefill: {
    fill: "#D9D9D9",
  },
  fillhoverblue: {
    "&:hover": {
      "& svg": {
        fill: "#146A8E !important",
      },
    },
  },

  // background css ends

  // width css start
  minwidth30px: {
    minWidth: "30px !important",
  },
  minwidth20px: {
    minWidth: "20px !important",
  },
  collapse_icon_width: {
    "& svg": {
      width: "20px",
      height: "20px",
      transition: "350ms",
    },
  },
  w5: {
    width: "5% !important",
    transition: "350ms",
    transitionTimingFunction: "ease",
  },
  w5_5: {
    width: "5% !important",
  },
  w10: {
    width: "10% !important",
  },
  w12: {
    width: "12% !important",
  },
  w14: {
    width: "14% !important",
  },
  w15: {
    width: "15% !important",
  },
  w17: {
    width: "17% !important",
  },
  w18: {
    width: "18% !important",
    transition: "350ms",
    transitionTimingFunction: "ease",
  },
  w20: {
    width: "20% !important",
  },
  w21: {
    width: "21% !important",
  },
  w24: {
    width: "24% !important",
  },
  w25: {
    width: "25% !important",
  },
  w24_5: {
    width: "24.5% !important",
  },
  w26: {
    width: "26% !important",
  },
  w29: {
    width: "29.5% !important",
  },
  w30: {
    width: "30% !important",
  },
  w31: {
    width: "31.5% !important",
  },
  w32: {
    width: "32% !important",
  },
  w34: {
    width: "34% !important",
  },
  w35: {
    width: "35% !important",
  },
  w36: {
    width: "36% !important",
  },
  w37: {
    width: "37% !important",
  },
  w38: {
    width: "38% !important",
  },
  w36_6: {
    width: "36.6% !important",
  },
  w40: {
    width: "40% !important",
  },
  w45: {
    width: "45% !important",
  },
  w47: {
    width: "47% !important",
  },
  w49: {
    width: "49% !important",
  },
  w50: {
    width: "50% !important",
  },
  w53: {
    width: "53% !important",
  },
  w56: {
    width: "56% !important",
  },
  w60: {
    width: "60% !important",
  },
  w62: {
    width: "62% !important",
  },
  w65: {
    width: "65% !important",
  },
  w67: {
    width: "67% !important",
  },
  w68: {
    width: "68% !important",
  },
  w69: {
    width: "69% !important",
  },
  w72: {
    width: "72% !important",
  },
  w73: {
    width: "73% !important",
  },
  w74: {
    width: "74.5%",
  },
  w75: {
    width: "75%",
  },
  w78: {
    width: "78%",
  },
  w80: {
    width: "80% !important",
  },
  w85: {
    width: "85% !important",
  },
  w89: {
    width: "89% !important",
  },
  w90: {
    width: "90% !important",
  },

  w95: {
    width: "95% !important",
  },

  w100: {
    width: "100% !important",
  },
  w25px: {
    width: "25px !important",
  },
  w27px: {
    minWidth: "27px !important",
  },
  w54: {
    width: "54%",
  },

  // width css ends

  gap20px: {
    gap: "20px",
  },

  gap30px: {
    gap: "30px",
  },

  muiIconSize: {
    "& .MuiSvgIcon-root": {
      fontSize: "2rem",
    },
  },

  badgeOrange: {
    "& .MuiBadge-colorSecondary": {
      backgroundColor: "#FD6E38 !important",
      color: "#fff",
    },
  },

  // height css start

  h50p: {
    height: "50% !important",
  },

  h82vh: {
    height: "82vh !important",
  },

  h45vh: {
    height: "45vh !important",
  },

  h62px: {
    minHeight: "62px !important",
  },
  h78vh: {
    height: "78vh !important",
  },
  h398px: {
    height: "398px !important",
  },
  h320px: {
    height: "320px !important",
  },
  h683px: {
    height: "683px !important",
  },
  h600px: {
    height: "600px !important",
  },
  h72vh: {
    height: "72vh !important",
  },
  h71vh: {
    height: "71vh !important",
  },
  h77vh: {
    height: "75vh !important",
  },
  h61vh: {
    height: "61vh !important",
  },
  h60vh: {
    height: "60vh !important",
  },
  h65vh: {
    height: "65vh !important",
  },
  h49vh: {
    height: "49vh !important",
  },
  h44vh: {
    height: "44vh !important",
  },
  h42vh: {
    height: "42vh !important",
  },
  h40vh: {
    height: "40vh !important",
  },
  h46vh: {
    height: "46vh !important",
  },
  h54vh: {
    height: "54vh !important",
  },
  h57vh: {
    height: "56vh !important",
  },
  h79vh: {
    height: "79vh !important",
  },
  h91vh: {
    height: "91vh !important",
  },
  h100vh: {
    height: "100vh !important",
  },
  h80vh: {
    height: "80vh !important",
  },
  h89vh: {
    height: "89vh !important",
  },
  h90vh: {
    height: "90vh !important",
  },
  mhauto: {
    minHeight: "auto !important",
  },
  maxh68: {
    maxHeight: "68vh !important",
  },
  maxh76: {
    maxHeight: "73vh !important",
  },
  h76: {
    height: "73vh !important",
  },

    h76max: {
      maxHeight: "76vh !important",
  },

  maxh75: {
    maxHeight: "75vh !important",
  },
  maxh65: {
    maxHeight: "65vh !important",
  },
  maxh67: {
    height: "67vh !important",
  },
  maxh60: {
    height: "60vh !important",
  },
  maxh62: {
    height: "62vh !important",
  },
  maxh52: {
    height: "52vh !important",
  },
  h25px: {
    height: "25px !important",
  },
  dividerheight: {
    height: "30px",
  },

  // height css start

  overflowhidden: {
    overflow: "hidden",
  },

  // flex properties css start
  crossbtnhideautocom: {
    "& .MuiAutocomplete-endAdornment": {
      display: "none",
    },
  },

  crossbtn: {},

  dflex: {
    display: "flex !important",
  },
  dblock: {
    display: "block !important",
    transition: "350ms",
  },
  dnone: {
    display: "none !important",
    transition: "350ms",
    transitionTimingFunction: "ease",
  },
  justifyspacebetween: {
    justifyContent: "space-between !important",
  },
  alignitemscenter: {
    alignItems: "center !important",
  },
  alignitembaseline: {
    alignItems: "baseline !important",
  },
  alignitemsend: {
    alignItems: "flex-end !important",
  },
  flexdirectioncolumn: {
    flexDirection: "column !important",
  },
  flexdirectionrow: {
    flexDirection: "row !important",
  },
  flexwrapwrap: {
    flexWrap: "wrap",
  },
  justifyspaceevenly: {
    justifyContent: "space-evenly",
  },
  justifycenter: {
    justifyContent: "center !important",
  },
  justifyleft: {
    justifyContent: "left !important",
  },
  justifyflexend: {
    justifyContent: "flex-end  !important",
  },
  justifyaround: {
    justifyContent: "space-around",
  },

  // flex properties css ends

  // shadow properties css start

  boxshadow0: {
    boxShadow: "none !important",
  },
  boxshadow1: {
    boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06) !important",
  },
  boxshadow3: {
    boxShadow: "0px 6px 40px rgba(0, 0, 0, 0.06) !important",
  },
  boxshadow4: {
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.10) !important",
  },
  boxshadow5: {
    boxShadow: "-5px 1px 15px 0px rgba(0, 0, 0, 0.07)",
  },
  boxShadow6: {
    boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.04)",
  },
  boxshadow6: {
    boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.09) inset",
  },
  boxshadow7: {
    boxShadow: "0 0 15px #ffd6ae inset !important",
  },

  boxshadow9: {
    boxShadow:
      "0px 0px 2px 0px rgba(0,0,0,0.3),0px 0px 0px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.29)",
  },
  boxshadow10: {
    boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.06) !important",
  },

  // shadow properties css ends

  // text properties css start

  textoverflow: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    height: "48px",
  },

  checkoutimage: {
    borderRadius: "7px",
    height: "120px",
    marginRight: "20px",
    padding: "5px",
    width: "120px",
  },

  textcolororange: {
    color: "#FD6E38 !important",
  },
  textcolorwhite: {
    color: "#fff !important",
  },
  textcolorred: {
    color: "red !important",
  },
  textcolorlink: {
    color: "#008ECA !important",
  },
  textcolorblue: {
    color: "rgb(48, 88, 26) !important",
  },
  textcolorblue1: {
    color: "#055678 !important",
  },
  textcolorgrey: {
    color: "#6F6D6D !important",
  },
  textcolorgreen: {
    color: "#00AA7E !important",
  },
  textcolorformhead: {
    color: "#16283F !important",
  },
  textcolorformlabel: {
    color: "#333 !important",
  },
  textcolordarkcyan: {
    color: "darkcyan !important",
  },
  textblack: {
    color: "#000 !important",
  },
  lightbrowncolor: {
    color: "#A1A1A1 !important",
  },
  textcolor7676: {
    color: " #767676 !important",
  },
  textalignleft: {
    textAlign: "left !important",
  },
  textaligncenter: {
    textAlign: "center !important",
  },
  ligthcolor: {
    color: "#757575 !important",
  },
  lightblackcolor: {
    color: "#252525 !important",
  },
  color7A7A: {
    color: "#7A7A7A !important",
  },

  fontfamilyoutfit: {
    fontFamily: "Outfit !important",
  },
  fontfamilyDMSans: {
    fontFamily: "DM Sans !important",
  },
  fontFamilyJost: {
    fontFamily: "Jost !important",
  },
  fontFamilyInter: {
    fontFamily: "Inter !important",
  },

  fontsize: {
    fontSize: "1.375rem !important",
  },
  fontsize18px: {
    fontSize: "18px !important",
  },
  fontsize12px: {
    fontSize: "12px !important",
  },

  fontsize1: {
    fontSize: "0.9rem !important",
  },
  fontsize2: {
    fontSize: "0.625rem !important",
  },
  fontsize3: {
    fontSize: "0.8rem !important",
  },
  fontsize4: {
    fontSize: "1.125rem !important",
  },
  fontsize5: {
    fontSize: "1.25rem !important",
  },
  fontsize6: {
    fontSize: "1rem !important",
  },
  fontSize7: {
    fontSize: "0.875rem",
  },
  fontSize8: {
    fontSize: "1.4375rem",
  },
  fonSize9: {
    fontSize: "1.9375rem",
  },
  fontSize10: {
    fontSize: "0.8125rem",
  },
  fontSize11: {
    fontSize: "0.4375rem",
  },
  fontSize12: {
    fontSize: "1.55rem !important",
  },

  helpertext: {
    "& .MuiFormHelperText-contained": {
      textAlign: "end",
      color: "red",
    },
  },

  searchinputfontsize: {
    "& .MuiInputBase-root": {
      fontSize: "0.9rem !important",
    },
  },
  buttonlabelblock: {
    "& .MuiButton-label": {
      display: "block",
      textTransform: "capitalize",
    },
  },

  fontstylenormal: {
    fontStyle: "normal !important",
  },
  fw400: {
    fontWeight: "400 !important",
  },
  fw500: {
    fontWeight: "500 !important",
  },
  fw600: {
    fontWeight: "600 !important",
  },
  fw700: {
    fontWeight: "700 !important",
  },
  textuppercase: {
    textTransform: "uppercase !important",
  },
  lineheightnormal: {
    lineHeight: "normal !important",
  },
  lineheight: {
    lineHeight: "1.5rem !important",
  },
  lineheight1: {
    lineHeight: "1rem !important",
  },
  lineheight2: {
    lineHeight: "2rem !important",
  },
  lineheight2_25: {
    lineHeight: "2.25rem !important",
  },
  textdecorationnone: {
    textDecoration: "none",
  },

  textdecorationline: {
    textDecoration: "line-through",
  },

  errorMessage: {
    fontSize: "12px",
  },

  texttransformcapitalize: {
    textTransform: "capitalize !important",
  },

  texttransformlowercase: {
    textTransform: "lowercase !important",
  },

  textoverflowhidden: {
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  // text properties css ends

  // padding properties css start

  p0: {
    padding: "0 !important",
  },
  px0: {
    paddingRight: "0 !important",
    paddingLeft: "0 !important",
  },
  p0_2: {
    padding: "0.2rem  !important",
  },
  p0_5: {
    padding: "0.5rem  !important",
  },
  p1: {
    padding: "1rem",
  },
  p2: {
    padding: "2rem",
  },
  p2_2: {
    padding: "2.2rem",
  },
  p3: {
    padding: "3rem",
  },
  p6px: {
    padding: "6px",
  },
  p10px: {
    padding: "10px",
  },
  pr1: {
    paddingRight: "1rem !important",
  },
  pr4: {
    paddingRight: "4rem !important",
  },
  pl0: {
    paddingLeft: "0 !important",
  },
  pl0_5: {
    paddingLeft: "0.5rem !important",
  },
  pl2: {
    paddingLeft: "2rem !important",
  },
  px0_5: {
    paddingLeft: "0.5rem !important",
    paddingRight: "0.5rem !important",
  },
  px1_5: {
    paddingLeft: "1.5rem !important",
    paddingRight: "1.5rem !important",
  },
  px1: {
    paddingLeft: "1rem !important",
    paddingRight: "1rem !important",
  },
  px2: {
    paddingLeft: "2rem !important",
    paddingRight: "2rem !important",
  },
  px3: {
    paddingLeft: "3rem !important",
    paddingRight: "3rem !important",
  },
  py0: {
    paddingTop: "0rem !important",
    paddingBottom: "0rem !important",
  },
  py5px: {
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  py1: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
  },
  py2: {
    paddingTop: "2rem",
    paddingBottom: "2rem",
  },
  py0_5: {
    paddingTop: "0.5rem !important",
    paddingBottom: "0.5rem !important",
  },
  py0_56: {
    paddingTop: "0.56rem !important",
    paddingBottom: "0.56rem !important",
  },
  py1_5: {
    paddingTop: "1.5rem !important",
    paddingBottom: "1.5rem !important",
  },
  pb0: {
    paddingBottom: "0 !important",
  },
  pb1: {
    paddingBottom: "1rem !important",
  },
  pb2: {
    paddingBottom: "2rem !important",
  },
  pt1: {
    paddingTop: "1rem !important",
  },
  py0_5x0: {
    padding: "0.5rem 0rem",
  },
  py0_5x1: {
    padding: "0.5rem 1rem",
  },
  py0_8x1: {
    padding: "0.8rem 1rem",
  },
  py0_3x0_5: {
    padding: "0.3rem 0.5rem",
  },
  py0_2x0_5: {
    padding: "0.2rem 0.5rem",
  },
  p4: {
    padding: "4rem",
  },
  // padding properties css ends

  // margin properties css start

  m0auto: {
    margin: "0 auto !important",
  },

  m000auto: {
    margin: "0 0 0 auto !important",
  },

  m1auto: {
    margin: "1rem auto",
  },

  m1: {
    margin: "5rem",
  },
  m0_5: {
    margin: "0.5rem",
  },
  my0_5: {
    marginTop: "0.5rem !important",
    marginBottom: "0.5rem !important",
  },
  my1: {
    marginTop: "1rem !important",
    marginBottom: "1rem !important",
  },
  mx0_5: {
    marginLeft: "0.5rem !important",
    marginRight: "0.5rem !important",
  },
  mx1: {
    marginLeft: "1rem !important",
    marginRight: "1rem !important",
  },
  mx1_5: {
    marginLeft: "1.5rem !important",
    marginRight: "1.5rem !important",
  },
  mx2: {
    marginLeft: "2rem !important",
    marginRight: "2rem !important",
  },
  mx5: {
    marginLeft: "5rem !important",
    marginRight: "5rem !important",
  },
  mr0_5: {
    marginRight: "0.5rem !important",
  },
  mr1_5: {
    marginRight: "1.5rem !important",
  },
  ml1: {
    marginLeft: "1rem !important",
  },
  ml2: {
    marginLeft: "2rem !important",
  },
  ml3: {
    marginLeft: "3rem !important",
  },
  ml0_5: {
    marginLeft: "0.5rem !important",
  },
  ml0_4: {
    marginLeft: "0.4rem !important",
  },
  ml5: {
    marginLeft: "5rem !important",
  },
  mr0_3: {
    marginRight: "0.3rem !important",
  },

  mr1: {
    marginRight: "1rem !important",
  },
  mr3: {
    marginRight: "3rem !important",
  },
  mt0_5: {
    marginTop: "0.5rem !important",
  },
  mt0_7: {
    marginTop: "0.7rem !important",
  },
  mt1: {
    marginTop: "1rem !important",
  },
  mt5: {
    marginTop: "5rem !important",
  },
  mt50per: {
    marginTop: "50% !important",
  },
  mt3: {
    marginTop: "3rem !important",
  },
  mb1: {
    marginBottom: "1rem !important",
  },
  mx0: {
    marginLeft: "0",
    marginRight: "0",
  },
  mb0_5: {
    marginBottom: "0.5rem !important",
  },
  mt1_5: {
    marginTop: "1.5rem",
  },
  mt2: {
    marginTop: "2rem",
  },
  mb25: {
    marginBottom: "2.5rem",
  },

  letterSpace: {
    letterSpacing: " -0.03rem",
  },

  // margin properties css ends
  positionrelative: {
    position: "relative",
  },

  positionabsolute: {
    position: "absolute",
  },

  positionright: {
    right: "0",
  },

  positiontop: {
    top: "0",
  },

  editposition: {
    position: "absolute",
    bottom: "0",
    right: "0",
  },
  // borderradius properties css start
  borderradius16: {
    borderRadius: "1.625rem 0 0rem 1.625rem",
  },
  bordernone: {
    border: "none  !important",
  },
  borderradius6px: {
    borderRadius: "6px  !important",
  },
  borderradius10px: {
    borderRadius: "10px  !important",
  },
  borderradius30px: {
    borderRadius: "30px  !important",
  },
  borderradiuscustom1: {
    borderRadius: "0.625rem 0.625rem 0rem 0rem",
  },
  borderradius50: {
    borderRadius: "50%",
  },
  borderradius0375: {
    borderRadius: "0.375rem",
  },
  border1: {
    border: "1px solid #C8C8C8",
  },
  borderbottom1: {
    borderBottom: "1px solid #D9D9D9",
  },
  borderTop3px: {
    borderTop: "3px solid #115775",
  },
  borderLeft4px: {
    borderLeft: "4px solid #00577B",
  },
  border1999: {
    border: "1px solid #999",
  },
  borderblue: {
    border: "1px solid rgba(1, 96, 128, 1)",
  },

  borderblack: {
    border: "1px solid #000",
  },
  borderskyblue: {
    border: "1px solid #04A1D6",
  },
  dottedhr: {
    borderTop: "1px dashed #676767",
  },

  // borderradius properties css ends
  quillquestion: {
    "& .ql-toolbar.ql-snow": {
      borderRadius: " 6px 6px 0px 0px",
    },
    "& .ql-toolbar.ql-snow+.ql-container.ql-snow": {
      borderRadius: "0px 0px 6px 6px",
    },
    "& .ql-editor": {
      minHeight: "15em",
    },
  },
  quilladdsinglequestion: {
    "& .ql-toolbar.ql-snow": {
      borderRadius: " 6px 6px 0px 0px",
    },
    "& .ql-toolbar.ql-snow+.ql-container.ql-snow": {
      borderRadius: "0px 0px 6px 6px",
    },
    "& .ql-editor": {
      minHeight: "10em",
    },
    "& .ql-editor img": {
      maxWidth: "100px",
      height: "auto",
    },
  },

  // opacity properties css start

  opacity1: {
    opacity: "1",
  },

  // opacity properties css ends

  // button properties css start
  customiconbtn: {
    "&.MuiIconButton-root": {
      flex: "0 0 auto",
      color: "rgba(0, 0, 0)",
      padding: "0",
      overflow: "visible",
      fontSize: "1.5rem",
      textAlign: "center",
      transition: "background-color 150mscubic-bezier(0.4, 0, 0.2, 1) 0ms",
      borderRadius: "50%",
    },
  },
  disablefieldcolor: {
    "& .Mui-disabled": {
      color: "rgba(0, 0, 0,0.6) !important",
    },
  },

  bluebtn: {
    background: "#FD6E38 !important",
    color: "white  !important",
    fontSize: "0.9rem  !important",
    fontFamily: "Outfit  !important",
    fontWeight: "500  !important",
    textTransform: "capitalize  !important",
    padding: "0.4rem 1.5rem  !important",
    "& .MuiButton-root.Mui-disabled": {
      background: "red  !important",
      color: "rgba(0, 0, 0, 0.26)",
    },
    "& svg": {
      marginRight: "10px",
    },
    "&:hover": {
      background: "#00577B",
      color: "white",
    },
  },

  deletebtn: {
    background: "#00577B  !important",
    color: "white  !important",
    fontSize: "0.9rem  !important",
    fontFamily: "Outfit  !important",
    fontWeight: "500  !important",
    textTransform: "capitalize  !important",
    padding: "0.4rem 1.5rem  !important",
    "&.MuiButton-root.Mui-disabled": {
      background: "rgba(0, 0, 0, 0.12) !important",
      color: "rgba(0, 0, 0, 0.26) !important",
    },
    "&:hover": {
      background: "#00577B",
      color: "white",
    },
  },

  whitebtn: {
    background: "#fff  !important",
    color: "#000  !important",
    fontSize: "0.9rem  !important",
    fontFamily: "Outfit  !important",
    fontWeight: "500  !important",
    textTransform: "capitalize  !important",
    padding: "0.4rem 1.5rem  !important",
    "& svg": {
      marginRight: "10px",
    },
    "&:hover": {
      background: "#00577B",
      color: "white",
    },
  },

  transparentbtn: {
    background: "white !important",
    border: "1px solid #353535 !important",
    color: "#252525 !important",
    fontSize: "0.9rem !important",
    fontFamily: "Outfit important",
    fontWeight: "600 !important",
    textTransform: "capitalize !important",
    padding: "0.4rem 2rem !important",
    "& svg": {
      marginRight: "10px !important",
      fill: "#252525",
    },
    "&:hover": {
      background: "white !important",
      color: "#252525 !important",
    },
  },

  Applytransparentbtn: {
    background: "white !important",
    border: "1px solid #353535 !important",
    color: "#252525 !important",
    fontSize: "0.9rem !important",
    fontFamily: "Outfit important",
    fontWeight: "600 !important",
    textTransform: "capitalize !important",
    padding: "0.3rem 0rem !important",
    "& svg": {
      marginRight: "10px !important",
      fill: "#252525",
    },
    "&:hover": {
      background: "white !important",
      color: "#252525 !important",
    },
  },

  // button properties css ends

  inputpadding: {
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
      padding: "0px !important",
    },
    "& .MuiOutlinedInput-input": {
      // padding: "10.5px 14px !important",
      padding: "10.5px 5px 10.5px 14px !important",
    },
    "& .MuiOutlinedInput-multiline": {
      padding: "0px 0px",
    },
    "& .MuiChip-label": {
      whiteSpace: "break-spaces !important",
      textAlign: "center !important",
    },
  },
  inputcontainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "1rem 0",
    "& .MuiFormControl-root": {
      width: "100%",
    },
  },
  inputborder: {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
      borderWidth: "1px !important",
    },
  },

  selectallcheckbox: {
    "& .MuiFormControlLabel-root": {
      marginLeft: "0",
      marginRight: "0",
    },
  },

  inputdropdowniconcolor: {
    "& .MuiSelect-icon": {
      color: "white",
    },
  },
  inputdropdowniconcoloblack: {
    "& .MuiSelect-icon": {
      color: "#000",
    },
  },

  inputborderwhite: {
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.87)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255 255, 255, 0.23)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255 255, 255, 0.23) !important",
      borderWidth: "1px !important",
    },
  },
  inputplaceholdercolor: {
    "& .MuiInputBase-input": {
      color: "rgba(255 255, 255, 0.8) !important",
    },
  },
  inputplaceholdercolorblack: {
    "& .MuiInputBase-input": {
      color: "rgba(0 ,0, 0, 0.83) !important",
    },
  },
  pagescroll: {
    overflow: "scroll",
    "&::-webkit-scrollbar ": {
      display: "none",
    },
  },
  showscroll: {
    overflowY: "scroll",
  },

  // Side Pannel properties css starts

  cursorpointer: {
    cursor: "pointer",
  },

  tab1: {
    "& .MuiTab-wrapper > *:first-child": {
      marginBottom: "0 !important",
    },
    "& .MuiTab-wrapper": {
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-start",
      "& svg": {
        margin: 0,
        marginRight: "10px",
      },
    },
  },
  tab2: {
    "& .MuiTab-wrapper > *:first-child": {
      alignItems: "center !important",
    },
    "& .MuiTab-wrapper": {
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-start",
      textTransform: "capitalize !important",
      "& svg": {
        margin: 0,
        marginRight: "10px",
      },
    },
  },
  accordianhead: {
    "&:hover": {
      color: "#FFFFFF !important",
      borderRadius: "6px",
      backgroundColor: "#106386 !important",
      boxShadow: "5px 4px 10px 0px rgba(0, 0, 0, 0.16) inset",
      "& svg": {
        fill: "#fff",
      },
    },
  },

  link2: {
    "&:hover": {
      backgroundColor: "#FEF4EA !important",
      color: "rgb(48, 88, 26) !important",
      "& svg": {
        fill: "rgb(48, 88, 26) !important",
      },
    },
  },
  link: {
    "&:hover": {
      backgroundColor: "#FD6E38 !important",
      color: "white !important",
      "& svg": {
        fill: "#fff",
      },
    },
  },

  activelink: {
    backgroundColor: "#EDFAFF !important",
    color: "#FD6E38 !important",
    "& svg": {
      fill: "#FD6E38",
    },
  },

  activedropdown: {
    background: "#FD6E38 !important",
    color: "white !important",
    "& svg": {
      fill: "#fff",
    },
  },

  sublink: {
    "&:hover": {
      backgroundColor: "#FFECD9 !important",
      color: "#FD6E38 !important",
      "& svg": {
        fill: "#FD6E38",
      },
    },
  },

  activesubdropdown: {
    background: "#FFECD9 !important",
    color: "#FD6E38 !important",
    "& svg": {
      fill: "#FD6E38",
    },
  },
  sidepanelpopup: {
    display: "block",
    background: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    transform: "none",
    top: "-60px !important",
    left: "62px !important",
    transformOrigin: "0px 72px",
    zIndex: "0",
  },

  // Side Pannel properties css ends

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
  disabledbtn: {
    background: "grey !important",
    color: "white !important",
    fontSize: "1rem !important",
    fontFamily: "Outfit !important",
    fontWeight: "600 !important",
    textTransform: "capitalize !important",
    padding: "0.4rem 2rem !important",
    "&:hover": {
      background: "#00577B !important",
      color: "white !important",
    },
  },
  custombtnorange: {
    background: "#FFAD5B",
    color: "white",
    fontSize: "1rem",
    fontFamily: "Outfit",
    fontWeight: "500",
    textTransform: "capitalize",
    padding: "0.4rem",
    "& :svg": {
      fill: "white",
    },
    "&:hover": {
      background: "#FFAD5B",
      color: "white",
    },
  },
  custombtnwhite: {
    background: "#FFF",
    color: "#000",
    fontSize: "1rem",
    fontFamily: "Outfit",
    fontWeight: "600",
    textTransform: "capitalize",
    padding: "0.4rem 2rem",
    border: "1px solid rgba(193, 193, 193, 1)",
    "&:hover": {
      background: "#00577B",
      color: "white",
    },
  },
  custombtnoutline: {
    background: "rgba(255,255,255, 0.3) ",
    border: "1px solid #353535",
    color: "#252525",
    fontSize: "1rem",
    fontFamily: "Outfit",
    fontWeight: "600",
    textTransform: "capitalize",
    padding: "0.4rem 2rem",
    marginRight: "1rem",
    "&:hover": {
      background: "white",
      color: "#252525",
    },
  },
  addmorebtn: {
    background: "#00577B !important",
    color: "white !important",
    fontSize: "0.87rem !important",
    fontFamily: "Outfit !important",
    fontWeight: "600 !important",
    textTransform: "capitalize !important",
    padding: "0.3rem 0.6rem !important",
    "&:hover": {
      background: "#00577B !important",
      color: "white !important",
    },
  },
  removebtn: {
    background: "rgba(255,255,255, 0.3) ",
    border: "1px solid #353535",
    color: "#252525",
    fontSize: "0.87rem",
    fontFamily: "Outfit",
    fontWeight: "600",
    textTransform: "capitalize",
    padding: "0.3rem 0.6rem",
    marginRight: "1rem",
    "&:hover": {
      background: "white",
      color: "#252525",
    },
  },
  dropdowncard: {
    width: "200px",
    // top: "1px !important",
    // left: "15px !important",
    zIndex: "1500",
    top: "7px !important",
    "& .MuiList-padding": {
      paddingTop: "0",
      paddingBottom: "0",
    },
    "& .MuiPaper-rounded ": {
      borderRadius: "0px",
    },
  },

  dropdownlink: {
    textDecoration: "none",
    color: "black",
    fontSize: " 0.4rem !important",
  },

  headname: {
    paddingRight: "2px",
    textAlign: "left",
    color: "black",
    textTransform: "capitalize",
  },

  neworderbtn: {
    border: "1px solid #D98C19",
    borderRadius: "10px",
    color: "#D98C19",
    background: "#FFEDAF",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    padding: "0.3rem 0.5rem",
    width: "112px",
  },
  packingbtn: {
    border: "1px solid #27B8F6",
    borderRadius: "10px",
    color: "#27B8F6",
    background: "#CBECFF",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    padding: "0.3rem 0.5rem",
    width: "112px",
  },
  deliverybtn: {
    border: "1px solid #12A0A0",
    borderRadius: "10px",
    color: "#12A0A0",
    background: "#E1FFFF",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    padding: "0.3rem 0.5rem",
    width: "112px",
  },
  deliveredbtn: {
    border: "1px solid #EE5D50",
    borderRadius: "10px",
    color: "#EE5D50",
    background: "#FFECEB",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    padding: "0.3rem 0.5rem",
    width: "112px",
  },

  // View Table properties css start

  viewtable: {
    "& .super-app-theme--header": {
      backgroundColor: "#FD6E38",
      color: "#FFFFFF",
    },
    "& .quill-cell": {
      lineHeight: "0 !important",
    },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus":
      {
        outline: "none",
      },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-root .MuiDataGrid-cell:focus-within":
      {
        outline: "none !important",
      },
    "& .MuiIconButton-label": {
      background: "none",
    },
    "& .MuiDataGrid-root .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--withRenderer, .MuiDataGrid-root .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--editing":
      {
        justifyContent: "center",
      },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted) .MuiDataGrid-sortIcon":
      {
        opacity: "0.5",
        transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
    "& .MuiDataGrid-root .MuiDataGrid-cell--textLeft": {
      textAlign: "center",
    },
    "& .MuiDataGrid-sortIcon": {
      fill: "white",
      width: "1em",
      height: "1em",
      display: "inline-block",
      fontSize: "1.5rem",
      transition: "fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      flexShrink: "0",
      userSelect: "none",
    },
    "& .MuiDataGrid-root .MuiDataGrid-cell": {
      border: "none",
    },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeaderWrapper": {
      background: "#FD6E38",
    },
    "& .MuiDataGrid-row.Mui-odd": {
      backgroundColor: "#FFFFFF",
    },
    "& .MuiDataGrid-row:nth-child(even)": {
      backgroundColor: "#FAFAFA",
    },
  },

  viewtablewhite: {
    "& .super-app-theme--header": {
      backgroundColor: "#FFF",
      color: "black",
    },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus":
      {
        outline: "none",
      },
    "& .MuiIconButton-label": {
      background: "white",
    },
    "& .MuiDataGrid-root .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--withRenderer, .MuiDataGrid-root .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--editing":
      {
        justifyContent: "left",
      },
    "& .MuiDataGrid-root .MuiDataGrid-cell": {
      border: "none",
    },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-root .MuiDataGrid-cell:focus-within":
      {
        outline: "none !important",
      },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeaderWrapper": {
      background: "#FFFFFF",
    },
    "& .MuiDataGrid-root .MuiDataGrid-cell": {
      border: "none",
    },
    "& .MuiDataGrid-row.Mui-odd": {
      backgroundColor: "#FFFFFF",
    },
    "& .MuiDataGrid-row:nth-child(even)": {
      backgroundColor: "#FAFAFA",
    },
  },

  viewtablered: {
    "& .super-app-theme--header": {
      backgroundColor: "#EE5D50",
      color: "#FFFFFF",
    },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus":
      {
        outline: "none",
      },
    "& .MuiDataGrid-root .MuiDataGrid-cell--textLeft": {
      textAlign: "center",
    },
    "& .MuiDataGrid-root .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--withRenderer, .MuiDataGrid-root .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--editing":
      {
        justifyContent: "flex-end",
      },
    "& .MuiDataGrid-root .MuiDataGrid-cell": {
      border: "none",
    },
    "& .MuiDataGrid-row.Mui-odd": {
      backgroundColor: "#FFFFFF",
    },
    "& .MuiDataGrid-row:nth-child(even)": {
      backgroundColor: "#FAFAFA",
    },
  },

  tablecheckbox: {
    "& .MuiCheckbox-colorPrimary.Mui-checked": {
      color: "#FD6E38 !important",
    },
    "& .MuiIconButton-colorPrimary": {
      color: "#FD6E38 !important",
    },
  },

  viewtablegreen: {
    "& .super-app-theme--header": {
      backgroundColor: "#05CD99",
      color: "#FFFFFF",
    },
    "& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus":
      {
        outline: "none",
      },
    "& .MuiDataGrid-root .MuiDataGrid-cell--textLeft": {
      textAlign: "center",
    },
    "& .MuiDataGrid-root .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--withRenderer, .MuiDataGrid-root .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--editing":
      {
        justifyContent: "flex-end",
      },
    "& .MuiDataGrid-root .MuiDataGrid-cell": {
      border: "none",
    },
    "& .MuiDataGrid-row.Mui-odd": {
      backgroundColor: "#FFFFFF",
    },
    "& .MuiDataGrid-row:nth-child(even)": {
      backgroundColor: "#FAFAFA",
    },
  },

  table: {
    borderRadius: "10px",
  },

  // View Table properties css ends
  accordianroot: {
    "& .MuiAccordionSummary-content": {
      margin: 0,
    },
    "& .MuiListItemIcon-root": {
      minWidth: "auto !important",
    },
    "& .MuiAccordionSummary-root": {
      minHeight: "auto !important",
    },
    "& .Mui-expanded": {
      backgroundColor: "#106386 !important",
      color: "#fff",
      "& svg": {
        fill: "#fff",
      },
    },
  },

  radiocolor: {
    "& .MuiRadio-colorSecondary.Mui-checked": {
      color: "#FD6E38 !important",
    },
    "& .MuiRadio-colorSecondary": {
      color: "rgba(0, 0, 0, 0.54) !important",
    },
  },

  avtar: {
    position: "relative !important",
    top: "6.3rem !important",
    left: "1rem !important",
    width: "25px !important",
    height: "25px !important",
    border: "1px solid #146A8E !important",
    background: "#FFFFFF  !important",
    color: "#146A8E !important",
    fontSize: "0.75rem !important",
    fontFamily: "Jost !important",
  },
  avtar_active: {
    position: "relative !important",
    top: "6.3rem !important",
    left: "1rem !important",
    width: "25px !important",
    height: "25px !important",
    background: "#146A8E !important",
    fontSize: "0.75rem !important",
    fontFamily: "Jost !important",
  },
  opt: {
    zIndex: 999,
  },
  input2: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: "0.7rem 0",
  },
  allcategory: {
    width: "50%",
    "& .MuiButton-label": {
      fontFamily: "Jost",
      textTransform: "capitalize",
      color: "#585858",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: "0",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "transparent",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "& .MuiOutlinedInput-root": {
      width: "100%",
    },
  },
  customcalender: {
    border: "0 !important",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.06)",
    borderRadius: "6px",

    "& .react-calendar__tile--active": {
      background: "#00577B !important",
      borderRadius: "50%",
      color: "#FFF !important",
    },
    "& .react-calendar__tile": {
      borderRadius: "50%",
    },
    "& .react-calendar__month-view__weekdays": {
      textTransform: "capitalize",
      color: "#808080",
      fontWeight: "500",
    },
    "& .react-calendar__month-view__days__day--weekend": {
      color: "inherit",
    },
  },
  radiobtninner: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& .MuiFormGroup-root": {
      display: "flex",
      flexDirection: "row",
    },
    "& .MuiRadio-colorSecondary.Mui-checked": {
      color: "#313866",
    },
  },
  paperpopup: {
    position: "relative",
    // top: "100px",
    margin: "0 auto",
    width: "35%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      fontSize: "1.3rem",
      fontFamily: "Outfit !important",
      fontWeight: "600",
      color: "#16283F",
    },
    "& .MuiTypography-h5": {
      fontSize: "1rem",
      fontFamily: "Jost !important",
      fontWeight: "400",
      color: "#16283F",
    },
    "& .MuiFormLabel-root": {
      margin: "1rem 0 0.5rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      fontSize: "0.875rem",
    },
  },
  doubtforumpopup: {
    position: "relative",
    margin: "0 auto",
    width: "55%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      fontSize: "1.3rem",
      fontFamily: "Outfit !important",
      fontWeight: "600",
      color: "#16283F",
    },
    "& .MuiTypography-h5": {
      fontSize: "1rem",
      fontFamily: "Jost !important",
      fontWeight: "400",
      color: "#16283F",
    },
    "& .MuiFormLabel-root": {
      margin: "1rem 0 0.5rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      fontSize: "0.875rem",
    },
  },
  planpopup: {
    position: "relative",
    top: "100px",
    margin: "0 auto",
    width: "70%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      fontSize: "1.3rem",
      fontFamily: "Outfit !important",
      fontWeight: "600",
      color: "#16283F",
    },
    "& .MuiTypography-h5": {
      fontSize: "1rem",
      fontFamily: "Jost !important",
      fontWeight: "400",
      color: "#16283F",
    },
    "& .MuiFormLabel-root": {
      margin: "1rem 0 0.5rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      fontSize: "0.875rem",
    },
  },
  kycpopup: {
    position: "relative",
    top: "100px",
    margin: "0 auto",
    width: "60%",

    borderRadius: "5px",
    "& .MuiTypography-h6": {
      fontSize: "1.3rem",
      fontFamily: "Outfit !important",
      fontWeight: "600",
      color: "#16283F",
    },
    "& .MuiTypography-h5": {
      fontSize: "1rem",
      fontFamily: "Jost !important",
      fontWeight: "400",
      color: "#16283F",
    },
    "& .MuiFormLabel-root": {
      margin: "1rem 0 0.5rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      fontSize: "0.875rem",
    },
  },
  quizzpopup: {
    position: "relative",
    top: "350px",
    margin: "0 auto",
    width: "30%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    padding: "2rem",
    "& .MuiTypography-h6": {
      fontSize: "1.3rem",
      fontFamily: "Outfit !important",
      fontWeight: "600",
      color: "#16283F",
    },
    "& .MuiTypography-h5": {
      fontSize: "1rem",
      fontFamily: "Jost !important",
      fontWeight: "400",
      color: "#16283F",
    },
    "& .MuiFormLabel-root": {
      margin: "1rem 0 0.5rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      // fontSize: "0.875rem",
    },
    "& .MuiFormLabel-root": {
      margin: "0.5rem  0.5rem 0",
    },
  },
  ebookpopup: {
    position: "relative",
    maxHeight: "auto",
    margin: "auto",
    width: "40%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      fontSize: "1.3rem",
      fontFamily: "Outfit !important",
      fontWeight: "600",
      color: "#16283F",
    },
    "& .MuiTypography-h5": {
      fontSize: "1rem",
      fontFamily: "Jost !important",
      fontWeight: "400",
      color: "#16283F",
    },
    "& .MuiFormLabel-root": {
      margin: "1rem 0 0.5rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      // padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      // fontSize: "0.875rem",
    },
    "& .MuiFormLabel-root": {
      margin: "0.5rem  0.5rem 0",
    },
    "& .MuiDivider-flexItem": {
      height: "35px",
      alignSelf: "center",
      marginLeft: "1rem",
    },
    "& .MuiFormGroup-root": {
      display: "flex",
      flexDirection: "row",
    },
    "& .MuiTypography": {
      fontsize: "0.5rem",
    },
    "& .MuiAutocomplete-input": {
      padding: "2px !important",
    },
    "& .MuiAutocomplete-popupIndicator": {
      padding: "2px !important",
    },
  },
  notespopup: {
    position: "relative",
    maxHeight: "auto",
    margin: "auto",
    width: "40%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      fontSize: "1.3rem",
      fontFamily: "Outfit !important",
      fontWeight: "600",
      color: "#16283F",
    },
    "& .MuiTypography-h5": {
      fontSize: "1rem",
      fontFamily: "Jost !important",
      fontWeight: "400",
      color: "#16283F",
    },
    "& .MuiFormLabel-root": {
      margin: "1rem 0 0.5rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      // padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      // fontSize: "0.875rem",
    },
    "& .MuiFormLabel-root": {
      margin: "0.5rem  0.5rem 0",
    },
    "& .MuiDivider-flexItem": {
      height: "35px",
      alignSelf: "center",
      marginLeft: "1rem",
    },
    "& .MuiFormGroup-root": {
      display: "flex",
      flexDirection: "row",
    },
    "& .MuiTypography": {
      fontsize: "0.5rem",
    },
    "& .MuiAutocomplete-input": {
      padding: "2px !important",
    },
    "& .MuiAutocomplete-popupIndicator": {
      padding: "2px !important",
    },
  },
  dropdownpopup: {
    position: "relative",
    maxHeight: "auto",
    margin: "auto",
    width: "30%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      fontSize: "1.3rem",
      fontFamily: "Outfit !important",
      fontWeight: "600",
      color: "#16283F",
    },
    "& .MuiTypography-h5": {
      fontSize: "1rem",
      fontFamily: "Jost !important",
      fontWeight: "400",
      color: "#16283F",
    },
    "& .MuiFormLabel-root": {
      margin: "1rem 0 0.5rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      // fontSize: "0.875rem",
    },
    "& .MuiFormLabel-root": {
      margin: "0.5rem  0.5rem 0",
    },
    "& .MuiDivider-flexItem": {
      height: "35px",
      alignSelf: "center",
      marginLeft: "1rem",
    },
    "& .MuiFormGroup-root": {
      display: "flex",
      flexDirection: "row",
    },
    "& .MuiTypography": {
      fontsize: "0.5rem",
    },
  },
  notificationdropdowncard: {
    width: "400px",
    // transform: 'translate3d(-300px, 42px, 0px) !important',
    left: "0 !important",
    zIndex: "1500",
    top: "7px !important",
    "& .MuiList-padding": {
      paddingTop: "0",
      paddingBottom: "0",
    },
    "& .MuiPaper-rounded ": {
      borderRadius: "0px",
    },
  },

  // closebtn: {
  //   position: "absolute",
  //   top: "-18px",
  //   right: "-18px",
  //   padding: "0px !important",
  //   backgroundColor: "#FD6E38 !important",
  //   height: "35px",
  //   minWidth: "35px",
  //   borderRadius: "50%",
  //   "&:hover": {
  //     backgroundColor: "#FD6E38 !important313866",
  //   },
  // },

  closebtn: {
    position: "absolute",
    color: "white",
    top: "-18px",
    right: "-18px",
    padding: "0px !important",
    backgroundColor: "#FD6E38 !important",
    height: "35px",
    minWidth: "35px !important",
    borderRadius: "50% !important",
    border: "3px solid #FFF",
    "&:hover": {
      backgroundColor: "#FD6E38 !important313866",
    },
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  notescontentpopup: {
    position: "absolute",
    width: "50vw", // Adjust this width as necessary
    height: "80vh", // Adjust the height as necessary
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    overflowY: "auto", // Allow vertical scrolling
    overflowX: "hidden", // Hide horizontal scrolling
    display: "flex",
    flexDirection: "column", // Stack children vertically
    alignItems: "center", // Center children horizontally
    justifyContent: "center", // Center children vertically if there's space
    maxHeight: "80vh", // Maximum height to ensure it doesn't go off-screen
    maxWidth: "90vw", // Maximum width to ensure it doesn't go off-screen
    borderRadius: theme.shape.borderRadius, // Optional: Apply border radius
  },

  // Ensure content fills the container and does not overflow
  content: {
    width: "100%", // Ensure content does not exceed the popup's width
    maxHeight: "100%", // Limit content height to the popup's height
    overflow: "hidden", // Hide overflow
  },
  viewbtn: {
    background: "#00577B",
    borderRadius: "25px",
    padding: "0.2rem 1.7rem",
    color: "white !important",
    textTransform: "capitalize",
    "&:hover": {
      background: "#00577B",
      color: "black",
    },
  },
  viewallbtn: {
    "&.MuiButton-root": {
      color: "#303030",
      textTransform: "capitalize",
      padding: "0.3rem 1.2rem",
      fontFamily: "Jost",
      fontWeight: "500",
      fontSize: "0.875rem",
    },
  },
  ordersmodal: {
    position: "relative",
    margin: " auto",
    width: "50%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Adjusted for vertical spacing
    color: "#000",
  },
  publishactionpaper: {
    "& .MuiPaper-elevation1": {
      boxShadow: "none !important",
      background: "transparent !important",
    },
    "& .MuiIconButton-root": {
      padding: "9px !important",
    },
  },

  //custom tab css starts
  root: {
    flexGrow: 1,
    "& .MuiAppBar-colorPrimary": {
      color: "#000",
      backgroundColor: "#fff",
    },
    "& .MuiTab-textColorInherit.Mui-selected": {
      color: "#FFF",
      backgroundColor: "#FD6E38",
      fontWeight: "600 !important",
    },
    "& .MuiTab-textColorInherit.Mui-disabled": {
      opacity: "1",
    },
    "& .MuiTab-root": {
      minWidth: "30px !important",
    },
    "& .MuiTabScrollButton-root.Mui-disabled": {
      opacity: "0",
    },
    "& .MuiTabScrollButton-root": {
      color: "#000",
      opacity: "1",
    },
    "& .MuiSvgIcon-fontSizeSmall": {
      fontSize: "2rem",
    },
  },
  tab: {
    fontWeight: "600 !important",
    margin: "0.5rem",
    padding: "0.25rem !important",
    fontSize: "0.8rem !important",
    minHeight: "auto !important",
    borderRadius: "6px",
    opacity: 1,
    "&:hover": {
      color: "#252525",
      backgroundColor: "#FFFFFF",
    },
  },
  quillcontainer: {
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    borderTop: "3px solid rgb(20, 106, 142)",
    padding: "20px",
  },
  formquestion: {
    // border: "1px solid grey",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0px 6px 40px rgba(0, 0, 0, 0.06) !important",
  },
  spinnerContainer: {
    position: "absolute",
    marginTop: "1rem",
  },

  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },

  upgradetable: {
    "& .MuiTableCell-root": {
      borderBottom: "0",
    },
    "&.MuiPaper-elevation1": {
      boxShadow: "none",
    },
  },
  buttonGroup: {
    margin: "0 auto",
    width: "80% !important",
    padding: "0.5rem",
    borderRadius: "30px !important",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.10) !important",
    border: "1px solid #055678 !important",
    color: "#055678 !important",
    display: "flex !important",
    justifyContent: "center !important",
    marginTop: "1rem !important",
    "& .MuiButton-outlined": {
      border: "0 !important",
    },
  },
  selectedMonth: {
    "& .MuiButton-label": {
      color: "#055678 !important",
    },
  },
  button: {
    width: "100%",
    border: "1px solid #055678",
  },
  selectedPlan: {
    background: "#F0F9FC !important",
  },
  priceTag: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0",
  },
  selectedPriceTag: {
    borderRadius: "6px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.10) !important",
    border: "1px solid #055678",
    color: "#055678 !important",
  },
  center: {
    // display: "flex",
    // alignItems: "center",
    // justifyContent:'center',
    margin: "-10px 0",
  },
  flexShrink: {
    flexShrink: "0",
  },
}));

export default useStyles;
