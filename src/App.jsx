import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

function App() {
  //default states
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  ///////<----------------- functions ---------------->////////

  // add quantity
  const addQuantity = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // subtract quantity

  const subtractQuantity = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // remove an item from the cart.

  const removeItem = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  // calculate the total price of items in cart
  const calculateTotalPrice = () => {
    if (data) {
      return data.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    }
    return 0;
  };
  console.log(calculateTotalPrice());

  // load data from API and store in state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products/category/electronics"
        );
        const json = await response.json();
        const products = json.map((product) => ({
          ...product,
          quantity: 0,
        }));
        setData(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <header>
        <h2>Shopping Cart</h2>
      </header>
      <div className="container">
        {loading ? (
          <div className="spinner">
            <ClipLoader color="#7312ce" size={64} speedMultiplier={1} />
          </div>
        ) : (
          <div>
            {data.map((item) => (
              <div key={item.id} className="product-div">
                <img src={item.image} className="product-image" />
                <div className="product-description">
                  <p className="product-name">{item.title}</p>
                  <div className="buttons">
                    <p
                      onClick={() => subtractQuantity(item.id)}
                      className="decrease-btn"
                    >
                      -
                    </p>
                    <p>Qty {item.quantity}</p>
                    <p
                      onClick={() => addQuantity(item.id)}
                      className="increase-btn"
                    >
                      +
                    </p>
                  </div>
                </div>
                <div className="product-price">
                  <p>${item.price * item.quantity || item.price}</p>
                  <p
                    onClick={() => removeItem(item.id)}
                    style={{ color: "purple", cursor: "pointer" }}
                  >
                    Remove
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="flex">
            <p>Subotal</p>
            <h5> ${calculateTotalPrice()}</h5>
          </div>
          <div className="flex">
            <p>Shipping Estimate</p>
            <h5> $0</h5>
          </div>
          <div className="flex">
            <p>Tax Estimate</p>
            <h5> ${0.01 * calculateTotalPrice()}</h5>
          </div>
          <div className="flex">
            <h3>Total</h3>
            <h3>
              $
              {Math.round(calculateTotalPrice() + 0.01 * calculateTotalPrice())}
            </h3>
          </div>

          <button>Checkout</button>
        </div>
      </div>
    </>
  );
}

export default App;
