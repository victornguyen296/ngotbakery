/**
 * DÁN TOÀN BỘ FILE NÀY VÀO Google Apps Script (Extensions > Apps Script)
 * của Google Sheet dùng làm CMS cho Menu + Blog.
 *
 * Sheet cần có 2 tab, ĐÚNG TÊN:
 *  - "Menu"  cột: id | category | name | description | price | image_url | active
 *  - "Blog"  cột: id | date | category | title | excerpt | content | image_url | active
 * (Hàng 1 là tiêu đề cột, dữ liệu bắt đầu từ hàng 2)
 */

function doGet(e) {
  const type = e.parameter.type;

  if (type === "menu") {
    return jsonResponse(sheetToObjects("Menu"));
  }

  if (type === "blog") {
    return jsonResponse(sheetToObjects("Blog"));
  }

  if (type === "post") {
    const id = e.parameter.id;
    const posts = sheetToObjects("Blog");
    const post = posts.find((p) => String(p.id) === String(id)) || null;
    return jsonResponse(post);
  }

  return jsonResponse({ error: "Thiếu hoặc sai tham số 'type'. Dùng: menu | blog | post" });
}

function sheetToObjects(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map((h) => String(h).trim());
  const rows = values.slice(1);

  return rows
    .filter((row) => row.some((cell) => cell !== "")) // bỏ dòng trống
    .map((row) => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
