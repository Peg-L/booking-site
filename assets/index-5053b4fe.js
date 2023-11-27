import"./all-4ed993c7.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const c of e)if(c.type==="childList")for(const d of c.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function r(e){const c={};return e.integrity&&(c.integrity=e.integrity),e.referrerPolicy&&(c.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?c.credentials="include":e.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function n(e){if(e.ep)return;e.ep=!0;const c=r(e);fetch(e.href,c)}})();const{VITE_APP_URL:i,VITE_APP_PATH:a,VITE_APP_KEY:S}={VITE_APP_URL:"https://livejs-api.hexschool.io/api/livejs/v1",VITE_APP_PATH:"booking",VITE_APP_KEY:"OvZT26IGy8htqCp2jpEnoB8uyWq1",BASE_URL:"/booking-site/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},$=document.querySelector(".productWrap");let s=[];const h=document.querySelector(".productSelect");let l="全部";async function E(){await g(),y(),L()}E();async function g(){try{s=(await axios.get(`${i}/customer/${a}/products`)).data.products}catch(o){console.error("Error fetching products data:",o)}}function y(){let o="";s.forEach(t=>{o+=`<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${t.images}"
      alt="${t.title}"
    />
    <a href="#" class="addCardBtn" data-id="${t.id}">加入購物車</a>
    <h3>${t.title}</h3>
    <del class="originPrice">NT$${t.origin_price.toLocaleString()}</del>
    <p class="nowPrice">NT$${t.price.toLocaleString()}</p>
  </li>`}),$.innerHTML=o,A()}function L(){h.addEventListener("input",function(){g(),l=h.value,l!="全部"&&(s=s.filter(o=>o.category==l)),y()})}function P(){m(),p()}P();let u=[];async function m(){try{u=(await axios.get(`${i}/customer/${a}/carts`)).data.carts}catch(o){console.error("Error fetching products data:",o)}}const f=document.querySelector(".shoppingCart-table");async function p(){await m();let o=0,t="";t+=`<tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
</tr>`,u.forEach(r=>{o+=r.product.price,t+=`<tr>
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
  </tr>`}),t+=`<tr>
  <td>
    <a href="#" class="discardAllBtn">刪除所有品項</a>
  </td>
  <td></td>
  <td></td>
  <td>
    <p>總金額</p>
  </td>
  <td>NT$${o.toLocaleString()}</td>
</tr>`,u.length==0?f.innerHTML="您的購物車是空的，趕快逛逛本季新品吧":(f.innerHTML=t,C(),T())}function A(){document.querySelectorAll(".addCardBtn").forEach(t=>{t.addEventListener("click",async function(r){r.preventDefault();let n=r.target.dataset.id;try{const e=await axios.post(`${i}/customer/${a}/carts`,{data:{productId:n,quantity:1}});Swal.fire({position:"top-end",icon:"success",title:"加入購物車",showConfirmButton:!1,timer:1e3}),p()}catch(e){console.log("Error fetching products data:",e)}})})}function T(){document.querySelector(".discardAllBtn").addEventListener("click",function(t){t.preventDefault(),Swal.fire({title:"您確定要刪除所有品項?",text:"刪除後無法回復!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6a33f8",cancelButtonColor:"#d33",confirmButtonText:"確定"}).then(r=>{if(r.isConfirmed){try{const n=axios.delete(`${i}/customer/${a}/carts`);f.innerHTML="您的購物車是空的，趕快逛逛本季新品吧"}catch(n){console.log("Error fetching products data:",n)}Swal.fire({title:"您的購物車已清空",icon:"success"})}})})}function C(){document.querySelectorAll(".discardBtn").forEach(t=>{t.addEventListener("click",async function(r){let n=r.target.dataset.id;r.preventDefault();try{const e=await axios.delete(`${i}/customer/${a}/carts/${n}`);p()}catch(e){console.log("Error fetching products data:",e)}})})}c3.generate({bindto:"#chart",data:{type:"pie",columns:[["Louvre 雙人床架",1],["Antony 雙人床架",2],["Anty 雙人床架",3],["其他",4]],colors:{"Louvre 雙人床架":"#DACBFF","Antony 雙人床架":"#9D7FEA","Anty 雙人床架":"#5434A7",其他:"#301E5F"}}});
