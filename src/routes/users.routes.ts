import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/upload";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

import CreateUserService from "../services/CreateUserService";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });

    // User without the password
    const res = { ...user, password };

    return response.json(res);
  } catch (error) {
    return response.status(error.statusCode).json({ error: error.message });
  }
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    try {
      console.log(request.file);
      const updateUserAvatar = new UpdateUserAvatarService();

      const user = await updateUserAvatar.execute({
        userId: request.user.id,
        avatarFileName: request.file.filename,
      });

      delete user.password;

      return response.status(200).json({ user });
    } catch (error) {
      console.log(JSON.stringify(error));
      return response.status(error.statusCode).json({ error: error.message });
    }
  },
);

export default usersRouter;
