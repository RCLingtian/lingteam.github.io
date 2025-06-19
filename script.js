// 记录上一次滚动的位置
let lastScrollTop = 0;
// 获取导航栏元素（对应 HTML 中的 .flex-Top）
const nav = document.querySelector('.flex-Top');

// 监听窗口滚动事件
window.addEventListener('scroll', () => {
    // 获取当前滚动的垂直位置（兼容不同浏览器）
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

    // 向下滚动逻辑（当前位置 > 上次位置，且滚动距离超过 10px 防误触）
    if (currentScrollTop > lastScrollTop && currentScrollTop > 10) {
        nav.classList.add('hide'); // 添加隐藏类（触发向上动画）
    } 
    // 向上滚动逻辑（当前位置 < 上次位置）
    else {
        nav.classList.remove('hide'); // 移除隐藏类（触发向下动画）
    }

    // 更新上次滚动位置为当前位置
    lastScrollTop = currentScrollTop;
});