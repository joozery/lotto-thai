import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx"; // เพิ่มไลบรารี xlsx
import "./LottoForm.css";
import lottoImage from "../assets/lotto.jpg";

const LottoForm = () => {
  const [inputs, setInputs] = useState({
    date: "",
    set: "",
  });
  const [totalBoards, setTotalBoards] = useState(900); // จำนวนแผงที่ต้องการ
  const canvasRef = useRef(null);

  // ฟังก์ชันสุ่มตัวเลข 4 หลักแบบไม่ซ้ำ
  const generateRandomNumbers = (numBoards) => {
    const allNumbers = new Set();
    const boards = [];

    for (let i = 0; i < numBoards; i++) {
      const board = [];
      while (board.length < 10) {
        const randomNum = Math.floor(1000 + Math.random() * 9000); // สุ่มเลข 4 หลัก
        if (!allNumbers.has(randomNum)) {
          board.push(randomNum);
          allNumbers.add(randomNum); // บันทึกตัวเลขที่ใช้แล้ว
        }
      }
      boards.push(board);
    }
    return boards;
  };

  // ฟังก์ชันสำหรับวาดภาพทีละแผง
  const drawCanvas = (board, boardNumber) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = lottoImage;

    return new Promise((resolve) => {
      image.onload = () => {
        // ตั้งค่า canvas ให้มีขนาดเล็กลง (ลดขนาด 50%)
        const scale = 0.5;
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        // วาดภาพพื้นหลัง (ลดขนาด)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // ตั้งค่าฟอนต์
        ctx.fillStyle = "black";
        ctx.font = `${Math.floor(40 * scale)}px Prompt`;

        // วาดข้อมูลวันที่ แผง และชุด
        if (inputs.date.trim() !== "")
          ctx.fillText(` ${inputs.date}`, 105, 330);
        ctx.fillText(` ${String(boardNumber).padStart(3, "0")}`, 325, 330);
        if (inputs.set.trim() !== "") ctx.fillText(` ${inputs.set}`, 450, 330);

        // วาดตัวเลข (ลดขนาดฟอนต์และตำแหน่ง)
        ctx.font = `${Math.floor(70 * scale)}px Prompt`;
        const positions = [
          { x: 45, y: 457 },
          { x: 290, y: 457 },
          { x: 45, y: 515 },
          { x: 290, y: 515 },
          { x: 45, y: 575 },
          { x: 290, y: 575 },
          { x: 45, y: 635 },
          { x: 290, y: 635 },
          { x: 45, y: 695 },
          { x: 290, y: 695 },
        ];

        board.forEach((num, index) => {
          const { x, y } = positions[index];
          ctx.fillText(num, x, y);
        });

        // แปลงเป็น Blob พร้อมกำหนดคุณภาพ
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/png",
          0.8 // ลดคุณภาพภาพ PNG ลงเล็กน้อย
        );
      };
    });
  };

  // ฟังก์ชันสำหรับดาวน์โหลดภาพและ Excel ใน ZIP
  const downloadAllBoards = async () => {
    const boards = generateRandomNumbers(totalBoards);
    const zip = new JSZip();

    // สร้างไฟล์ Excel
    const excelData = boards.map((board, index) => ({
      แผงที่: String(index + 1).padStart(3, "0"),
      เลขช่องที่1: board[0],
      เลขช่องที่2: board[1],
      เลขช่องที่3: board[2],
      เลขช่องที่4: board[3],
      เลขช่องที่5: board[4],
      เลขช่องที่6: board[5],
      เลขช่องที่7: board[6],
      เลขช่องที่8: board[7],
      เลขช่องที่9: board[8],
      เลขช่องที่10: board[9],
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lotto Boards");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    zip.file("lotto_boards.xlsx", excelBuffer);

    // สร้างภาพทั้งหมดพร้อมกันด้วย Promise.all
    const imagePromises = boards.map((board, index) =>
      drawCanvas(board, index + 1).then((blob) => {
        const fileName = `board-${String(index + 1).padStart(3, "0")}.png`;
        zip.file(fileName, blob); // เพิ่ม Blob ลงใน ZIP
      })
    );

    // รอให้สร้างภาพทั้งหมดเสร็จ
    await Promise.all(imagePromises);

    // สร้าง ZIP และดาวน์โหลด
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "lotto_boards_with_excel.zip");
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="lotto-form">
      <h1>ระบบสุ่มตัวเลข LOTTO THAI</h1>
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
          <label>ชุด</label>
          <input
            type="text"
            name="set"
            value={inputs.set}
            onChange={handleInputChange}
          />
        </div>
        <label>จำนวนแผงที่ต้องการ</label>
        <input
          type="number"
          value={totalBoards}
          onChange={(e) => setTotalBoards(Number(e.target.value))}
          min="1"
          max="900" // กำหนดจำนวนสูงสุด
          style={{ padding: "10px", fontSize: "16px", marginBottom: "20px" }}
        />
        <button className="save-btn" onClick={downloadAllBoards}>
          สุ่มและดาวน์โหลดทั้งหมด
        </button>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default LottoForm;
