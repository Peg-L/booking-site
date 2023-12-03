const { VITE_APP_URL, VITE_APP_PATH, VITE_APP_KEY } = import.meta.env;

const productWrap = document.querySelector(".productWrap");
let productsData = [];

const productSelect = document.querySelector(".productSelect");
let selectTarget = "全部";

//// 處理產品列表
async function handleProductsList() {
  await getProductsData();
  renderProductsList();
  filterProducts();
}
handleProductsList();

// -取得產品資料
async function getProductsData() {
  try {
    const res = await axios.get(
      `${VITE_APP_URL}/customer/${VITE_APP_PATH}/products`
    );
    productsData = res.data.products;
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
}

// -渲染產品列表
function renderProductsList() {
  let productListEl = "";

  productsData.forEach((product) => {
    productListEl += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${product.images}"
      alt="${product.title}"
    />
    <a href="#" class="addCardBtn" data-id="${product.id}">加入購物車</a>
    <h3>${product.title}</h3>
    <del class="originPrice">NT$${product.origin_price.toLocaleString()}</del>
    <p class="nowPrice">NT$${product.price.toLocaleString()}</p>
  </li>`;
  });
  productWrap.innerHTML = productListEl;
  addToCarts();
  calcQuantity();
}

// -產品類別篩選
function filterProducts() {
  // 監聽分類
  productSelect.addEventListener("input", function () {
    // 重置資料
    getProductsData();

    // 取得目標分類值
    selectTarget = productSelect.value;

    // 匹配分類，篩選資料
    if (selectTarget != "全部") {
      productsData = productsData.filter(
        (product) => product.category == selectTarget
      );
    }
    renderProductsList();
  });
}

// ----- 購物車 -------
let cartsData = [];
//  -取得購物車資料
async function getCartsData() {
  try {
    const res = await axios.get(
      `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts`
    );
    cartsData = res.data.carts;

    renderCartsTable();
    if (cartsData.length !== 0) {
      deleteCartsAll();
      deleteCartsItem();
    }
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
}
getCartsData();

// 渲染我的購物車
const shoppingCartTable = document.querySelector(".shoppingCart-table");

function renderCartsTable() {
  // 總金額
  let total = 0;

  let shoppingCartList = "";
  shoppingCartList += `<tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
</tr>`;

  cartsData.forEach((cart) => {
    let itemTotal = cart.product.price * cart.quantity;
    total += itemTotal;

    shoppingCartList += `<tr>
    <td>
      <div class="cardItem-title">
        <img src="${cart.product.images}" alt="${cart.product.title}" />
        <p>${cart.product.title}</p>
      </div>
    </td>
    <td>NT$${cart.product.price.toLocaleString()}</td>
    <td id="calc-quantity"><button class="calc-quantity minus-quantity"><i class="fa-solid fa-square-minus fa-2xl" style="color: #301e5f;" data-id="${
      cart.id
    }"></i></button><span class="quantity-num">${
      cart.quantity
    }</span><button class="calc-quantity plus-quantity"><i class="fa-solid fa-square-plus fa-2xl" style="color: #301e5f;" data-id="${
      cart.id
    }"></i></button></td>
    <td>NT$${itemTotal.toLocaleString()}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" data-id="${cart.id}"> clear </a>
    </td>
  </tr>`;
  });

  shoppingCartList += `<tr>
  <td>
    <a href="#" class="discardAllBtn">刪除所有品項</a>
  </td>
  <td></td>
  <td></td>
  <td>
    <p>總金額</p>
  </td>
  <td>NT$${total.toLocaleString()}</td>
</tr>`;

  if (cartsData.length == 0) {
    shoppingCartTable.innerHTML = "您的購物車是空的，趕快逛逛本季新品吧";
  } else {
    shoppingCartTable.innerHTML = shoppingCartList;
  }
}

// // -加入購物車
function addToCarts() {
  const addCardBtns = document.querySelectorAll(".addCardBtn");

  addCardBtns.forEach((addCardBtn) => {
    addCardBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      let quantity = 0;

      let productId = e.target.dataset.id;

      quantity =
        cartsData.filter((item) => item.product.id == productId)[0]?.quantity ??
        0;

      quantity++;
      try {
        const res = await axios.post(
          `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts`,
          {
            data: {
              productId: productId,
              quantity: quantity,
            },
          }
        );
        getCartsData();

        // 顯示加入成功 modal
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          width: 240,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "加入購物車",
        });
      } catch (error) {
        console.log("Error fetching products data:", error);
      }
    });
  });
}

// // -數量加減
function calcQuantity() {
  shoppingCartTable.addEventListener("click", async function (e) {
    e.preventDefault();

    let productId = e.target.dataset.id;
    let quantity = cartsData.filter((item) => item.id == productId)[0]
      ?.quantity;

    const calcBtn = e.target.classList;
    if (calcBtn.contains("fa-square-minus") && quantity > 1) {
      quantity--;
    } else if (calcBtn.contains("fa-square-plus")) {
      quantity++;
    }

    try {
      const res = await axios.patch(
        `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts`,
        {
          data: {
            id: productId,
            quantity: quantity,
          },
        }
      );

      getCartsData();
    } catch (error) {
      console.log("Error fetching products data:", error);
    }
  });
}

// // -刪除購物車 -全部
function deleteCartsAll() {
  const discardAllBtn = document.querySelector(".discardAllBtn");

  discardAllBtn.addEventListener("click", function (e) {
    e.preventDefault();
    Swal.fire({
      title: "您確定要刪除所有品項?",
      text: "刪除後無法回復!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6a33f8",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts`
          );

          getCartsData();
        } catch (error) {
          console.log("Error fetching products data:", error);
        }

        Swal.fire({
          title: "您的購物車已清空",
          icon: "success",
        });
      }
    });
  });
}

// // -刪除購物車 -單筆
function deleteCartsItem() {
  const discardBtns = document.querySelectorAll(".discardBtn");
  discardBtns.forEach((discardBtn) => {
    discardBtn.addEventListener("click", function (e) {
      e.preventDefault();
      let productId = e.target.dataset.id;

      Swal.fire({
        title: "您確定要刪除該品項?",
        text: "刪除後無法回復!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#6a33f8",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axios.delete(
              `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts/${productId}`
            );
          } catch (error) {
            console.log("Error fetching products data:", error);
          }

          getCartsData();

          Swal.fire({
            title: "該品項已刪除",
            icon: "success",
          });
        }
      });
    });
  });
}

// 送出訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const orderInfoForm = document.querySelector(".orderInfo-form");
let formvalue = {};

// 取得欄位值
function getValues(e) {
  const form = e.target.form;
  formvalue = {
    name: form.姓名.value,
    tel: form.電話.value,
    email: form.Email.value,
    address: form.寄送地址.value,
    payment: form.交易方式.value,
  };
}

async function placeOrders() {
  try {
    const res = await axios.post(
      `${VITE_APP_URL}/customer/${VITE_APP_PATH}/orders`,
      {
        data: {
          user: formvalue,
        },
      }
    );

    renderCartsTable();
    Swal.fire({
      title: "訂購成功!",
      icon: "success",
    });

    orderInfoForm.reset();
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
}

orderInfoBtn.addEventListener("click", function (e) {
  e.preventDefault();
  getValues(e);
  placeOrders();
});

// TODO:
// * 刪除單一品項有問題
