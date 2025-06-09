const bcrypt = require('bcrypt');

async function generatePasswords() {
    const passwords = ['admin123', 'medico123', 'enfermero123', 'recepcion123'];
    
    console.log('-- Contraseñas hasheadas para database.sql --');
    
    for (let password of passwords) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`-- ${password}: ${hash}`);
    }
}

generatePasswords();