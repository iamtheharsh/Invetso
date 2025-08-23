// import React, { useState } from "react";
// import BuyActionWindow from "./BuyActionWindow";

// const GeneralContext = React.createContext({
//   openBuyWindow: (uid) => {},
//   closeBuyWindow: () => {},
//   refreshHoldings: () => {}, // ✅ NEW
// });

// export const GeneralContextProvider = (props) => {
//   const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
//   const [selectedStockUID, setSelectedStockUID] = useState("");

//   const handleOpenBuyWindow = (uid) => {
//     setIsBuyWindowOpen(true);
//     setSelectedStockUID(uid);
//   };

//   const handleCloseBuyWindow = () => {
//     setIsBuyWindowOpen(false);
//     setSelectedStockUID("");
//   };

//   const refreshHoldings = () => {
//     window.location.reload(); // ✅ TEMP SOLUTION: reload to update holdings
//   };

//   return (
//     <GeneralContext.Provider
//       value={{
//         openBuyWindow: handleOpenBuyWindow,
//         closeBuyWindow: handleCloseBuyWindow,
//         refreshHoldings,
//       }}
//     >
//       {props.children}
//       {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
//     </GeneralContext.Provider>
//   );
// };

// export default GeneralContext;
import React, { useState, useCallback } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (_uid) => {},
  closeBuyWindow: () => {},
  triggerRefresh: () => {},
  refreshKey: 0,
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const openBuyWindow = useCallback((uid) => {
    setSelectedStockUID(uid);
    setIsBuyWindowOpen(true);
  }, []);

  const closeBuyWindow = useCallback(() => {
    setIsBuyWindowOpen(false);
  }, []);

  const triggerRefresh = useCallback(() => {
    // bump a key so components can re-fetch data
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow,
        closeBuyWindow,
        triggerRefresh,
        refreshKey,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
