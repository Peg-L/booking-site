const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;

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
    calcQuantity();

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

    shoppingCartList += `<tr data-id="${cart.id}">
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
    <td class="item-total">NT$${itemTotal.toLocaleString()}</td>
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
  <td class="totalPrice">NT$${total.toLocaleString()}</td>
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
  // 在渲染完整個 shoppingCartList 後，為每個按鈕添加事件監聽器
  document
    .querySelectorAll(".fa-square-minus, .fa-square-plus")
    .forEach((btn) => {
      btn.addEventListener("click", function () {
        const totalPriceElement = document.querySelector(`td.totalPrice`);

        let totalPrice = parseInt(
          totalPriceElement.textContent.replace("NT$", "").replace(",", "")
        );

        const productId = btn.dataset.id;
        const trElement = document.querySelector(`tr[data-id="${productId}"]`);
        const quantityNum = trElement.querySelector(".quantity-num");
        const itemTotalElement = trElement.querySelector(".item-total");

        // 獲取當前數量
        let currentQuantity = parseInt(quantityNum.textContent);
        // 獲取單價
        const priceString =
          trElement.querySelector("td:nth-child(2)").textContent;
        const price = parseInt(priceString.replace("NT$", "").replace(",", ""));

        // 判斷按鈕是加還是減，並做對應運算
        if (btn.classList.contains("fa-square-minus")) {
          // 減少數量，且確保不小於 1
          if (currentQuantity > 1) {
            currentQuantity--;
            totalPrice -= price;
          }
        } else if (btn.classList.contains("fa-square-plus")) {
          // 增加數量
          currentQuantity++;
          totalPrice += price;
        }

        // 渲染新數量/新金額
        quantityNum.textContent = currentQuantity;
        const itemTotal = currentQuantity * price;
        itemTotalElement.textContent = `NT$${itemTotal.toLocaleString()}`;
        totalPriceElement.textContent = `NT$${totalPrice.toLocaleString()}`;

        // // 更新購物車數據
        updateCartData(productId, currentQuantity);
      });
    });

  // 更新購物車資料
  function updateCartData(productId, quantity) {
    try {
      const res = axios.patch(
        `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts`,
        {
          data: {
            id: productId,
            quantity: quantity,
          },
        }
      );
    } catch (error) {
      console.log("Error fetching products data:", error);
    }
  }
}
calcQuantity();

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
let formvalue = {};

// 取得欄位值
function getValues(e) {
  const form = e.target.form;

  formvalue = {
    name: form.姓名.value,
    tel: form.手機.value,
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

    getCartsData();
    Swal.fire({
      title: "訂購成功!",
      icon: "success",
    });

    form.reset();
    orderInfoBtn.classList.add("disabled");
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
}

// 表單驗證
const pattern = /^09\d{8}$/;
const constraints = {
  姓名: {
    presence: {
      message: "為必填",
    },
  },
  手機: {
    presence: {
      message: "為必填",
    },
    format: {
      pattern: pattern,
      message: "格式不符",
    },
  },
  Email: {
    presence: {
      message: "為必填",
    },
    email: {
      message: "格式不符",
    },
  },
  寄送地址: {
    presence: {
      message: "為必填",
    },
  },
};
const form = document.querySelector(".orderInfo-form");
const inputs = document.querySelectorAll(
  "input[type=text], input[type=tel], input[type=email]"
);
const orderInfoBtn = document.querySelector(".orderInfo-btn");

function formValidate() {
  inputs.forEach((item) => {
    item.addEventListener("change", function () {
      item.nextElementSibling.textContent = "";
      let errors = validate(form, constraints);
      if (errors) {
        Object.keys(errors).forEach(function (keys) {
          document.querySelector(`[data-message="${keys}"]`).textContent =
            errors[keys];
        });
        orderInfoBtn.classList.add("disabled");
      } else {
        orderInfoBtn.classList.remove("disabled");
      }
    });
  });

  orderInfoBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (cartsData.length == 0) {
      Swal.fire({
        title: "您的購物車是空的，趕快逛逛本季新品吧",
        icon: "warning",
      });
      return;
    }

    getValues(e);
    placeOrders();
  });
}
formValidate();
