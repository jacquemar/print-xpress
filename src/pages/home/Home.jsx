import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Footer, Categorie } from "../../components";
import ShoppingList from "../../components/ShoppingList";
import { addToCart } from "../../redux/actions";
import banner1 from "../../assets/banner2.jpg"

const Home = () => {
  const dispatch = useDispatch();
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };
  return (
    <div>
      <div className="bg-gray-25">
        <Header />
        <Categorie />
    <div className=" text-center mx-6">
      <img src={banner1} className="rounded-2xl" alt="" />
    </div>

        <ShoppingList addToCart={handleAddToCart} />
      </div>
      <Footer />
    </div>
  );
};
export default Home;
