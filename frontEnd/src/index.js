import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux/store";

let isRedirecting = false; // Biến cờ ngăn chặn việc gọi redirect nhiều lần đồng thời

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const url = args[0];
  const response = await originalFetch(...args);

  // Nếu đã trong tiến trình chuyển hướng hoặc là API đăng nhập/đăng ký thì bỏ qua
  if (isRedirecting || (typeof url === "string" && (url.includes("/login") || url.includes("/signup")))) {
    return response;
  }

  if (response.status === 401) {
    isRedirecting = true; // Đánh dấu đang chuyển hướng, chặn các 401 đến sau

    // Tự tạo DOM Element giả lập khối "app-message app-message__err"
    const msgDiv = document.createElement("div");
    msgDiv.className = "app-message app-message__err";
    msgDiv.textContent = "Phiên đăng nhập đã bị vô hiệu hóa. Đang chuyển hướng...";
    document.body.appendChild(msgDiv);

    // Xóa dữ liệu (Giữ lại deviceId)
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    // Thêm class fade-out sau 2.5s
    setTimeout(() => {
      msgDiv.classList.add("fade-out");
    }, 2500);

    // Chờ thông báo chạy xong rồi đá ra ngoài
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);

    return Promise.reject(new Error("Unauthorized"));
  }

  return response;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();