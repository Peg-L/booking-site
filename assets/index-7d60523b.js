import"./modulepreload-polyfill-3cfb730f.js";const{VITE_APP_URL:i,VITE_APP_PATH:l}={VITE_APP_URL:"https://livejs-api.hexschool.io/api/livejs/v1",VITE_APP_PATH:"booking",VITE_APP_KEY:"OvZT26IGy8htqCp2jpEnoB8uyWq1",BASE_URL:"/booking-site/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},v=document.querySelector(".productWrap");let p=[];const g=document.querySelector(".productSelect");let h="全部";async function x(){await S(),q(),B()}x();async function S(){try{p=(await axios.get(`${i}/customer/${l}/products`)).data.products}catch(e){console.error("Error fetching products data:",e)}}function q(){let e="";p.forEach(t=>{e+=`<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${t.images}"
      alt="${t.title}"
    />
    <a href="#" class="addCardBtn" data-id="${t.id}">加入購物車</a>
    <h3>${t.title}</h3>
    <del class="originPrice">NT$${t.origin_price.toLocaleString()}</del>
    <p class="nowPrice">NT$${t.price.toLocaleString()}</p>
  </li>`}),v.innerHTML=e,I()}function B(){g.addEventListener("input",function(){S(),h=g.value,h!="全部"&&(p=p.filter(e=>e.category==h)),q()})}let d=[];async function u(){try{d=(await axios.get(`${i}/customer/${l}/carts`)).data.carts,P(),E(),d.length!==0&&(A(),b())}catch(e){console.error("Error fetching products data:",e)}}u();const $=document.querySelector(".shoppingCart-table");function P(){let e=0,t="";t+=`<tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
</tr>`,d.forEach(a=>{let r=a.product.price*a.quantity;e+=r,t+=`<tr data-id="${a.id}">
    <td>
      <div class="cardItem-title">
        <img src="${a.product.images}" alt="${a.product.title}" />
        <p>${a.product.title}</p>
      </div>
    </td>
    <td>NT$${a.product.price.toLocaleString()}</td>
    <td id="calc-quantity"><button class="calc-quantity minus-quantity"><i class="fa-solid fa-square-minus fa-2xl" style="color: #301e5f;" data-id="${a.id}"></i></button><span class="quantity-num">${a.quantity}</span><button class="calc-quantity plus-quantity"><i class="fa-solid fa-square-plus fa-2xl" style="color: #301e5f;" data-id="${a.id}"></i></button></td>
    <td class="item-total">NT$${r.toLocaleString()}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" data-id="${a.id}"> clear </a>
    </td>
  </tr>`}),t+=`<tr>
  <td>
    <a href="#" class="discardAllBtn">刪除所有品項</a>
  </td>
  <td></td>
  <td></td>
  <td>
    <p>總金額</p>
  </td>
  <td class="totalPrice">NT$${e.toLocaleString()}</td>
</tr>`,d.length==0?$.innerHTML="您的購物車是空的，趕快逛逛本季新品吧":$.innerHTML=t}function I(){document.querySelectorAll(".addCardBtn").forEach(t=>{t.addEventListener("click",async function(a){var n;a.preventDefault();let r=0,c=a.target.dataset.id;r=((n=d.filter(s=>s.product.id==c)[0])==null?void 0:n.quantity)??0,r++;try{const s=await axios.post(`${i}/customer/${l}/carts`,{data:{productId:c,quantity:r}});u(),Swal.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:1e3,width:240,didOpen:o=>{o.onmouseenter=Swal.stopTimer,o.onmouseleave=Swal.resumeTimer}}).fire({icon:"success",title:"加入購物車"})}catch(s){console.log("Error fetching products data:",s)}})})}function E(){document.querySelectorAll(".fa-square-minus, .fa-square-plus").forEach(t=>{t.addEventListener("click",function(){const a=document.querySelector("td.totalPrice");let r=parseInt(a.textContent.replace("NT$","").replace(",",""));const c=t.dataset.id,n=document.querySelector(`tr[data-id="${c}"]`),s=n.querySelector(".quantity-num"),y=n.querySelector(".item-total");let o=parseInt(s.textContent);const w=n.querySelector("td:nth-child(2)").textContent,m=parseInt(w.replace("NT$","").replace(",",""));t.classList.contains("fa-square-minus")?o>1&&(o--,r-=m):t.classList.contains("fa-square-plus")&&(o++,r+=m),s.textContent=o;const L=o*m;y.textContent=`NT$${L.toLocaleString()}`,a.textContent=`NT$${r.toLocaleString()}`,e(c,o)})});function e(t,a){try{const r=axios.patch(`${i}/customer/${l}/carts`,{data:{id:t,quantity:a}})}catch(r){console.log("Error fetching products data:",r)}}}E();function A(){document.querySelector(".discardAllBtn").addEventListener("click",function(t){t.preventDefault(),Swal.fire({title:"您確定要刪除所有品項?",text:"刪除後無法回復!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6a33f8",cancelButtonColor:"#d33",confirmButtonText:"確定"}).then(async a=>{if(a.isConfirmed){try{const r=await axios.delete(`${i}/customer/${l}/carts`);u()}catch(r){console.log("Error fetching products data:",r)}Swal.fire({title:"您的購物車已清空",icon:"success"})}})})}function b(){document.querySelectorAll(".discardBtn").forEach(t=>{t.addEventListener("click",function(a){a.preventDefault();let r=a.target.dataset.id;Swal.fire({title:"您確定要刪除該品項?",text:"刪除後無法回復!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6a33f8",cancelButtonColor:"#d33",confirmButtonText:"確定"}).then(async c=>{if(c.isConfirmed){try{const n=await axios.delete(`${i}/customer/${l}/carts/${r}`)}catch(n){console.log("Error fetching products data:",n)}u(),Swal.fire({title:"該品項已刪除",icon:"success"})}})})})}let T={};function D(e){const t=e.target.form;T={name:t.姓名.value,tel:t.手機.value,email:t.Email.value,address:t.寄送地址.value,payment:t.交易方式.value}}async function _(){try{const e=await axios.post(`${i}/customer/${l}/orders`,{data:{user:T}});u(),Swal.fire({title:"訂購成功!",icon:"success"}),C.reset(),f.classList.add("disabled")}catch(e){console.error("Error fetching products data:",e)}}const N=/^09\d{8}$/,V={姓名:{presence:{message:"為必填"}},手機:{presence:{message:"為必填"},format:{pattern:N,message:"格式不符"}},Email:{presence:{message:"為必填"},email:{message:"格式不符"}},寄送地址:{presence:{message:"為必填"}}},C=document.querySelector(".orderInfo-form"),k=document.querySelectorAll("input[type=text], input[type=tel], input[type=email]"),f=document.querySelector(".orderInfo-btn");function O(){k.forEach(e=>{e.addEventListener("change",function(){e.nextElementSibling.textContent="";let t=validate(C,V);t?(Object.keys(t).forEach(function(a){document.querySelector(`[data-message="${a}"]`).textContent=t[a]}),f.classList.add("disabled")):f.classList.remove("disabled")})}),f.addEventListener("click",function(e){if(e.preventDefault(),d.length==0){Swal.fire({title:"您的購物車是空的，趕快逛逛本季新品吧",icon:"warning"});return}D(e),_()})}O();
