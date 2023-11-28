import { Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";

import AddItems from "../Pages/AddItems";
import DisplayItems from "../Pages/DisplayItems";
import DeletePage from "../Pages/DeletePage";
import Detailinfo from "../Pages/Detailinfo";
import EmployeeDisplay from "../Pages/EmployeeDisplay";
import Addorder from "../Pages/AddLoan";
import AddSupplier from "../Pages/AddSupplier";
import DisplaySuppliers from "../Pages/DisplaySuppliers";
import AddOrder from "../Pages/AddOrder";
import DisplayOrders from "../Pages/DisplayOrders";
import DisplayCategory from "../Pages/DisplayCategory";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/inventory" element={<DisplayItems />}></Route>
      <Route path="inventory/add" element={<AddItems />}></Route>
      <Route path="inventory/edit/" element={<AddItems />}></Route>
      <Route path="inventory/delete/:key" element={<DeletePage />}></Route>
      <Route path="inventory/detail/:key" element={<Detailinfo />}></Route>
      <Route path="/suppliers" element={<DisplaySuppliers />}></Route>
      <Route path="supplier/add" element={<AddSupplier />}></Route>
      <Route path="supplier/edit/" element={<AddSupplier />}></Route>
      <Route path="supplier/delete/:key" element={<DeletePage />}></Route>
      <Route path="/orders" element={<DisplayOrders />}></Route>
      <Route path="order/add" element={<AddOrder />}></Route>
      <Route path="order/edit/" element={<AddOrder />}></Route>
      <Route path="order/delete/:key" element={<DeletePage />}></Route>
      <Route path="/loans" element={<Addorder />}></Route>
      <Route path="/customers" element={<EmployeeDisplay />}></Route>
      <Route path="/categorys" element={<DisplayCategory />}></Route>
    </Routes>
  );
}
export default AppRoutes;
