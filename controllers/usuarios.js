const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
  //const query = req.query;

  const { q, nombre = "No name" } = req.query;

  res.json({
    msg: "get API-controller",
    q,
    nombre,
  });
};

const usuariosPut = (req, res = response) => {
  //const id=req.params.id
  const { id } = req.params;

  res.json({
    msg: "put API-controller",
    id,
  });
};

const usuariosPost = (req, res = response) => {
  //const body = req.body;
  const { nombre, edad } = req.body;

  res.json({
    msg: "post API-controller",
    nombre,
    edad,
  });
};

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: "delete API-controller",
  });
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
