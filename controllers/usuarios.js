const { response, request } = require("express");
const bcrypt = require("bcrypt");

const Usuario = require("../models/usuario");
const { emailExist } = require("../helpers/db-validators");
const usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  //const query = req.query;

  //const { q, nombre = "No name" } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  /*const usuarios = await Usuario.find({ estado: true })
    .skip(Number(desde))
    .limit(Number(limite));

  const total = await Usuario.countDocuments({ estado: true });*/
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true }).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({
    //lo q esta como comentario es mas lento por los await q tiene, es mejor poner las promesas en un arreglo !!
    //descomenta y fijate en postman las dos formas
    total,
    usuarios,
    //resp,
  });
};

const usuariosPut = async (req, res = response) => {
  //const id=req.params.id
  const { id } = req.params;
  const { _id, password, google, ...resto } = req.body;

  //TODO validar contra base de datos para
  if (password) {
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosPost = async (req, res = response) => {
  //const body = req.body;
  const { nombre, correo, password, rol } = req.body;

  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la constraseña
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  //Guardar en dbConnection

  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  const usuarioAutenticado = req.usuario;

  res.json({ usuario, usuarioAutenticado });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API-controller",
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
