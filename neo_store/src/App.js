import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from "./components/ErrorBoundry"
import "./App.css"
const Login = lazy(() => import('./components/Login'))
const Registration = lazy(() => import('./components/Registration'))
const Cart = lazy(() => import('./components/Cart'))
const Checkout = lazy(() => import('./components/Checkout'))
const Forgetpassword = lazy(() => import('./components/Forgetpassword'))
const Order = lazy(() => import('./components/Order'))
const Product = lazy(() => import('./components/Product'))
const Profile = lazy(() => import('./components/Profile'))
const Home = lazy(() => import('./components/Home'))
const Address = lazy(() => import('./components/Address'))
const Account = lazy(() => import('./components/Account'))
const ProductDetails = lazy(() => import('./components/ProductDetails'))
const ChangePassword = lazy(() => import('./components/ChangePassword'))
const Invoice = lazy(() => import('./components/Invoice'))

function App() {
  return (
    <>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={
            <img src="./images/loding.gif" className="images" alt="..."
              width="100%" height='700px'></img>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/forgetpassword" element={<Forgetpassword />} />
              <Route path="/ProductDetails" element={<ProductDetails />} />
              <Route path="/product" element={<Product />} />
              <Route path="/Invoice" element={<Invoice />} />
              <Route path="/account" element={<Account />}>
                <Route path="order" element={<Order />} />
                <Route path="address" element={<Address />} />
                <Route path="profile" element={<Profile />} />
                <Route path="changepassword" element={<ChangePassword />} />
              </Route>
              <Route path="*" element={<img width="100%" height="657px" src="./images/notfound.gif" alt="not found" />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </>
  );
}

export default App;
