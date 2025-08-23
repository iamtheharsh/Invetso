// import React, { useState, useEffect } from "react";
// import axios, { all } from "axios";
// import { VerticalGraph } from "./VerticalGraph";

// // import { holdings } from "../data/data";

// const Holdings = () => {
//   const [allHoldings, setAllHoldings] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:3002/allHoldings").then((res) => {
//       // console.log(res.data);
//       setAllHoldings(res.data);
//     }); 
//   }, []);

//   // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//   const labels = allHoldings.map((subArray) => subArray["name"]);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Stock Price",
//         data: allHoldings.map((stock) => stock.price),
//         backgroundColor: "rgba(255, 99, 132, 0.5)",
//       },
//     ],
//   };

//   // export const data = {
//   //   labels,
//   //   datasets: [
//   // {
//   //   label: 'Dataset 1',
//   //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//   //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
//   // },
//   //     {
//   //       label: 'Dataset 2',
//   //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//   //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//   //     },
//   //   ],
//   // };

//   return (
//     <>
//       <h3 className="title">Holdings ({allHoldings.length})</h3>

//       <div className="order-table">
//         <table>
//           <tr>
//             <th>Instrument</th>
//             <th>Qty.</th>
//             <th>Avg. cost</th>
//             <th>LTP</th>
//             <th>Cur. val</th>
//             <th>P&L</th>
//             <th>Net chg.</th>
//             <th>Day chg.</th>
//           </tr>

//           {allHoldings.map((stock, index) => {
//             const curValue = stock.price * stock.qty;
//             const isProfit = curValue - stock.avg * stock.qty >= 0.0;
//             const profClass = isProfit ? "profit" : "loss";
//             const dayClass = stock.isLoss ? "loss" : "profit";

//             return (
//               <tr key={index}>
//                 <td>{stock.name}</td>
//                 <td>{stock.qty}</td>
//                 <td>{stock.avg.toFixed(2)}</td>
//                 <td>{stock.price.toFixed(2)}</td>
//                 <td>{curValue.toFixed(2)}</td>
//                 <td className={profClass}>
//                   {(curValue - stock.avg * stock.qty).toFixed(2)}
//                 </td>
//                 <td className={profClass}>{stock.net}</td>
//                 <td className={dayClass}>{stock.day}</td>
//               </tr>
//             );
//           })}
//         </table>
//       </div>

//       <div className="row">
//         <div className="col">
//           <h5>
//             29,875.<span>55</span>{" "}
//           </h5>
//           <p>Total investment</p>
//         </div>
//         <div className="col">
//           <h5>
//             31,428.<span>95</span>{" "}
//           </h5>
//           <p>Current value</p>
//         </div>
//         <div className="col">
//           <h5>1,553.40 (+5.20%)</h5>
//           <p>P&L</p>
//         </div>
//       </div>
//       <VerticalGraph data={data} />
//     </>
//   );
// };

// export default Holdings;

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import GeneralContext from "./GeneralContext";

// const currency = (n) => {
//   const v = Number(n || 0);
//   return v.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
// };

// const Holdings = () => {
//   const [holdings, setHoldings] = useState([]);
//   const { refreshKey } = useContext(GeneralContext);

//   const fetchHoldings = async () => {
//     const res = await axios.get("http://localhost:3002/allHoldings");
//     setHoldings(res.data || []);
//   };

//   useEffect(() => {
//     fetchHoldings();
//     // re-fetch on refreshKey change
//   }, [refreshKey]);

//   // Derived totals
//   const totals = holdings.reduce(
//     (acc, h) => {
//       const qty = Number(h.qty || 0);
//       const avg = Number(h.avg || 0);
//       const ltp = Number(h.price || 0);
//       const invested = qty * avg;
//       const current = qty * ltp;
//       const pnl = current - invested;
//       acc.invested += invested;
//       acc.current += current;
//       acc.pnl += pnl;
//       return acc;
//     },
//     { invested: 0, current: 0, pnl: 0 }
//   );

//   const pnlPct = totals.invested > 0 ? (totals.pnl / totals.invested) * 100 : 0;

//   return (
//     <div className="holdings">
//       <div className="summary-cards">
//         <div className="card">
//           <h5>₹{currency(totals.invested)}</h5>
//           <p>Invested</p>
//         </div>
//         <div className="card">
//           <h5>₹{currency(totals.current)}</h5>
//           <p>Current value</p>
//         </div>
//         <div className="card">
//           <h5>
//             ₹{currency(totals.pnl)} ({pnlPct.toFixed(2)}%)
//           </h5>
//           <p>P&amp;L</p>
//         </div>
//       </div>

//       <table className="table">
//         <thead>
//           <tr>
//             <th>Stock</th>
//             <th>Qty</th>
//             <th>Avg</th>
//             <th>LTP</th>
//             <th>Cur. Val</th>
//             <th>P&amp;L</th>
//             <th>P&amp;L %</th>
//           </tr>
//         </thead>
//         <tbody>
//           {holdings.map((h, idx) => {
//             const qty = Number(h.qty || 0);
//             const avg = Number(h.avg || 0);
//             const ltp = Number(h.price || 0);
//             const cur = qty * ltp;
//             const invested = qty * avg;
//             const pnl = cur - invested;
//             const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
//             const isProfit = pnl >= 0;
//             return (
//               <tr key={idx} className={isProfit ? "profit" : "loss"}>
//                 <td>{h.name}</td>
//                 <td>{qty}</td>
//                 <td>₹{currency(avg)}</td>
//                 <td>₹{currency(ltp)}</td>
//                 <td>₹{currency(cur)}</td>
//                 <td>₹{currency(pnl)}</td>
//                 <td>{pnlPct.toFixed(2)}%</td>
//               </tr>
//             );
//           })}
//           {holdings.length === 0 && (
//             <tr>
//               <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
//                 No holdings yet
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Holdings;

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
// import { VerticalGraph } from "./VerticalGraph";
import VerticalGraph from "./VerticalGraph";
 // ✅ bring back graph

const currency = (n) => {
  const v = Number(n || 0);
  return v.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
};

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const { refreshKey } = useContext(GeneralContext);

  const fetchHoldings = async () => {
    const res = await axios.get("http://localhost:3002/allHoldings");
    setHoldings(res.data || []);
  };

  useEffect(() => {
    fetchHoldings();
  }, [refreshKey]);

  // Derived totals
  const totals = holdings.reduce(
    (acc, h) => {
      const qty = Number(h.qty || 0);
      const avg = Number(h.avg || 0);
      const ltp = Number(h.price || 0);
      const invested = qty * avg;
      const current = qty * ltp;
      const pnl = current - invested;
      acc.invested += invested;
      acc.current += current;
      acc.pnl += pnl;
      return acc;
    },
    { invested: 0, current: 0, pnl: 0 }
  );

  const pnlPct = totals.invested > 0 ? (totals.pnl / totals.invested) * 100 : 0;

  // ✅ Graph data
  const labels = holdings.map((h) => h.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: holdings.map((h) => h.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="holdings">
      <div className="summary-cards">
        <div className="card">
          <h5>₹{currency(totals.invested)}</h5>
          <p>Invested</p>
        </div>
        <div className="card">
          <h5>₹{currency(totals.current)}</h5>
          <p>Current value</p>
        </div>
        <div className="card">
          <h5>
            ₹{currency(totals.pnl)} ({pnlPct.toFixed(2)}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>

      {/* Table same as before */}
      <table className="table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Qty</th>
            <th>Avg</th>
            <th>LTP</th>
            <th>Cur. Val</th>
            <th>P&amp;L</th>
            <th>P&amp;L %</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h, idx) => {
            const qty = Number(h.qty || 0);
            const avg = Number(h.avg || 0);
            const ltp = Number(h.price || 0);
            const cur = qty * ltp;
            const invested = qty * avg;
            const pnl = cur - invested;
            const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
            const isProfit = pnl >= 0;
            return (
              <tr key={idx} className={isProfit ? "profit" : "loss"}>
                <td>{h.name}</td>
                <td>{qty}</td>
                <td>₹{currency(avg)}</td>
                <td>₹{currency(ltp)}</td>
                <td>₹{currency(cur)}</td>
                <td>₹{currency(pnl)}</td>
                <td>{pnlPct.toFixed(2)}%</td>
              </tr>
            );
          })}
          {holdings.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                No holdings yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Vertical graph below table */}
      <div className="graph-container">
        <VerticalGraph data={data} />
      </div>
    </div>
  );
};

export default Holdings;
