// Variables globales
let apiKey = CONFIG.API_KEY;
let isConnected = false;
let conversationHistory = []; // Historial de conversación
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const btnSend = document.getElementById('btnSend');
const apiStatus = document.getElementById('apiStatus');
const btnNewChat = document.getElementById('btnNewChat');

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Enviar mensaje con Enter
messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Botón enviar
btnSend.addEventListener('click', sendMessage);

// Nueva conversación
btnNewChat.addEventListener('click', newChat);

// Verificar conexión al cargar la página
window.addEventListener('load', () => {
    // Cargar historial guardado
    loadChatHistory();
    
    if (apiKey && apiKey !== 'TU_API_KEY_AQUI') {
        isConnected = true;
        updateAPIStatus();
    }
});

// Actualizar estado de conexión
function updateAPIStatus() {
    if (isConnected) {
        apiStatus.classList.remove('disconnected');
        apiStatus.classList.add('connected');
        apiStatus.innerHTML = '<span class="status-dot"></span><span>Conectado</span>';
        btnSend.disabled = false;
    } else {
        apiStatus.classList.remove('connected');
        apiStatus.classList.add('disconnected');
        apiStatus.innerHTML = '<span class="status-dot"></span><span>Desconectado</span>';
        btnSend.disabled = true;
    }
}

// Enviar mensaje
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    if (!isConnected) {
        alert('Por favor configura tu API Key primero');
        return;
    }

    // Agregar mensaje del usuario al chat
    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    btnSend.disabled = true;

    // Mostrar indicador de escritura
    const typingId = showTypingIndicator();

    try {
        const response = await callGeminiAPI(message);
        
        // Remover indicador de escritura
        document.getElementById(typingId).remove();
        
        // Agregar respuesta de la IA
        addMessage(response, 'assistant');
    } catch (error) {
        // Remover indicador de escritura
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();
        
        // Mostrar error
        addErrorMessage(error.message);
        console.error('Error:', error);
    } finally {
        btnSend.disabled = false;
        messageInput.focus();
    }
}

// Llamar API de Gemini
async function callGeminiAPI(message) {
    const url = `${CONFIG.API_ENDPOINT}/${CONFIG.MODEL}:generateContent?key=${apiKey}`;

    // Construir contenido con historial
    const contents = [];
    
    // Agregar historial de conversación
    for (let msg of conversationHistory) {
        contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        });
    }
    
    // Agregar mensaje actual
    contents.push({
        role: 'user',
        parts: [{ text: message }]
    });

    const payload = {
        contents: contents
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Error desconocido en la API';
        throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error('Respuesta inválida de la API');
    }

    return data.candidates[0].content.parts[0].text;
}

// Agregar mensaje al chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Guardar en historial
    conversationHistory.push({
        role: sender,
        content: text
    });
    
    // Guardar en localStorage
    saveChatHistory();
    
    // Scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mostrar indicador de escritura
function showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = 'typing-' + Date.now();
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    messageDiv.appendChild(typingDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv.id;
}

// Mostrar mensaje de error
function addErrorMessage(error) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = `❌ Error: ${error}`;
    chatMessages.appendChild(messageDiv);
    
    // Scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Nueva conversación
function newChat() {
    conversationHistory = []; // Limpiar historial
    saveChatHistory(); // Guardar cambios
    clearChat();
    messageInput.focus();
}

// Limpiar chat
function clearChat() {
    chatMessages.innerHTML = '<div style="text-align: center; color: #888888; margin: auto;"><p style="font-size: 1.2rem; margin-bottom: 0.5rem;">👋 Nueva conversación</p><p style="font-size: 0.9rem;">Comienza a escribir para continuar...</p></div>';
}

// Guardar historial en localStorage
function saveChatHistory() {
    // Mantener solo los últimos MAX_HISTORY mensajes
    const historyToSave = conversationHistory.slice(-CONFIG.MAX_HISTORY);
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(historyToSave));
}

// Cargar historial desde localStorage
function loadChatHistory() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        try {
            conversationHistory = JSON.parse(saved);
            // Mostrar historial en el chat
            if (conversationHistory.length > 0) {
                chatMessages.innerHTML = ''; // Limpiar mensaje de bienvenida
                conversationHistory.forEach(msg => {
                    addMessageToDisplay(msg.content, msg.role);
                });
            }
        } catch (e) {
            console.error('Error al cargar historial:', e);
            conversationHistory = [];
        }
    }
}

// Agregar mensaje solo a la pantalla (sin guardar en historial)
function addMessageToDisplay(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
