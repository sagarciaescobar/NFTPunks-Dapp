import React from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/main";
import { Home } from "./views/home";

function App() {
  return (
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MainLayout>
  );
}

export default App;
