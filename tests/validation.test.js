/**
 * @jest-environment jsdom
 */

const { validateJobForm } = require('./validation');

describe('Validation Functions', () => {
  describe('validateJobForm', () => {
    beforeEach(() => {
      // Set up DOM before each test
      document.body.innerHTML = `
        <form id="new-job-form">
          <select>
            <option value="บจก.เวอริโฟน (ชั้น 3.2)">บจก.เวอริโฟน (ชั้น 3.2)</option>
          </select>
          <input placeholder="ชื่อผู้มอบงาน" value="John Doe">
          <input placeholder="ข้อมูลติดต่อ" value="0812345678">
          <input placeholder="จังหวัด" value="กรุงเทพมหานคร">
          <input placeholder="เขต/อำเภอ" value="สาทร">
          
          <div class="job-detail-card">
            <input value="บจก.ปลายทาง">
            <input value="จังหวัดปลายทาง">
            <input value="เขตปลายทาง">
            <input value="ผู้รับงาน">
            <textarea>รายละเอียดงาน</textarea>
            <input class="amount-input" value="1000">
          </div>
        </form>
        
        <div id="job-details-container">
          <div class="job-detail-card">
            <input value="บจก.ปลายทาง">
            <input value="จังหวัดปลายทาง">
            <input value="เขตปลายทาง">
            <input value="ผู้รับงาน">
            <textarea>รายละเอียดงาน</textarea>
            <input class="amount-input" value="1000">
          </div>
        </div>
        
        <div id="additional-fees-container">
        </div>
      `;
    });

    test('should validate a complete form with no errors', () => {
      const form = document.getElementById('new-job-form');
      const errors = validateJobForm(form);
      expect(errors).toHaveLength(0);
    });

    test('should return error when company is not selected', () => {
      const form = document.getElementById('new-job-form');
      const select = form.querySelector('select');
      select.value = '';
      
      const errors = validateJobForm(form);
      expect(errors).toContain('กรุณาเลือกบริษัท/สถานที่รับงาน');
    });

    test('should return error when assigned by field is empty', () => {
      const form = document.getElementById('new-job-form');
      const assignedBy = form.querySelector('input[placeholder="ชื่อผู้มอบงาน"]');
      assignedBy.value = '';
      
      const errors = validateJobForm(form);
      expect(errors).toContain('กรุณากรอกชื่อผู้มอบงาน');
    });

    test('should return error when contact field is empty', () => {
      const form = document.getElementById('new-job-form');
      const contact = form.querySelector('input[placeholder="ข้อมูลติดต่อ"]');
      contact.value = '';
      
      const errors = validateJobForm(form);
      expect(errors).toContain('กรุณากรอกข้อมูลติดต่อ');
    });

    test('should return error when pickup province is empty', () => {
      const form = document.getElementById('new-job-form');
      const pickupProvince = form.querySelector('input[placeholder="จังหวัด"]');
      pickupProvince.value = '';
      
      const errors = validateJobForm(form);
      expect(errors).toContain('กรุณากรอกจังหวัดรับของ');
    });

    test('should return error when pickup district is empty', () => {
      const form = document.getElementById('new-job-form');
      const pickupDistrict = form.querySelector('input[placeholder="เขต/อำเภอ"]');
      pickupDistrict.value = '';
      
      const errors = validateJobForm(form);
      expect(errors).toContain('กรุณากรอกเขต/อำเภอรับของ');
    });

    test('should return error when no job details are provided', () => {
      document.body.innerHTML = `
        <form id="new-job-form">
          <select>
            <option value="บจก.เวอริโฟน (ชั้น 3.2)">บจก.เวอริโฟน (ชั้น 3.2)</option>
          </select>
          <input placeholder="ชื่อผู้มอบงาน" value="John Doe">
          <input placeholder="ข้อมูลติดต่อ" value="0812345678">
          <input placeholder="จังหวัด" value="กรุงเทพมหานคร">
          <input placeholder="เขต/อำเภอ" value="สาทร">
        </form>
      `;
      
      const form = document.getElementById('new-job-form');
      const errors = validateJobForm(form);
      expect(errors).toContain('กรุณาเพิ่มรายละเอียดงานอย่างน้อย 1 รายการ');
    });

    test('should return error when job detail fields are incomplete', () => {
      document.body.innerHTML = `
        <form id="new-job-form">
          <select>
            <option value="บจก.เวอริโฟน (ชั้น 3.2)">บจก.เวอริโฟน (ชั้น 3.2)</option>
          </select>
          <input placeholder="ชื่อผู้มอบงาน" value="John Doe">
          <input placeholder="ข้อมูลติดต่อ" value="0812345678">
          <input placeholder="จังหวัด" value="กรุงเทพมหานคร">
          <input placeholder="เขต/อำเภอ" value="สาทร">
          
          <div class="job-detail-card">
            <input value="">
            <input value="">
            <input value="">
            <input value="">
            <textarea></textarea>
            <input class="amount-input" value="">
          </div>
        </form>
      `;
      
      const form = document.getElementById('new-job-form');
      const errors = validateJobForm(form);
      expect(errors).toContain('กรุณากรอกบริษัทปลายทางสำหรับงาน #1');
      expect(errors).toContain('กรุณากรอกจังหวัดส่งของสำหรับงาน #1');
      expect(errors).toContain('กรุณากรอกเขต/อำเภอส่งของสำหรับงาน #1');
      expect(errors).toContain('กรุณากรอกชื่อผู้รับงานสำหรับงาน #1');
      expect(errors).toContain('กรุณากรอกรายละเอียดงาน #1');
      expect(errors).toContain('กรุณากรอกจำนวนเงินที่ถูกต้องสำหรับงาน #1');
    });

    test('should validate additional fees correctly', () => {
      document.body.innerHTML = `
        <form id="new-job-form">
          <select>
            <option value="บจก.เวอริโฟน (ชั้น 3.2)">บจก.เวอริโฟน (ชั้น 3.2)</option>
          </select>
          <input placeholder="ชื่อผู้มอบงาน" value="John Doe">
          <input placeholder="ข้อมูลติดต่อ" value="0812345678">
          <input placeholder="จังหวัด" value="กรุงเทพมหานคร">
          <input placeholder="เขต/อำเภอ" value="สาทร">
          
          <div class="job-detail-card">
            <input value="บจก.ปลายทาง">
            <input value="จังหวัดปลายทาง">
            <input value="เขตปลายทาง">
            <input value="ผู้รับงาน">
            <textarea>รายละเอียดงาน</textarea>
            <input class="amount-input" value="1000">
          </div>
        </form>
        
        <div id="additional-fees-container">
          <div>
            <select>
              <option value="บรรทุก">บรรทุก</option>
            </select>
            <input value="">
          </div>
        </div>
      `;
      
      const form = document.getElementById('new-job-form');
      const errors = validateJobForm(form);
      expect(errors).toContain('กรุณากรอกจำนวนเงินสำหรับค่าบริการเพิ่มเติม #1');
    });
  });
});