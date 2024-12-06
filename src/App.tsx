import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { InsurancePage, HealthInsurancePage } from "./page";
const App: React.FC = () => (
  <Router>
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<InsurancePage />} />
        <Route path="/health" element={<HealthInsurancePage />} />
      </Routes>
    </div>
  </Router>
);

export default App;

// import { useState } from "react";
// import { LitNodeClient } from "@lit-protocol/lit-node-client";
// import { LIT_NETWORK } from "@lit-protocol/constants";

// function App() {
//   const [litNodeClient, setLitNodeClient] = useState<LitNodeClient | null>(null);

//   const connectToLit = async () => {
//     if (!litNodeClient) {
//       const client = new LitNodeClient({
//         litNetwork: LIT_NETWORK.DatilDev,
//         debug: false,
//       });

//       try {
//         await client.connect();
//         setLitNodeClient(client);
//         console.log("Connected to Lit network!");
//       } catch (error) {
//         console.error("Failed to connect to Lit network:", error);
//       }
//     } else {
//       console.log("Already connected to Lit network.");
//     }
//   };

//   const disconnectFromLit = () => {
//     if (litNodeClient) {
//       litNodeClient.disconnect();
//       setLitNodeClient(null);
//       console.log("Disconnected from Lit network.");
//     }
//   };

//   return (
//     <>
//       <button onClick={connectToLit}>Connect</button>
//       {litNodeClient && (
//         <button onClick={disconnectFromLit} style={{ marginLeft: "10px" }}>
//           Disconnect
//         </button>
//       )}
//     </>
//   );
// }

// export default App;