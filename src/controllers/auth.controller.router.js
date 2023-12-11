import { AuthService } from '../services/auth.service.js';

export class AuthController {
    authService = new AuthService();

    PostCreateAuth = async(req, res, next) => {
        try {
            const { email, password, passwordConfirm, name } = req.body;

            const createdAuth = await this.authService.createAuth(
                email, password, passwordConfirm, name
            );

            return res.status(201).json({ data: createdAuth });
        } catch (err) {
            next(err);
        }
    };

    PostLoginAuth = async(req, res, next) => {
        try {
            const { email, password } = req.body;

            const loginuser = await this.authService.loginAuth(
                email, password, res
            );
            return res.status(200).json(loginuser);
        } catch (error) {
            next(error);
        }
    };

}