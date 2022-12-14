import React from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/main";
import { Home } from "./views/home";
import { Nft } from "./views/Nft";
import Punk from "./views/punk";

function App() {
  return (
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nft" exact element={<Nft />} />
          <Route path="/nft/:tokenId" element={<Punk />} />
        </Routes>
      </MainLayout>
  );
}

export default App;
