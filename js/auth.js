// Authentication functions
function showLoginScreen() {
    showPage('login-screen');
}

function showRegisterScreen() {
    showPage('register-screen');
}

function logout() {
    localStorage.removeItem('mangpongUser');
    currentUser = null;
    showPage('login-screen');
}

async function handleLogin(username, password) {
    // Show loading
    Swal.fire({
        title: 'กำลังเข้าสู่ระบบ...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const response = await submitToGoogleSheets({
            action: 'login',
            username: username,
            password: password
        });

        if (response.success) {
            currentUser = response.user;
            localStorage.setItem('mangpongUser', JSON.stringify(currentUser));

            // Show success and redirect
            await Swal.fire({
                icon: 'success',
                title: 'เข้าสู่ระบบสำเร็จ!',
                text: `ยินดีต้อนรับ ${currentUser.fullName}`,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#10b981'
            });

            // Show main app
            showPage('app');
            document.getElementById('user-display-name').textContent = currentUser.fullName;

            // Initialize app
            if (typeof initializeApp === 'function') {
                initializeApp();
            }

        } else {
            await Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: response.error,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#ef4444'
            });
        }

    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: error.message,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#ef4444'
        });
    }
}

async function handleRegister(username, password, fullName, phone, email) {
    // Show loading
    Swal.fire({
        title: 'กำลังสมัครสมาชิก...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const response = await submitToGoogleSheets({
            action: 'register',
            username: username,
            password: password,
            fullName: fullName,
            phone: phone,
            email: email
        });

        if (response.success) {
            await Swal.fire({
                icon: 'success',
                title: 'สมัครสมาชิกสำเร็จ!',
                text: 'คุณสามารถเข้าสู่ระบบได้แล้ว',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#10b981'
            });

            // Clear form and show login screen
            document.getElementById('register-form').reset();
            showPage('login-screen');

        } else {
            await Swal.fire({
                icon: 'error',
                title: 'สมัครสมาชิกไม่สำเร็จ',
                text: response.error,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#ef4444'
            });
        }

    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: error.message,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#ef4444'
        });
    }
}
