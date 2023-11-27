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

//// 處理加入購物車
function handleCarts() {
  getCartsData();
  renderCartsTable();
}
handleCarts();

let cartsData = [];
//  -取得購物車
async function getCartsData() {
  try {
    const res = await axios.get(
      `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts`
    );
    cartsData = res.data.carts;
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
}

// 渲染我的購物車
const shoppingCartTable = document.querySelector(".shoppingCart-table");
async function renderCartsTable() {
  // 取得購物車內容
  await getCartsData();

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
    // console.log(cart);
    total += cart.product.price;
    shoppingCartList += `<tr>
    <td>
      <div class="cardItem-title">
        <img src="${cart.product.images}" alt="${cart.product.title}" />
        <p>${cart.product.title}</p>
      </div>
    </td>
    <td>NT$${cart.product.price.toLocaleString()}</td>
    <td>${cart.quantity}</td>
    <td>NT$${cart.product.price.toLocaleString()}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" data-id="${cart.id}"> clear </a>
    </td>
  </tr>`;
  });
  // console.log(total);

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
    deleteCartsItem();
    deleteCartsAll();
  }
}

// -加入購物車
function addToCarts() {
  const addCardBtns = document.querySelectorAll(".addCardBtn");
  addCardBtns.forEach((addCardBtn) => {
    addCardBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      let productId = e.target.dataset.id;

      try {
        const res = await axios.post(
          `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts`,
          {
            data: {
              productId: productId,
              quantity: 1,
            },
          }
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "加入購物車",
          showConfirmButton: false,
          timer: 1000,
          // width: 400,
        });

        // 重新渲染
        renderCartsTable();
        // console.log(res.data.carts);
      } catch (error) {
        console.log("Error fetching products data:", error);
      }
    });
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
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const res = axios.delete(
            `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts`
          );
          shoppingCartTable.innerHTML = "您的購物車是空的，趕快逛逛本季新品吧";
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
    discardBtn.addEventListener("click", async function (e) {
      let productId = e.target.dataset.id;
      e.preventDefault();
      try {
        const res = await axios.delete(
          `${VITE_APP_URL}/customer/${VITE_APP_PATH}/carts/${productId}`
        );

        renderCartsTable();
      } catch (error) {
        console.log("Error fetching products data:", error);
      }
    });
  });
}

// TODO:
// 1. 數量會覆蓋過去，怎麼修改:
// 取得該產品原本的 quantity 後，再做加減

// 2. 必填
// 不要"必填"文字，改成 * 號
