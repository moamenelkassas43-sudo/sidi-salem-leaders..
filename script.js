// إدارة الوضع الفاتح والغامق (Theme Manager)
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    const htmlTag = document.documentElement;

    // استرجاع التفضيل المحفوظ أو اعتماد الوضع الفاتح افتراضياً
    const savedTheme = localStorage.getItem('siteTheme') || 'light';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlTag.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        htmlTag.setAttribute('data-theme', theme);
        localStorage.setItem('siteTheme', theme);
        
        if (themeIcon && themeText) {
            if (theme === 'dark') {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'الوضع الفاتح';
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'الوضع الغامق';
            }
        }
    }

    // معالجة نموذج التواصل في index.html
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const date = new Date().toLocaleDateString('ar-EG');

            const existingMessages = JSON.parse(localStorage.getItem('siteMessages')) || [];
            existingMessages.push({ name, email, message, date });
            localStorage.setItem('siteMessages', JSON.stringify(existingMessages));

            alert('شكراً لك! تم إرسال رسالتك بنجاح إلى مؤمن القصاص.');
            contactForm.reset();
        });
    }

    // إدارة لوحة التحكم dashboard.html
    const messagesList = document.getElementById('messagesList');
    const articlesList = document.getElementById('articlesList');
    const addArticleForm = document.getElementById('addArticleForm');

    if (messagesList) loadMessages();
    if (articlesList) loadArticles();

    if (addArticleForm) {
        addArticleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('artTitle').value;
            const category = document.getElementById('artCategory').value;
            const content = document.getElementById('artContent').value;

            const customArticles = JSON.parse(localStorage.getItem('customArticles')) || [];
            customArticles.push({ title, category, content });
            localStorage.setItem('customArticles', JSON.stringify(customArticles));

            alert('تم نشر المقال بنجاح!');
            addArticleForm.reset();
            loadArticles();
            updateIndexArticles(); // تحديث المقالات في الصفحة الرئيسية إن أمكن
        });
    }

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('siteMessages')) || [];
        if (messages.length === 0) {
            messagesList.innerHTML = '<p style="color: var(--text-secondary);">لا توجد رسائل جديدة واردة حالياً.</p>';
            return;
        }

        messagesList.innerHTML = messages.map((msg, index) => `
            <div class="msg-item">
                <div class="msg-header">
                    <span>المرسل: ${msg.name} (${msg.email})</span>
                    <span>التاريخ: ${msg.date}</span>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">${msg.message}</p>
                <button onclick="deleteMessage(${index})" class="btn btn-danger btn-sm">حذف الرسالة</button>
            </div>
        `).join('');
    }

    window.deleteMessage = function(index) {
        let messages = JSON.parse(localStorage.getItem('siteMessages')) || [];
        messages.splice(index, 1);
        localStorage.setItem('siteMessages', JSON.stringify(messages));
        loadMessages();
    };

    function loadArticles() {
        const customArticles = JSON.parse(localStorage.getItem('customArticles')) || [];
        if (customArticles.length === 0) {
            articlesList.innerHTML = '<p style="color: var(--text-secondary);">لم يتم إضافة مقالات جديدة من لوحة التحكم بعد.</p>';
            return;
        }

        articlesList.innerHTML = customArticles.map((art, index) => `
            <div class="msg-item">
                <div class="msg-header">
                    <span>${art.title}</span>
                    <span>التصنيف: ${art.category}</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">${art.content.substring(0, 120)}...</p>
                <button onclick="deleteArticle(${index})" class="btn btn-danger btn-sm">حذف المقال</button>
            </div>
        `).join('');
    }

    window.deleteArticle = function(index) {
        let customArticles = JSON.parse(localStorage.getItem('customArticles')) || [];
        customArticles.splice(index, 1);
        localStorage.setItem('customArticles', JSON.stringify(customArticles));
        loadArticles();
    };
});
