import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesContextProvider } from "./contexts/CitiesContext";

export default function App() {
  return (
    <CitiesContextProvider>
      <HashRouter>
        <Routes>
          <Route index element={<Homepage />} />

          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate replace to={"cities"} />} />
            <Route path="cities" element={<CityList />} />
            <Route path="cities/:id" element={<City />} />
            <Route path="form" element={<Form />} />
            <Route path="countries" element={<CountryList />} />
          </Route>
          <Route path="/product" element={<Product />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </HashRouter>
    </CitiesContextProvider>
  );
}
