// test-login.js
const sql = require('mssql');

async function testLogin() {
    // Prueba 1: Con mr
    console.log('=== Probando con usuario mr ===');
    try {
        const config1 = {
            user: 'mr',
            password: 'admin',
            server: 'DESKTOP-G4U7372',
            options: {
                encrypt: false,
                trustServerCertificate: true
            }
        };
        await sql.connect(config1);
        console.log('✅ Conexión exitosa con mr');
        await sql.close();
    } catch (err) {
        console.error('❌ Error con mr:', err.message);
    }

    // Prueba 2: Con sa
    console.log('\n=== Probando con usuario sa ===');
    try {
        const config2 = {
            user: 'sa',
            password: 'tu_contraseña_sa', // Cambia esto
            server: 'DESKTOP-G4U7372',
            options: {
                encrypt: false,
                trustServerCertificate: true
            }
        };
        await sql.connect(config2);
        console.log('✅ Conexión exitosa con sa');
        await sql.close();
    } catch (err) {
        console.error('❌ Error con sa:', err.message);
    }
}

testLogin();