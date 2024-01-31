import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    //obtienes los valores del cuerpo de la peticion
    const { email, password, username } = req.body;
    //comprueba si hay un campo vacio
    if (!email || !password || !username) {
      return res.sendStatus(400);
    };
    //comprueba si el usuario ya existe en la base
    const existUser = await getUserByEmail(email);
    if (existUser) {
      return res.sendStatus(400);
    };
    //crea el usuario y encripta el password
    const salt = random();
    const user = createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  };
};
