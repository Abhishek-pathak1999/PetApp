export const getWidthInPercentage = (v : any) => {
    const p = ((v * 100) / 360);
    return p + "%";
  };
  export const getHeightInPercentage = (v : any) => {
    const p = ((v * 100) / 800);
    return p + "%";
  };

  export const getTopInPercentage = (v : any) => {
    const p = ((v * 100) / window.innerHeight);
    return p + "%";
  };

  // export const getHeightInPercentage = (v : any) => {
  //   const p = ((v * 100) / window.innerHeight);
  //   return p + "%";
  // };