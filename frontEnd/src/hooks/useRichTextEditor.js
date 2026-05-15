import { useRef } from "react";

export const useRichTextEditor = () => {
  const editorRef = useRef(null);

  // chèn Icon vào ô nhập
  const insertTextAtcursor = (iconObj, onAfterInsert) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    // Lấy vị trí con trỏ hiện tại
    const range = selection.getRangeAt(0);
    // Tạo phần tử img mới cho icon
    const img = document.createElement("img");
    img.src = iconObj.icon;
    img.alt = `[${iconObj.name}]`;
    img.setAttribute("data-emoji", `[${iconObj.type}]`);
    img.style.width = "22px";
    img.style.height = "22px";
    img.style.verticalAlign = "middle";
    img.style.margin = "0 2px";
    img.style.userSelect = "none";

    // xóa danh sách bôi đen
    range.deleteContents();
    // chèn phần tử img vào vị trí con trỏ
    range.insertNode(img);
    // set con trỏ sau phần tử img vừa chèn
    range.setStartAfter(img);
    range.setEndAfter(img);
    // câp nhật lại selection để con trỏ hiển thị đúng vị trí
    // xóa tất cả các phạm vi hiện tại
    selection.removeAllRanges();
    // thêm phạm vi mới với vị trí con trỏ đã cập nhật
    selection.addRange(range);
    if (onAfterInsert) {
      onAfterInsert();
    }
  };

  const getParsedText = () => {
    let textToSend = "";
    if (editorRef.current) {
      // lấy toàn bộ thành phần bên trong ô nhập
      const nodes = editorRef.current.childNodes;
      // duyệt qua từng thành phần để xây dựng chuỗi text cuối cùng
      nodes.forEach((node) => {
        // nếu là text thuần tí thì cộng dồn vào chuỗi text
        if (node.nodeType === Node.TEXT_NODE) {
          textToSend += node.textContent;
          // nếu là thẻ img có thuộc tính data-emoji thì thay thế bằng text tương ứng
        } else if (node.nodeName === "IMG" && node.hasAttribute("data-emoji")) {
          textToSend += node.getAttribute("data-emoji");
          // nếu là thẻ br hoặc div thì thêm ký tự xuống dòng
        } else if (node.nodeName === "BR" || node.nodeName === "DIV") {
          textToSend += "\n";
        }
      });
    }
    return textToSend;
  };

  const clearEditor = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  return {
    editorRef,
    insertTextAtcursor,
    getParsedText,
    clearEditor,
  };
};
