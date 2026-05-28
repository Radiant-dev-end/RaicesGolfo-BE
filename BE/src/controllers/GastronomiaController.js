const { Gastronomia } = require('../models');

const GastronomiaController = {
  // Obtener todas las gastronomías
  getAll: async (req, res) => {
    try {
      const { tipo } = req.query;
      const where = {};
      if (tipo) {
        where.tipo = tipo;
      }
      const items = await Gastronomia.findAll({ where });
      const mapped = items.map(i => {
        const data = i.toJSON();
        data.id = data.id_gastronomia;
        data.disponible = data.disponible !== undefined ? data.disponible : (data.estado === 'disponible');
        data.precio = Number(data.precio_minimo);
        return data;
      });
      res.json(mapped);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener gastronomía', error: error.message });
    }
  },
  // Obtener por id
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Gastronomia.findByPk(id);
      if (!item) return res.status(404).json({ message: 'Gastronomía no encontrada' });
      const data = item.toJSON();
      data.id = data.id_gastronomia;
      data.disponible = data.disponible !== undefined ? data.disponible : (data.estado === 'disponible');
      data.precio = Number(data.precio_minimo);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar gastronomía', error: error.message });
    }
  },
  // Crear
  create: async (req, res) => {
    try {
      const { nombre, descripcion, precio_minimo, precio_maximo, tipo, disponible, imagen, estado, features } = req.body;
      if (!nombre || !descripcion || precio_minimo === undefined || precio_maximo === undefined || !tipo) {
        return res.status(400).json({ message: 'Campos obligatorios incompletos' });
      }
      if (precio_minimo <= 0 || precio_maximo <= 0) {
        return res.status(400).json({ message: 'El precio debe ser mayor a 0' });
      }
      const newItem = await Gastronomia.create({
        nombre,
        descripcion,
        precio_minimo,
        precio_maximo,
        tipo,
        disponible: disponible !== undefined ? disponible : true,
        imagen: imagen || '',
        estado: estado || 'disponible',
        features: features || []
      });
      const data = newItem.toJSON();
      data.id = data.id_gastronomia;
      data.disponible = data.disponible !== undefined ? data.disponible : (data.estado === 'disponible');
      data.precio = Number(data.precio_minimo);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear gastronomía', error: error.message });
    }
  },
  // Actualizar
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Gastronomia.findByPk(id);
      if (!item) return res.status(404).json({ message: 'Gastronomía no encontrada' });
      const { nombre, descripcion, precio_minimo, precio_maximo, tipo, disponible, imagen, estado, features } = req.body;
      await item.update({
        nombre: nombre !== undefined ? nombre : item.nombre,
        descripcion: descripcion !== undefined ? descripcion : item.descripcion,
        precio_minimo: precio_minimo !== undefined ? precio_minimo : item.precio_minimo,
        precio_maximo: precio_maximo !== undefined ? precio_maximo : item.precio_maximo,
        tipo: tipo !== undefined ? tipo : item.tipo,
        disponible: disponible !== undefined ? disponible : item.disponible,
        imagen: imagen !== undefined ? imagen : item.imagen,
        estado: estado !== undefined ? estado : item.estado,
        features: features !== undefined ? features : item.features
      });
      const data = item.toJSON();
      data.id = data.id_gastronomia;
      data.disponible = data.disponible !== undefined ? data.disponible : (data.estado === 'disponible');
      data.precio = Number(data.precio_minimo);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar gastronomía', error: error.message });
    }
  },
  // Borrar
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Gastronomia.findByPk(id);
      if (!item) return res.status(404).json({ message: 'Gastronomía no encontrada' });
      await item.destroy();
      res.json({ message: 'Gastronomía eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar gastronomía', error: error.message });
    }
  }
};

module.exports = GastronomiaController;
