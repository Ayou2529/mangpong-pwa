// Format date as DD/MM/YYYY for Thai input
function formatThaiDateInput(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear() + 543;
    return `${day}/${month}/${year}`;
}

// Format date as YYYY-MM-DD for input[type="date"]
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Convert date to Thai format for display
function formatThaiDate(dateString) {
    const date = new Date(dateString);
    const thaiYear = date.getFullYear() + 543;
    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = thaiYear;

    return `${day}/${month}/${year}`;
}

// Parse Thai date format DD/MM/YYYY to Date object
function parseThaiDate(thaiDateStr) {
    if (!thaiDateStr || !thaiDateStr.includes('/')) {
        return new Date();
    }

    const parts = thaiDateStr.split('/');
    if (parts.length !== 3) {
        return new Date();
    }

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is 0-indexed
    const thaiYear = parseInt(parts[2]);
    const gregorianYear = thaiYear - 543;

    return new Date(gregorianYear, month, day);
}

function getStatusBadge(status) {
    switch (status) {
        case 'incomplete':
            return { class: 'incomplete-badge', text: 'ไม่สมบูรณ์' };
        case 'draft':
            return { class: 'draft-badge', text: 'ร่าง' };
        default:
            return { class: 'complete-badge', text: 'สมบูรณ์' };
    }
}
