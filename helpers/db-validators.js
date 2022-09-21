const role = require("../models/role");
const usuario = require("../models/usuario");

const esRoleValido = async (rol = "") => {
  const existeRol = await role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la DB`);
  }
};

// Verificar si el correo existe
const emailExist = async (correo = "") => {
  const existeEmail = await usuario.findOne({ correo: correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya esta registrado en la DB`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};

module.exports = {
  esRoleValido,
  emailExist,
  existeUsuarioPorId,
};
