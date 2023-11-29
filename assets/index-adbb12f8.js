import"./modulepreload-polyfill-3cfb730f.js";const{VITE_APP_URL:a,VITE_APP_PATH:c,VITE_APP_KEY:D}={VITE_APP_URL:"https://livejs-api.hexschool.io/api/livejs/v1",VITE_APP_PATH:"booking",VITE_APP_KEY:"OvZT26IGy8htqCp2jpEnoB8uyWq1",BASE_URL:"/booking-site/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},T=document.querySelector(".productWrap");let i=[];const g=document.querySelector(".productSelect");let u="全部";async function S(){await $(),y(),v()}S();async function $(){try{i=(await axios.get(`${a}/customer/${c}/products`)).data.products}catch(t){console.error("Error fetching products data:",t)}}function y(){let t="";i.forEach(e=>{t+=`<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${e.images}"
      alt="${e.title}"
    />
    <a href="#" class="addCardBtn" data-id="${e.id}">加入購物車</a>
    <h3>${e.title}</h3>
    <del class="originPrice">NT$${e.origin_price.toLocaleString()}</del>
    <p class="nowPrice">NT$${e.price.toLocaleString()}</p>
  </li>`}),T.innerHTML=t,L()}function v(){g.addEventListener("input",function(){$(),u=g.value,u!="全部"&&(i=i.filter(t=>t.category==u)),y()})}function w(){f(),l()}w();let d=[];async function f(){try{d=(await axios.get(`${a}/customer/${c}/carts`)).data.carts}catch(t){console.error("Error fetching products data:",t)}}const p=document.querySelector(".shoppingCart-table");async function l(){await f();let t=0,e="";e+=`<tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
</tr>`,d.forEach(r=>{t+=r.product.price,e+=`<tr>
    <td>
      <div class="cardItem-title">
        <img src="${r.product.images}" alt="${r.product.title}" />
        <p>${r.product.title}</p>
      </div>
    </td>
    <td>NT$${r.product.price.toLocaleString()}</td>
    <td>${r.quantity}</td>
    <td>NT$${r.product.price.toLocaleString()}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" data-id="${r.id}"> clear </a>
    </td>
  </tr>`}),e+=`<tr>
  <td>
    <a href="#" class="discardAllBtn">刪除所有品項</a>
  </td>
  <td></td>
  <td></td>
  <td>
    <p>總金額</p>
  </td>
  <td>NT$${t.toLocaleString()}</td>
</tr>`,d.length==0?p.innerHTML="您的購物車是空的，趕快逛逛本季新品吧":(p.innerHTML=e,B(),P())}function L(){document.querySelectorAll(".addCardBtn").forEach(e=>{e.addEventListener("click",async function(r){var h;r.preventDefault(),f();let o=0,n=r.target.dataset.id;o=((h=d.filter(s=>s.product.id==n)[0])==null?void 0:h.quantity)??0;try{const s=await axios.post(`${a}/customer/${c}/carts`,{data:{productId:n,quantity:o+1}});Swal.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:1e3,width:240,didOpen:m=>{m.onmouseenter=Swal.stopTimer,m.onmouseleave=Swal.resumeTimer}}).fire({icon:"success",title:"加入購物車"}),l()}catch(s){console.log("Error fetching products data:",s)}})})}function P(){document.querySelector(".discardAllBtn").addEventListener("click",function(e){e.preventDefault(),Swal.fire({title:"您確定要刪除所有品項?",text:"刪除後無法回復!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6a33f8",cancelButtonColor:"#d33",confirmButtonText:"確定"}).then(r=>{if(r.isConfirmed){try{const o=axios.delete(`${a}/customer/${c}/carts`);p.innerHTML="您的購物車是空的，趕快逛逛本季新品吧"}catch(o){console.log("Error fetching products data:",o)}Swal.fire({title:"您的購物車已清空",icon:"success"})}})})}function B(){document.querySelectorAll(".discardBtn").forEach(e=>{e.addEventListener("click",async function(r){let o=r.target.dataset.id;r.preventDefault();try{const n=await axios.delete(`${a}/customer/${c}/carts/${o}`);l()}catch(n){console.log("Error fetching products data:",n)}})})}const C=document.querySelector(".orderInfo-btn"),A=document.querySelector(".orderInfo-form");let E={};function I(t){const e=t.target.form;E={name:e.姓名.value,tel:e.電話.value,email:e.Email.value,address:e.寄送地址.value,payment:e.交易方式.value}}async function q(){try{console.log();const t=await axios.post(`${a}/customer/${c}/orders`,{data:{user:E}});l(),Swal.fire({title:"訂購成功!",icon:"success"}),A.reset()}catch(t){console.error("Error fetching products data:",t)}}C.addEventListener("click",function(t){t.preventDefault(),I(t),q()});
