import React, { useState, useRef, useEffect } from "react";
import "./LottoForm.css";
import lottoImage from "../assets/lotto.jpg";

const LottoForm = () => {
  const [inputs, setInputs] = useState({
    date: "",
    plan: "",
    set: "",
    numbers: Array(10).fill(""), // 10 ช่องกรอกตัวเลข
  });

  const canvasRef = useRef(null);

  // ฟังก์ชันสำหรับวาดภาพตัวอย่าง
  const updateCanvasPreview = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load the image onto the canvas
    const image = new Image();
    image.src = lottoImage;
    image.onload = () => {
      // Set canvas size to match the image
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image
      ctx.drawImage(image, 0, 0);

      // ตั้งค่าฟอนต์ทั่วไป
      ctx.fillStyle = "black";

      // วาดข้อความสำหรับ "งวดวันที่", "แผง", และ "ชุด"
      ctx.font = "bold 40px Prompt"; // ขนาด 50px ตัวหนา
      if (inputs.date.trim() !== "")
        ctx.fillText(` ${inputs.date}`, 210, 660);
      if (inputs.plan.trim() !== "")
        ctx.fillText(` ${inputs.plan}`, 650, 660);
      if (inputs.set.trim() !== "")
        ctx.fillText(` ${inputs.set}`, 895, 660);

      // วาดตัวเลขในช่องกรอก
      ctx.font = "bold 70px Prompt"; // ขนาด 40px ตัวหนา
      const positions = [
        { x: 90, y: 915 },
        { x: 580, y: 915 },
        { x: 90, y: 1030 },
        { x: 580, y: 1030 },
        { x: 90, y: 1150 },
        { x: 580, y: 1150 },
        { x: 90, y: 1270 },
        { x: 580, y: 1270 },
        { x: 90, y: 1390 },
        { x: 580, y: 1390 },
      ];

      inputs.numbers.forEach((num, index) => {
        if (num.trim() !== "") {
          const { x, y } = positions[index];
          ctx.fillText(num, x, y);
        }
      });
    };
  };

  useEffect(() => {
    // อัปเดตตัวอย่างเมื่อข้อมูลเปลี่ยนแปลง
    updateCanvasPreview();
  }, [inputs]);

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedNumbers = [...inputs.numbers];
      updatedNumbers[index] = value;
      setInputs({ ...inputs, numbers: updatedNumbers });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const handleSaveToImage = () => {
    const canvas = canvasRef.current;

    // Trigger download
    const link = document.createElement("a");
    link.download = "lotto-result.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="lotto-form">
      <h1>ระบบกรอกตัวเลข LOTTO THAI</h1>
      <div className="form-container">
        <div className="image-section">
          <canvas ref={canvasRef} className="canvas-preview"></canvas>
        </div>
        <div className="form-section">
          <div className="input-group">
            <label>งวดวันที่</label>
            <input
              type="text"
              name="date"
              value={inputs.date}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>แผง</label>
            <input
              type="text"
              name="plan"
              value={inputs.plan}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>ชุด</label>
            <input
              type="text"
              name="set"
              value={inputs.set}
              onChange={handleInputChange}
            />
          </div>
          <div className="number-section">
            <label>กรอกตัวเลข</label>
            <div className="number-grid">
              {inputs.numbers.map((num, index) => (
                <input
                  key={index}
                  type="text"
                  value={num}
                  onChange={(e) => handleInputChange(e, index)}
                />
              ))}
            </div>
          </div>
          <button className="save-btn" onClick={handleSaveToImage}>
            บันทึกและดาวน์โหลดรูปภาพ
          </button>
        </div>
      </div>
    </div>
  );
};

export default LottoForm;
