import { user } from 'data/userdata.js';

const login = [
    {
        email: user[0].email,
        password: user[0].password,
    }
];

function showSection(sectionId) {
    document.querySelectorAll('.auth-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-bg-success)' : type === 'error' ? 'var(--color-bg-danger)' : 'var(--color-bg-card)'};
        color: ${type === 'success' ? 'var(--color-text-success)' : type === 'error' ? 'var(--color-text-danger)' : 'var(--color-text-primary)'};
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        border-left: 4px solid ${type === 'success' ? 'var(--color-text-success)' : type === 'error' ? 'var(--color-text-danger)' : 'var(--color-primary)'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const userLogin = login.find(u => u.email === email);
    
    if (userLogin) {
        if (userLogin.password === password) {
            showNotification(`Login realizado com sucesso! Bem-vindo(a), ${user[0].name}!`, 'success');
            
            setTimeout(() => {
                window.location.href = '../pages/home.html';
            }, 1000);
        } else {
            showNotification('Senha incorreta. Tente novamente.', 'error');
            document.getElementById('loginPassword').style.borderColor = 'var(--color-text-danger)';
        }
    } else {
        showNotification('Email não encontrado. Verifique ou crie uma conta.', 'error');
        document.getElementById('loginEmail').style.borderColor = 'var(--color-text-danger)';
    }
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem. Verifique e tente novamente.', 'error');
        document.getElementById('confirmPassword').style.borderColor = 'var(--color-text-danger)';
        return;
    }
    
    const existingUser = login.find(u => u.email === email);
    if (existingUser) {
        showNotification('Este email já está cadastrado. Tente fazer login.', 'error');
        document.getElementById('signupEmail').style.borderColor = 'var(--color-text-danger)';
        return;
    }
    
    const strength = checkPasswordStrength(password);
    if (strength !== 'strong') {
        showNotification('Sua senha precisa ser mais forte para maior segurança.', 'error');
        return;
    }
    
    showNotification('Conta criada com sucesso! Redirecionando para login...', 'success');
    
    setTimeout(() => {
        this.reset();
        document.getElementById('passwordStrength').className = 'password-strength';
        document.querySelectorAll('.password-requirements li').forEach(li => {
            li.className = 'invalid';
        });
        showSection('loginSection');
    }, 2000);
});

document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('recoveryEmail').value;
    
    const userRecovery = login.find(u => u.email === email);
    
    if (userRecovery) {
        showNotification(`Instruções de recuperação enviadas para: ${email}`, 'success');
        
        setTimeout(() => {
            this.reset();
            showSection('loginSection');
        }, 2000);
    } else {
        showNotification('Email não encontrado. Verifique o endereço digitado.', 'error');
        document.getElementById('recoveryEmail').style.borderColor = 'var(--color-text-danger)';
    }
});

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    
    if (strength === 1) return 'weak';
    if (strength === 2) return 'medium';
    if (strength === 3) return 'strong';
    return 'weak';
}

document.getElementById('signupPassword').addEventListener('input', function() {
    const password = this.value;
    const strengthBar = document.querySelector('.password-strength-bar');
    const strengthContainer = document.getElementById('passwordStrength');
    const reqLength = document.getElementById('reqLength');
    const reqUppercase = document.getElementById('reqUppercase');
    const reqNumber = document.getElementById('reqNumber');
    
    strengthContainer.className = 'password-strength';
    reqLength.className = 'invalid';
    reqUppercase.className = 'invalid';
    reqNumber.className = 'invalid';
    
    let strength = 0;
    
    if (password.length >= 8) {
        strength += 1;
        reqLength.className = 'valid';
    }
    
    if (/[A-Z]/.test(password)) {
        strength += 1;
        reqUppercase.className = 'valid';
    }
    
    if (/[0-9]/.test(password)) {
        strength += 1;
        reqNumber.className = 'valid';
    }
    
    if (strength === 1) {
        strengthContainer.classList.add('weak');
    } else if (strength === 2) {
        strengthContainer.classList.add('medium');
    } else if (strength === 3) {
        strengthContainer.classList.add('strong');
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = this.value;
    
    if (confirmPassword && password !== confirmPassword) {
        this.style.borderColor = 'var(--color-text-danger)';
    } else {
        this.style.borderColor = 'var(--color-border)';
    }
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = 'var(--color-border)';
    });
});

document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', function() {
        showNotification(`Login com ${this.querySelector('span').textContent} em desenvolvimento`, 'info');
    });
});