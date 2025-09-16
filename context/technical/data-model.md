# Data Model

## โมเดลข้อมูล

### 1. Job Model
```javascript
{
  jobId: String,           // รหัสงาน (auto-generated)
  timestamp: Date,         // ประทับเวลา
  status: String,          // สถานะ (complete, incomplete, draft)
  company: String,         // ข้อมูลบริษัท
  assignedBy: String,      // ผู้มอบงาน
  contact: String,         // ข้อมูลติดต่อ
  pickupProvince: String,  // จังหวัดรับของ
  pickupDistrict: String,  // เขต/อำเภอรับของ
  deliveryDetails: [       // รายละเอียดการส่ง
    {
      company: String,     // บริษัทปลายทาง
      province: String,    // จังหวัดส่งของ
      district: String,    // เขต/อำเภอส่งของ
      recipient: String,   // ผู้รับงาน
      description: String, // รายละเอียด
      amount: Number       // จำนวนเงิน
    }
  ],
  additionalFees: [        // ค่าบริการเพิ่มเติม
    {
      description: String, // คำอธิบาย
      amount: Number       // จำนวนเงิน
    }
  ],
  totalAmount: Number,     // จำนวนเงินรวม
  incompleteReason: String // เหตุผลที่ไม่สมบูรณ์ (สำหรับงานที่ไม่สมบูรณ์)
}
```

### 2. User Model
```javascript
{
  userId: String,          // รหัสผู้ใช้
  username: String,        // ชื่อผู้ใช้
  password: String,        // รหัสผ่าน (hashed)
  fullName: String,        // ชื่อ-นามสกุล
  phone: String,           // เบอร์โทรศัพท์
  email: String,           // อีเมล
  role: String,            // บทบาท (messenger, admin, owner)
  createdAt: Date,         // วันที่สร้าง
  lastLogin: Date          // วันที่ล็อกอินล่าสุด
}
```

### 3. Salary Model
```javascript
{
  userId: String,          // รหัสผู้ใช้
  month: String,           // เดือน (YYYY-MM)
  totalJobs: Number,       // จำนวนงานทั้งหมด
  totalAmount: Number,     // จำนวนเงินรวม
  commission: Number,      // ค่าคอมมิชชั่น (70%)
  companyShare: Number,    // ส่วนแบ่งบริษัท (30%)
  baseSalary: Number,      // เงินเดือนฐาน (15,000)
  socialSecurity: Number,  // ประกันสังคม (5%, สูงสุด 750)
  specialAllowance: Number,// เบี้ยเลี้ยงพิเศษ
  deductions: Number,      // การหักเงิน
  netSalary: Number,       // เงินเดือนสุทธิ
  calculatedAt: Date       // วันที่คำนวณ
}
```