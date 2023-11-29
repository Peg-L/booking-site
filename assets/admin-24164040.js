import"./modulepreload-polyfill-3cfb730f.js";const{VITE_APP_URL:y,VITE_APP_PATH:E,VITE_APP_KEY:h}={VITE_APP_URL:"https://livejs-api.hexschool.io/api/livejs/v1",VITE_APP_PATH:"booking",VITE_APP_KEY:"OvZT26IGy8htqCp2jpEnoB8uyWq1",BASE_URL:"/booking-site/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};let a=[];const o=`${y}/admin/${E}/orders`,d={headers:{Authorization:h}};async function $(){try{a=(await axios.get(o,d)).data.orders}catch(e){console.error("Error fetching products data:",e)}}const i=document.querySelector(".ordersDataWrap");async function n(){await $();let e="";a.forEach(t=>{let s="";t.products.forEach(l=>{s+=`<p>${l.title} x${l.quantity}</p>`});let c="",r=new Date(t.createdAt*1e3);const p=r.getFullYear(),u=r.getMonth()+1,A=r.getDate();c=`${p}/${u}/${A}`,e+=`<tr>
    <td>${t.id}</td>
    <td>
      <p>${t.user.name}</p>
      <p>${t.user.tel}</p>
    </td>
    <td>${t.user.address}</td>
    <td>${t.user.email}</td>
    <td>
      <p>${s}</p>
    </td>
    <td>${c}</td>
    <td class="orderStatus">
      <a href="#">${t.paid?"已處理":"未處理"}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${t.id}" />
    </td>
  </tr>`}),i.innerHTML=a.length>0?e:"<p style='padding: 12px'>目前沒有訂單資料</p>"}n();const g=document.querySelector(".discardAllBtn");g.addEventListener("click",P);function P(){try{const e=axios.delete(o,d);n()}catch(e){console.log(e)}}i.addEventListener("click",e=>{e.preventDefault();const t=e.target.dataset.id;t&&f(t)});async function f(e){try{const t=await axios.delete(`${o}/${e}`,d);n()}catch(t){console.error("Error fetching products data:",t)}}c3.generate({bindto:"#chart",data:{type:"pie",columns:[["Louvre 雙人床架",1],["Antony 雙人床架",2],["Anty 雙人床架",3],["其他",4]],colors:{"Louvre 雙人床架":"#DACBFF","Antony 雙人床架":"#9D7FEA","Anty 雙人床架":"#5434A7",其他:"#301E5F"}}});
