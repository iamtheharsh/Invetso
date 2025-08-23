// import React, { useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import GeneralContext from "./GeneralContext";

// import "./BuyActionWindow.css";

// const BuyActionWindow = ({ uid }) => {
//   const [stockQuantity, setStockQuantity] = useState(1);
//   const [stockPrice, setStockPrice] = useState(0.0);

//   const handleBuyClick = async () => {
//     try {
//       await axios.post("http://localhost:3002/newOrder", {
//         name: uid,
//         qty: stockQuantity,
//         price: stockPrice,
//         mode: "BUY",
//       });

//       // refresh holdings from backend
//       if (GeneralContext.refreshHoldings) {
//         GeneralContext.refreshHoldings();
//       }

//       GeneralContext.closeBuyWindow();
//     } catch (error) {
//       console.error("Error placing order:", error);
//     }
//   };

//   const handleCancelClick = () => {
//     GeneralContext.closeBuyWindow();
//   };

//   return (
//     <div className="container" id="buy-window" draggable="true">
//       <div className="regular-order">
//         <div className="inputs">
//           <fieldset>
//             <legend>Qty.</legend>
//             <input
//               type="number"
//               name="qty"
//               id="qty"
//               onChange={(e) => setStockQuantity(e.target.value)}
//               value={stockQuantity}
//             />
//           </fieldset>
//           <fieldset>
//             <legend>Price</legend>
//             <input
//               type="number"
//               name="price"
//               id="price"
//               step="0.05"
//               onChange={(e) => setStockPrice(e.target.value)}
//               value={stockPrice}
//             />
//           </fieldset>
//         </div>
//       </div>

//       <div className="buttons">
//         <span>Margin required ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
//         <div>
//           <Link className="btn btn-blue" onClick={handleBuyClick}>
//             Buy
//           </Link>
//           <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
//             Cancel
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BuyActionWindow;
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0);
  const { closeBuyWindow, triggerRefresh } = useContext(GeneralContext);

  const placeOrder = async (mode) => {
    try {
      await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode,
      });
      // refresh holdings and close
      triggerRefresh();
      closeBuyWindow();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="buy-window">
      <div className="header">
        <h4>{uid}</h4>
        <button className="close" onClick={closeBuyWindow}>&times;</button>
      </div>

      <div className="form">
        <div className="row">
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            step="1"
            onChange={(e) => setStockQuantity(e.target.value)}
            value={stockQuantity}
          />
        </div>
        <div className="row">
          <label>Price</label>
          <input
            type="number"
            min="0"
            step="0.05"
            onChange={(e) => setStockPrice(e.target.value)}
            value={stockPrice}
          />
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(Number(stockQuantity) * Number(stockPrice)).toFixed(2)}</span>
        <div>
          <Link className="btn btn-blue" onClick={() => placeOrder("BUY")}>Buy</Link>
          <Link className="btn btn-grey" onClick={() => placeOrder("SELL")}>Sell</Link>
          <Link className="btn btn-grey" onClick={closeBuyWindow}>Cancel</Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
