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
      <a href="#"  data-button="status" data-id="${item.id}" data-paid="${
      item.paid
    }">${item.paid ? "已處理" : "未處理"}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-button="del" data-id="${
        item.id
      }" />
    </td>
  </tr>`;
  });

  ordersDataWrap.innerHTML =
    ordersData.length > 0
      ? ordersDataStr
      : "<p style='padding: 12px'>目前沒有訂單資料</p>";

  sortOrderData();
}
renderOrdersTable();

// 清除所有訂單
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", function (e) {
  Swal.fire({
    title: "您確定要刪除所有訂單?",
    text: "刪除後無法回復!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6a33f8",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
  }).then(async (result) => {
    if (result.isConfirmed) {
      deleteAllOrders(e);
    }
  });
});

function deleteAllOrders(e) {
  e.preventDefault();
  try {
    const res = axios.delete(url, headers);
    renderOrdersTable();
  } catch (error) {
    console.log(error);
  }
}

// 監聽按鈕 (訂單狀態 & 刪除)
ordersDataWrap.addEventListener("click", (e) => {
  e.preventDefault();

  const { id, button } = e.target.dataset;

  if (button == "del") {
    Swal.fire({
      title: "您確定要刪除此訂單?",
      text: "刪除後無法回復!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6a33f8",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
    }).then(async (result) => {
      if (result.isConfirmed) {
        delSingleOrder(id);
      }
    });
  } else if (button == "status") {
    const { paid } = e.target.dataset;
    updateOrderStatus(id, paid === "true");
  }
});

// 清除單筆訂單
async function delSingleOrder(id) {
  try {
    const res = await axios.delete(`${url}/${id}`, headers);
    renderOrdersTable();
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
}

// 修改訂單狀態
async function updateOrderStatus(id, paidStatus) {
  try {
    const res = await axios.put(
      url,
      {
        data: {
          id: id,
          paid: !paidStatus,
        },
      },
      headers
    );

    renderOrdersTable();
  } catch (error) {
    console.log(error);
  }
}

// render C3 LV2
function sortOrderData() {
  console.log(ordersData);
  let total = {};

  ordersData.forEach((item) => {
    item.products.forEach((productItem) => {
      if (total[productItem.title] == undefined) {
        total[productItem.title] = productItem.price * productItem.quantity;
      } else {
        total[productItem.title] += productItem.price * productItem.quantity;
      }
    });
  });

  // 資料格式調整
  let columnsData = [];
  let productItems = Object.keys(total);
  productItems.forEach((productItem) => {
    let ary = [];
    ary.push(productItem);
    ary.push(total[productItem]);
    columnsData.push(ary);
  });

  // 排序
  columnsData.sort((a, b) => b[1] - a[1]); // 大到小: b - a

  let newData = [];
  let others = ["其他", 0];
  columnsData.forEach((item, index) => {
    if (index < 3) {
      newData.push(item);
    } else {
      others[1] += item[1];
    }
  });
  newData.push(others);

  renderC3(newData);
}

// C3.js
function renderC3(data) {
  let colorList = ["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"];
  let colorSetting = {};
  data.forEach((item, index) => {
    colorSetting[item[0]] = colorList[index];
  });

  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: data,
      colors: colorSetting,
    },
  });
}
