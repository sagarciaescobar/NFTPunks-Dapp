import React from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/main";
import { Home } from "./views/home";
import { Nft } from "./views/Nft";

function App() {
  return (
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nft" element={<Nft />} />

        </Routes>
      </MainLayout>
  );
}

export default App;
