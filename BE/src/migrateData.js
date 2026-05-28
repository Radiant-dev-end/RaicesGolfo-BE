const fs = require('fs');
const path = require('path');
const { sequelize, Habitacion, Tour, Opinion, Caracteristica, Role, Usuario } = require('./models/index.js');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Read db.json
        const dataPath = path.join(__dirname, '../../FE/db.json');
        if (!fs.existsSync(dataPath)) {
            console.log('db.json not found!');
            return;
        }
        
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const dbJson = JSON.parse(rawData);

        // Migrate Roles
        console.log('Migrando roles...');
        const defaultRoles = [
            { id_roles: 1, nombre: 'admin', fecha: new Date() },
            { id_roles: 2, nombre: 'cliente', fecha: new Date() }
        ];
        for (const r of defaultRoles) {
            const existingRole = await Role.findByPk(r.id_roles);
            if (!existingRole) {
                await Role.create(r);
            }
        }
        console.log('Roles migrados.');

        // Migrate Users
        if (dbJson.users && dbJson.users.length > 0) {
            console.log(`Migrating ${dbJson.users.length} usuarios...`);
            const bcrypt = require('bcrypt');
            for (const user of dbJson.users) {
                const cleanEmail = user.email.trim().toLowerCase();
                const existingUser = await Usuario.findOne({ where: { email: cleanEmail } });
                if (!existingUser) {
                    const passwordHash = await bcrypt.hash(user.password || '123456', 10);
                    let id_roles = 2; // Default a cliente
                    if (user.role) {
                        const cleanRole = user.role.trim().toLowerCase();
                        if (cleanRole === 'admin') id_roles = 1;
                    }
                    await Usuario.create({
                        email: cleanEmail,
                        password: passwordHash,
                        id_roles: id_roles,
                        nombre: user.name || 'Usuario',
                        foto: user.photo || ''
                    });
                }
            }
            console.log('Usuarios migrados.');
        }

        // Ensure at least one Caracteristica exists for Habitaciones
        let caracteristica = await Caracteristica.findOne();
        if (!caracteristica) {
            caracteristica = await Caracteristica.create({
                nombre: 'General',
                icono: 'fas fa-star'
            });
            console.log('Created default Caracteristica');
        }

        // Migrate Habitaciones
        if (dbJson.habitaciones && dbJson.habitaciones.length > 0) {
            console.log(`Migrating ${dbJson.habitaciones.length} habitaciones...`);
            for (const hab of dbJson.habitaciones) {
                // Check if it already exists
                const existing = await Habitacion.findOne({ where: { nombre: hab.nombre } });
                if (!existing) {
                    await Habitacion.create({
                        id_caracteristicas: caracteristica.id_caracteristicas,
                        numero: hab.id.substring(0, 10),
                        nombre: hab.nombre,
                        descripcion: hab.descripcion,
                        precio_noche: hab.precio,
                        capacidad: hab.capacidad,
                        tipo: hab.tipo,
                        disponible: hab.disponible,
                        imagen: hab.imagen || '',
                        estado: hab.status || 'disponible',
                        features: hab.features || []
                    });
                }
            }
            console.log('Habitaciones migrated.');
        }

        // Migrate Tours
        if (dbJson.tours && dbJson.tours.length > 0) {
            console.log(`Migrating ${dbJson.tours.length} tours...`);
            for (const tour of dbJson.tours) {
                const existing = await Tour.findOne({ where: { nombre: tour.nombre } });
                if (!existing) {
                    await Tour.create({
                        nombre: tour.nombre,
                        descripcion: tour.descripcion,
                        precio: tour.precio,
                        duracion: tour.duracion,
                        tipo: tour.tipo,
                        estado: tour.disponible
                    });
                }
            }
            console.log('Tours migrated.');
        }

        // Migrate Opiniones
        if (dbJson.opiniones && dbJson.opiniones.length > 0) {
            console.log(`Migrating ${dbJson.opiniones.length} opiniones...`);
            for (const op of dbJson.opiniones) {
                const existing = await Opinion.findOne({ where: { nombre: op.nombre, comentario: op.comentario } });
                if (!existing) {
                    await Opinion.create({
                        nombre: op.nombre || 'Anónimo',
                        imagen: op.imagen || 'https://via.placeholder.com/150',
                        calificacion: op.calificacion || 5,
                        comentario: op.comentario || '',
                        experiencia: op.experiencia || 'General'
                    });
                }
            }
            console.log('Opiniones migrated.');
        }

        console.log('Migration completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
