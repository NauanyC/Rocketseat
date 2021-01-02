import { Router } from "express";
import AuthenticateUserService from "../services/AuthenticateUserService";

const sessionRouters = Router();

sessionRouters.post("/", async (request, response) => {
  try {
    const AuthenticateUser = new AuthenticateUserService();
    const { email, password } = request.body;

    const { user, token } = await AuthenticateUser.execute({ email, password });

    delete user.password;

    return response.status(200).json({ user, token });
  } catch (error) {
    return response.status(error.statusCode).json({ error: error.message });
  }
});

export default sessionRouters;
