import"./modulepreload-polyfill-3cfb730f.js";const{VITE_APP_URL:h,VITE_APP_PATH:E,VITE_APP_KEY:y}={VITE_APP_URL:"https://livejs-api.hexschool.io/api/livejs/v1",VITE_APP_PATH:"booking",VITE_APP_KEY:"OvZT26IGy8htqCp2jpEnoB8uyWq1",BASE_URL:"/booking-site/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};let d=[];const c=`${h}/admin/${E}/orders`,l={headers:{Authorization:y}};async function g(){try{d=(await axios.get(c,l)).data.orders}catch(t){console.error("Error fetching products data:",t)}}const p=document.querySelector(".ordersDataWrap");async function i(){await g();let t="";d.forEach(e=>{let a="";e.products.forEach(u=>{a+=`<p>${u.title} x${u.quantity}</p>`});let o="",s=new Date(e.createdAt*1e3);const n=s.getFullYear(),r=s.getMonth()+1,f=s.getDate();o=`${n}/${r}/${f}`,t+=`<tr>
    <td>${e.id}</td>
    <td>
      <p>${e.user.name}</p>
      <p>${e.user.tel}</p>
    </td>
    <td>${e.user.address}</td>
    <td>${e.user.email}</td>
    <td>
      <p>${a}</p>
    </td>
    <td>${o}</td>
    <td class="orderStatus">
      <a href="#"  data-button="status" data-id="${e.id}" data-paid="${e.paid}">${e.paid?"已處理":"未處理"}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-button="del" data-id="${e.id}" />
    </td>
  </tr>`}),p.innerHTML=d.length>0?t:"<p style='padding: 12px'>目前沒有訂單資料</p>",S()}i();const $=document.querySelector(".discardAllBtn");$.addEventListener("click",function(t){t.preventDefault(),Swal.fire({title:"您確定要刪除所有訂單?",text:"刪除後無法回復!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6a33f8",cancelButtonColor:"#d33",confirmButtonText:"確定"}).then(async e=>{e.isConfirmed&&A()})});function A(){try{const t=axios.delete(c,l);i()}catch(t){console.log(t)}}p.addEventListener("click",t=>{t.preventDefault();const{id:e,button:a}=t.target.dataset;if(a=="del")Swal.fire({title:"您確定要刪除此訂單?",text:"刪除後無法回復!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6a33f8",cancelButtonColor:"#d33",confirmButtonText:"確定"}).then(async o=>{o.isConfirmed&&D(e)});else if(a=="status"){const{paid:o}=t.target.dataset;P(e,o==="true")}});async function D(t){try{const e=await axios.delete(`${c}/${t}`,l);i()}catch(e){console.error("Error fetching products data:",e)}}async function P(t,e){try{const a=await axios.put(c,{data:{id:t,paid:!e}},l);i()}catch(a){console.log(a)}}function S(){console.log(d);let t={};d.forEach(n=>{n.products.forEach(r=>{t[r.title]==null?t[r.title]=r.price*r.quantity:t[r.title]+=r.price*r.quantity})});let e=[];Object.keys(t).forEach(n=>{let r=[];r.push(n),r.push(t[n]),e.push(r)}),e.sort((n,r)=>r[1]-n[1]);let o=[],s=["其他",0];e.forEach((n,r)=>{r<3?o.push(n):s[1]+=n[1]}),o.push(s),B(o)}function B(t){let e=["#301E5F","#5434A7","#9D7FEA","#DACBFF"],a={};t.forEach((o,s)=>{a[o[0]]=e[s]}),c3.generate({bindto:"#chart",data:{type:"pie",columns:t,colors:a}})}
