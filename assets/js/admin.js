const { VITE_APP_URL, VITE_APP_PATH, VITE_APP_KEY } = import.meta.env;
let ordersData = [];
const url = `${VITE_APP_URL}/admin/${VITE_APP_PATH}/orders`;
const headers = {
  headers: {
    Authorization: VITE_APP_KEY,
  },
};
async function getOrdersData() {
  try {
    const res = await axios.get(url, headers);
    ordersData = res.data.orders;
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
}
// getOrdersData();

// 渲染表格
const ordersDataWrap = document.querySelector(".ordersDataWrap");
async function renderOrdersTable() {
  await getOrdersData();
  let ordersDataStr = "";

  ordersData.forEach((item) => {
    // 組產品字串
    let productsStr = "";
    item.products.forEach((productItem) => {
      productsStr += `<p>${productItem.title} x${productItem.quantity}</p>`;
    });

    // 時間轉換
    let dateStr = "";
    let date = new Date(item.createdAt * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    dateStr = `${year}/${month}/${day}`;

    ordersDataStr += `<tr>
    <td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
      <p>${productsStr}</p>
    </td>
    <td>${dateStr}</td>
    <td class="orderStatus">
      <a href="#">${item.paid ? "已處理" : "未處理"}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${
        item.id
      }" />
    </td>
  </tr>`;
  });

  ordersDataWrap.innerHTML =
    ordersData.length > 0
      ? ordersDataStr
      : "<p style='padding: 12px'>目前沒有訂單資料</p>";
}
renderOrdersTable();

// 清除所有訂單
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", deleteAllOrders);

function deleteAllOrders() {
  try {
    const res = axios.delete(url, headers);
    renderOrdersTable();
  } catch (error) {
    console.log(error);
  }
}

ordersDataWrap.addEventListener("click", (e) => {
  e.preventDefault();
  const orderId = e.target.dataset.id;
  if (orderId) {
    delSingleOrder(orderId);
  }
});

async function delSingleOrder(id) {
  try {
    const res = await axios.delete(`${url}/${id}`, headers);
    renderOrdersTable();
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
}

// C3.js
let chart = c3.generate({
  bindto: "#chart", // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ["Louvre 雙人床架", 1],
      ["Antony 雙人床架", 2],
      ["Anty 雙人床架", 3],
      ["其他", 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      其他: "#301E5F",
    },
  },
});
