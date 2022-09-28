const { response } = require("express");
const { Categoria } = require("../models");

//ObtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({
    total,
    categorias,
    //resp,
  });
};

//obtenerCategorias - -populate {}

const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  res.json(categoria);
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }
  //Generar la data a Guardar

  const data = { nombre, usuario: req.usuario._id };

  const categoria = await Categoria(data);
  //Guardar DB
  await categoria.save();

  res.status(201).json(categoria);
};

//actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();

  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.json(categoria);
};

//borrarCategoria - estado:false

const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(categoriaBorrada);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
