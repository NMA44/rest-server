const { response, json } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res
        .status(400)
        .json({ msg: "Usuario / Pasword no son correctos - correo" });
    }

    //Si el usuario esta activo
    if (!usuario.estado) {
      return res
        .status(400)
        .json({ msg: "Usuario / Pasword no son correctos - estado:false" });
    }
    //Verificar la constraseña

    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ msg: "Usuario / Pasword no son correctos - password" });
    }

    //Generar el JWT

    const token = await generarJWT(usuario.id);

    res.json({ usuario, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hable con el administrador" });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    //const googleUser = await googleVerify(id_token);
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: ":p",
        img,
        google: true,
      };
      usuario = new Usuario(data);
      await usuario.save();
    }
    //Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador,usuario bloqueado",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({ ok: false, msg: "El token no se pudo verificar" });
  }
};

module.exports = {
  login,
  googleSignIn,
};
