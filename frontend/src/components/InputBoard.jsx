import React, { useState } from "react";
import "./InputBoard.css";

const InputBoard = () => {
  const [data, setData] = useState(
    Array(6)
      .fill(0)
      .map(() => ["", ""])
  );

  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][colIndex] = value;
    setData(updatedData);
  };

  return (
    <div className="input-board">
      <h2>กรอกตัวเลข</h2>
      {data.map((row, rowIndex) => (
        <div className="input-row" key={rowIndex}>
          {row.map((value, colIndex) => (
            <input
              key={colIndex}
              className="input-box"
              value={value}
              onChange={(e) =>
                handleInputChange(rowIndex, colIndex, e.target.value)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default InputBoard;
