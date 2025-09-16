import{v as u,E as r,a,s as m}from"./errors-DGYLFxor.js";import{s as f}from"./main-37P2jeg1.js";async function g(e){e.preventDefault();const t=document.getElementById("login-username"),i=document.getElementById("login-password");if(!t||!i)return await Swal.fire({icon:"error",title:"เกิดข้อผิดพลาด",text:"ไม่พบองค์ประกอบฟอร์มที่จำเป็น",confirmButtonText:"ตกลง",confirmButtonColor:"#ef4444"}),null;const n=t.value.trim(),o=i.value.trim(),l=u({username:n,password:o});return l.isValid?{username:n,password:o}:(await Swal.fire({icon:"warning",title:"กรุณากรอกข้อมูล",text:l.errors.join(`
`),confirmButtonText:"ตกลง",confirmButtonColor:"#f59e0b"}),null)}async function d(e,t){window.currentUser=e.user,f("mangpongUser",JSON.stringify(window.currentUser)),await Swal.fire({icon:"success",title:"เข้าสู่ระบบสำเร็จ!",text:`ยินดีต้อนรับ ${window.currentUser.fullName||t}`,confirmButtonText:"ตกลง",confirmButtonColor:"#10b981"}),showPage("app");const i=document.getElementById("user-display-name");i&&(i.textContent=window.currentUser.fullName||t),window.initializeApp()}async function w(e){await Swal.fire({icon:"error",title:"เข้าสู่ระบบไม่สำเร็จ",text:e&&e.error?e.error:"ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง",confirmButtonText:"ตกลง",confirmButtonColor:"#ef4444"})}async function p(e){console.error("Login error:",e);let t=a.CONNECTION_FAILED,i=r.NETWORK_ERROR;e.message&&e.message.includes("หมดเวลา")?(t=a.TIMEOUT,i="การเชื่อมต่อกับเซิร์ฟเวอร์ใช้เวลานานเกินไป โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ"):e.message&&e.message.includes("ไม่สามารถเชื่อมต่อ")?(t=a.CONNECTION_FAILED,i="ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ"):e.message&&e.message.includes("Google Script URL ไม่ได้ถูกกำหนดไว้")?(t="การกำหนดค่าผิดพลาด",i="Google Script URL ไม่ได้ถูกกำหนดไว้ในระบบ โปรดติดต่อผู้ดูแลระบบ"):e.message&&(i=e.message),await Swal.fire({icon:"error",title:t,html:`${i}${e.message&&!i.includes(e.message)?`<br><small class="text-gray-500">(${e.message})</small>`:""}
    <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
      <p class="font-medium mb-2">คำแนะนำในการแก้ไขปัญหา:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ</li>
        <li>ลองรีเฟรชหน้านี้อีกครั้ง (Ctrl+F5 หรือ Cmd+Shift+R)</li>
        <li>หากปัญหายังคงอยู่ โปรดติดต่อผู้ดูแลระบบ</li>
      </ul>
    </div>
  `,confirmButtonText:"ตกลง",confirmButtonColor:"#ef4444"})}async function E(e){const{username:t,password:i}=e;console.log("Attempting login for user:",t),Swal.fire({title:"กำลังเข้าสู่ระบบ...",allowOutsideClick:!1,allowEscapeKey:!1,showConfirmButton:!1,didOpen:()=>{Swal.showLoading()}});try{if(!navigator.onLine){await Swal.fire({icon:"warning",title:"ออฟไลน์",html:`
          <p>คุณกำลังออฟไลน์อยู่ในขณะนี้</p>
          <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
            <p class="font-medium mb-2">คำแนะนำ:</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ</li>
              <li>เปิด Wi-Fi หรือข้อมูลมือถือ</li>
              <li>ลองใหม่อีกครั้งเมื่อเชื่อมต่ออินเทอร์เน็ตแล้ว</li>
            </ul>
          </div>
        `,confirmButtonText:"ตกลง",confirmButtonColor:"#f59e0b"});return}const n=new Promise((S,c)=>setTimeout(()=>c(new Error(r.TIMEOUT_ERROR)),2e4)),o={action:"login",username:t,password:i};console.log("Sending login request:",o);const l=m(o),s=await Promise.race([l,n]);console.log("Received login response:",s),s&&s.success?await d(s,t):await w(s)}catch(n){await p(n)}}async function T(e){const t=await g(e);t&&await E(t)}export{T as handleLogin};
