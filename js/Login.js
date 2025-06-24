// 获取元素
const loginButton = document.querySelector('.Navigation_Login_button'); // 修改为导航栏的登录按钮
const userButton = document.querySelector('.loginBox_login_user_button');
const emailInput = document.getElementById('emailInput');
const agreementCheckbox = document.getElementById('agreementCheckbox');
const errorPopup = document.getElementById('errorPopup');
const overlay = document.getElementById('overlay');
const loginBox = document.getElementById('loginBox');
const closeButton = document.getElementById('closeButton');

// 显示弹窗并添加渐入动画
function showLoginBox() {
    overlay.style.display = 'block';
    loginBox.style.display = 'block';
    overlay.classList.add('fade-in');
    loginBox.classList.add('fade-in');
}

// 隐藏弹窗并添加渐出动画
function hideLoginBox() {
    overlay.classList.add('fade-out');
    loginBox.classList.add('fade-out');
    // 动画结束后隐藏元素
    setTimeout(() => {
        overlay.style.display = 'none';
        loginBox.style.display = 'none';
        overlay.classList.remove('fade-out', 'fade-in');
        loginBox.classList.remove('fade-out', 'fade-in');
    }, 300);
}

// 验证邮箱并处理登录逻辑
function validateEmailAndHandleLogin() {
    const email = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email) && agreementCheckbox.checked) {
        // 存储登录信息
        localStorage.setItem('userEmail', email);
        // 隐藏导航栏登录按钮
        loginButton.style.display = 'none';
        // 显示用户按钮
        userButton.style.display = 'inline-flex';
        userButton.style.alignItems = 'center';
        userButton.style.justifyContent = 'center';
        // 设置用户按钮内容
        const firstChar = email.charAt(0).toUpperCase();
        const username = email.split('@')[0];
        userButton.innerHTML = `<span class="avatar">${firstChar}</span><span class="username">${username}</span>`;
        // 关闭登录弹窗
        hideLoginBox();
    } else {
        // 显示错误提示
        if (errorPopup) {
            errorPopup.style.display = 'block';
            setTimeout(() => {
                errorPopup.style.display = 'none';
            }, 2000);
        }
    }
}

// 处理退出登录逻辑
function logout() {
    // 清除登录信息
    localStorage.removeItem('userEmail');
    // 显示导航栏登录按钮
    loginButton.style.display = 'inline-block';
    // 隐藏用户按钮
    userButton.style.display = 'none';
    // 清空邮箱输入框
    emailInput.value = '';
    // 取消勾选复选框
    agreementCheckbox.checked = false;
    // 清空用户按钮内容
    userButton.innerHTML = '';
}

// 页面加载时检查登录状态
window.addEventListener('load', () => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        loginButton.style.display = 'none';
        userButton.style.display = 'inline-flex';
        userButton.style.alignItems = 'center';
        userButton.style.justifyContent = 'center';
        const firstChar = userEmail.charAt(0).toUpperCase();
        const username = userEmail.split('@')[0];
        userButton.innerHTML = `<span class="avatar">${firstChar}</span><span class="username">${username}</span>`;
    }
});

// 给用户按钮添加点击事件
userButton.addEventListener('click', logout);

// 给关闭按钮添加点击事件
if (closeButton) {
    closeButton.addEventListener('click', hideLoginBox);
}

// 点击遮罩层也可以关闭登录框
if (overlay) {
    overlay.addEventListener('click', hideLoginBox);
}

// 给导航栏登录按钮添加点击事件，显示登录弹窗
loginButton.addEventListener('click', showLoginBox);