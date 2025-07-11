import React, { useState } from 'react';

const UnitPriceUpdater = () => {
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState(100); // price per primary unit

  const conversionRates = {
    kg: 1,
    gram: 1 / 1000,
    quintal: 100
  };

  const handleUnitChange = (e) => {
    const selectedUnit = e.target.value;
    setUnit(selectedUnit);

    const conversionRate = conversionRates[selectedUnit];
    const newPrice = 100 * conversionRate;
    setPrice(newPrice);
  };

  return (
    <div>
      <label>Select Unit: </label>
      <select value={unit} onChange={handleUnitChange}>
        <option value="kg">Kg</option>
        <option value="gram">Gram</option>
        <option value="quintal">Quintal</option>
      </select>

      <p>Price: ₹{price.toFixed(2)} per {unit}</p>
    </div>
  );
};

export default UnitPriceUpdater;
