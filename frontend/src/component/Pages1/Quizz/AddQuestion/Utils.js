// Utils.js
export function a11yProps(id) {
    return {
      id: `scrollable-auto-tab-${id}`,
      'aria-controls': `scrollable-auto-tabpanel-${id}`,
    };
  }
  