let apiKey = '';
let userName = `用户${Math.floor(100000 + Math.random() * 900000)}`;
// 设置 AI 固定头像路径
let aiAvatar = './img/ai.jpg';
// 设置用户固定头像路径
let userAvatar = './img/user.jpg';
const combinedInput = document.getElementById('combinedInput');
const sendButton = document.getElementById('sendButton');
let thinkingTimer;
let thinkingStartTime;

// 初始化页面时清除聊天历史
window.onload = function() {
    clearChatHistory();
    if (!apiKey) {
        combinedInput.placeholder = "请输入 OPEN API";
    }
};

// 处理输入
function handleInput(event) {
    if (event && event.type === 'keypress' && event.key!== 'Enter') {
        return;
    }
    if (event) {
        event.preventDefault();
    }

    const inputValue = combinedInput.value.trim();
    if (!inputValue) return;

    if (!apiKey) {
        // 尝试设置 API Key
        apiKey = inputValue;
        combinedInput.value = '';
        combinedInput.placeholder = "请输入聊天内容";
        // 发送初始化消息
        const initMessage = "你好";
        sendToAI(initMessage, false);
    } else {
        // 发送聊天消息
        appendMessage(inputValue, 'user');
        sendToAI(inputValue, false);
        combinedInput.value = '';
    }
}

// 发送消息到AI
function sendToAI(message, show) {
    sendButton.disabled = true;
    thinkingStartTime = Date.now();
    // 初始显示已思考 0 秒
    combinedInput.placeholder = "已思考 0 秒"; 
    thinkingTimer = setInterval(updateThinkingTime, 1000);

    const data = {
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": message}],
        temperature: 0.7
    };
    fetch('https://api.chatanywhere.tech/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API 请求失败，状态码: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.choices && data.choices.length > 0) {
            const aiResponse = data.choices[0].message.content;
            appendMessage(aiResponse, 'ai');
        }
    })
    .catch(error => {
        console.error('请求失败:', error);
        // API 错误，清空 API Key
        clearAPI();
        combinedInput.placeholder = "API 错误，请重新输入 OPEN API";
    })
    .finally(() => {
        clearInterval(thinkingTimer);
        // 思考完成提示
        combinedInput.placeholder = "思考完成"; 
        setTimeout(() => {
            combinedInput.placeholder = apiKey? "请输入聊天内容" : "请输入 OPEN API";
        }, 2000);
        sendButton.disabled = false;
    });
}

// 更新思考时间
function updateThinkingTime() {
    const elapsedSeconds = Math.floor((Date.now() - thinkingStartTime) / 1000);
    combinedInput.placeholder = `已思考 ${elapsedSeconds} 秒`;
}

// 添加消息到聊天框
function appendMessage(message, type) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatarNameContainer = document.createElement('div');
    avatarNameContainer.className = 'avatar-name-container';

    const avatarImg = document.createElement('img');
    avatarImg.className = 'avatar';
    avatarImg.src = type === 'ai' ? aiAvatar : userAvatar;

    const nameP = document.createElement('p');
    nameP.className = 'name';
    nameP.textContent = type === 'ai' ? 'Gpt-3.5-turbo' : userName;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble';
    bubbleDiv.textContent = message;

    if (type === 'ai') {
        avatarNameContainer.appendChild(avatarImg);
        avatarNameContainer.appendChild(nameP);
    } else {
        avatarNameContainer.appendChild(nameP);
        avatarNameContainer.appendChild(avatarImg);
    }

    messageDiv.appendChild(avatarNameContainer);
    messageDiv.appendChild(bubbleDiv);

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 清空聊天历史
function clearChatHistory() {
    // 只清空带有特定类名的元素
    const elementsToClear = document.querySelectorAll('.content-to-clear');
    elementsToClear.forEach(element => {
        element.innerHTML = '';
    });

    // 先清空 chat-container
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.innerHTML = '';
    
    // 然后创建按钮并插入
    const button = document.createElement('button');
    button.className = 'chat-switch-button';
    button.title = '切换好友聊天';
    button.innerHTML = `
        <svg t="1747290568964" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4563" width="200" height="200">
            <path d="M892.224 117.024c-83.936-83.936-231.648-81.12-387.616-3.84-155.936-77.28-303.68-80.096-387.616 3.84-69.76 69.76-79.488 183.552-36.64 309.344a95.776 95.776 0 0 0 12.992 122.528c-55.936 136.896-53.472 266.176 23.68 343.328 83.936 83.936 231.712 81.152 387.776 3.776 152.8 75.68 302.016 81.632 387.424-3.776 85.44-85.44 79.424-234.72 3.68-387.584 75.744-152.896 81.76-302.176-3.68-387.616z m-45.248 729.952c-96.416 96.416-332.64 29.408-523.36-161.344a31.968 31.968 0 1 0-45.248 45.248 913.056 913.056 0 0 0 157.376 126.304c-117.248 47.904-219.104 44.128-273.472-10.24-55.776-55.776-56.544-158.368-10.656-271.808 2.816 0.256 5.504 0.864 8.384 0.864a96 96 0 0 0 96-96c0-21.024-6.944-40.288-18.4-56.096a870.592 870.592 0 0 1 86.016-100.288 31.968 31.968 0 1 0-45.248-45.248 933.6 933.6 0 0 0-93.472 109.344A92.928 92.928 0 0 0 160 384a95.68 95.68 0 0 0-24.736 3.616c-28.704-96.448-19.776-178.56 27.008-225.344 62.368-62.368 187.264-58.176 326.112 14.24a31.008 31.008 0 0 0 16.544 3.04 31.104 31.104 0 0 0 16.032-3.104c138.816-72.352 263.648-76.544 326.016-14.176 56 56 56.544 159.2 10.048 273.216a879.36 879.36 0 0 0-67.584-92.48c6.528-11.584 10.56-24.768 10.56-39.008a80 80 0 1 0-80 80c6.368 0 12.48-0.928 18.4-2.336a795.968 795.968 0 0 1 85.408 122.944c-31.52 56.672-73.984 114.08-126.176 168.352-3.2-0.384-6.336-0.96-9.632-0.96a80 80 0 1 0 65.792 34.624 901.056 901.056 0 0 0 103.232-132.864c46.464 113.984 45.952 217.216-10.048 273.216z" p-id="4564"></path>
            <path d="M512 384a128 128 0 1 0 0 256 128 128 0 0 0 0-256z m0 192a64 64 0 1 1 0.032-128.032A64 64 0 0 1 512 576z" p-id="4565"></path>
        </svg>
    `;
    chatContainer.appendChild(button);
}

// 清空API
function clearAPI() {
    apiKey = '';
    combinedInput.placeholder = "请输入 OPEN API";
}
