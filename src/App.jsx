import { useEffect, useState } from "react";
import moment from "moment";

const CURRENCIES = ["CAD", "IDR", "JPY", "CHF", "EUR", "USD"];
const DISCOUNT = 5; // in percentage
const BASE_CURRENCY = "USD";
const DECIMAL_DIGITS = 3;
const BASE_URL = "https://api.currencyfreaks.com/v2.0/rates/latest";
const API_KEY = "09612463712348a799cfb880bcbd49d9";

function App() {
  const [rateData, setRateData] = useState(null);

  useEffect(() => {
    getRateData();
  }, []);

  const getRateData = async () => {
    const symbols = CURRENCIES.join(",");
    const url = `${BASE_URL}?apikey=${API_KEY}&symbols=${symbols}&base=${BASE_CURRENCY}`;
    const data = await fetch(url);
    const jsonData = await data.json();
    setRateData(jsonData);
  };

  const handleBuy = (rate) => {
    return ((rate * (100 + DISCOUNT)) / 100).toFixed(DECIMAL_DIGITS);
  };

  const handleSell = (rate) => {
    return ((rate * (100 - DISCOUNT)) / 100).toFixed(DECIMAL_DIGITS);
  };

  const handleRealRate = (rate) => {
    return parseFloat(rate).toFixed(3);
  };

  return (
    <div
      id="App"
      className="bg-light vh-100 d-flex justify-content-center align-items-center"
    >
      <main className="card bg-white border-0 mx-2 mx-sm-3 mx-md-0 px-2 px-sm-3 px-md-5 py-4 rounded shadow">
        <h1 className="text-center fw-bold">Exchange Rate</h1>
        <p className="text-center">{rateData?.base ?? BASE_CURRENCY}</p>
        <p className="text-center">
          {rateData && moment(rateData.date).format("DD-MM-YYYY HH:mm:ss")}
        </p>
        {!rateData && (
          <div className="alert alert-dark text-center" role="alert">
            Loading...
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-responsive table-borderless">
            <thead>
              <tr>
                <th className="bg-transparent p-2"></th>
                <th className="bg-transparent p-2 text-center">WE BUY</th>
                <th className="bg-transparent p-2 text-center">
                  EXCHANGE RATE
                </th>
                <th className="bg-transparent p-2 text-center">WE SELL</th>
              </tr>
            </thead>
            <tbody>
              {CURRENCIES.map((cur) => (
                <tr key={cur}>
                  <th className="bg-transparent p-2">{cur}</th>
                  <td className="bg-transparent p-2 text-center">
                    {(rateData &&
                      rateData?.rates[cur] &&
                      handleBuy(rateData.rates[cur])) ??
                      "-"}
                  </td>
                  <td className="bg-transparent p-2 text-center">
                    {(rateData &&
                      rateData?.rates[cur] &&
                      handleRealRate(rateData.rates[cur])) ??
                      "-"}
                  </td>
                  <td className="bg-transparent p-2 text-center">
                    {(rateData &&
                      rateData?.rates[cur] &&
                      handleSell(rateData.rates[cur])) ??
                      "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
