import"./modulepreload-polyfill-3cfb730f.js";const{VITE_APP_URL:h,VITE_APP_PATH:E,VITE_APP_KEY:y}={VITE_APP_URL:"https://livejs-api.hexschool.io/api/livejs/v1",VITE_APP_PATH:"booking",VITE_APP_KEY:"OvZT26IGy8htqCp2jpEnoB8uyWq1",BASE_URL:"/booking-site/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};let d=[];const c=`${h}/admin/${E}/orders`,l={headers:{Authorization:y}};async function g(){try{d=(await axios.get(c,l)).data.orders}catch(e){console.error("Error fetching products data:",e)}}const p=document.querySelector(".ordersDataWrap");async function i(){await g();let e="";d.forEach(t=>{let a="";t.products.forEach(u=>{a+=`<p>${u.title} x${u.quantity}</p>`});let o="",s=new Date(t.createdAt*1e3);const n=s.getFullYear(),r=s.getMonth()+1,f=s.getDate();o=`${n}/${r}/${f}`,e+=`<tr>
    <td>${t.id}</td>
    <td>
      <p>${t.user.name}</p>
      <p>${t.user.tel}</p>
    </td>
    <td>${t.user.address}</td>
    <td>${t.user.email}</td>
    <td>
      <p>${a}</p>
    </td>
    <td>${o}</td>
    <td class="orderStatus">
      <a href="#"  data-button="status" data-id="${t.id}" data-paid="${t.paid}">${t.paid?"已處理":"未處理"}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-button="del" data-id="${t.id}" />
    </td>
  </tr>`}),p.innerHTML=d.length>0?e:"<p style='padding: 12px'>目前沒有訂單資料</p>",S()}i();const $=document.querySelector(".discardAllBtn");$.addEventListener("click",function(e){Swal.fire({title:"您確定要刪除所有訂單?",text:"刪除後無法回復!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6a33f8",cancelButtonColor:"#d33",confirmButtonText:"確定"}).then(async t=>{t.isConfirmed&&A(e)})});function A(e){e.preventDefault();try{const t=axios.delete(c,l);i()}catch(t){console.log(t)}}p.addEventListener("click",e=>{e.preventDefault();const{id:t,button:a}=e.target.dataset;if(a=="del")Swal.fire({title:"您確定要刪除此訂單?",text:"刪除後無法回復!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6a33f8",cancelButtonColor:"#d33",confirmButtonText:"確定"}).then(async o=>{o.isConfirmed&&D(t)});else if(a=="status"){const{paid:o}=e.target.dataset;P(t,o==="true")}});async function D(e){try{const t=await axios.delete(`${c}/${e}`,l);i()}catch(t){console.error("Error fetching products data:",t)}}async function P(e,t){try{const a=await axios.put(c,{data:{id:e,paid:!t}},l);i()}catch(a){console.log(a)}}function S(){console.log(d);let e={};d.forEach(n=>{n.products.forEach(r=>{e[r.title]==null?e[r.title]=r.price*r.quantity:e[r.title]+=r.price*r.quantity})});let t=[];Object.keys(e).forEach(n=>{let r=[];r.push(n),r.push(e[n]),t.push(r)}),t.sort((n,r)=>r[1]-n[1]);let o=[],s=["其他",0];t.forEach((n,r)=>{r<3?o.push(n):s[1]+=n[1]}),o.push(s),B(o)}function B(e){let t=["#301E5F","#5434A7","#9D7FEA","#DACBFF"],a={};e.forEach((o,s)=>{a[o[0]]=t[s]}),c3.generate({bindto:"#chart",data:{type:"pie",columns:e,colors:a}})}
