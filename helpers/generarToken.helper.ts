import jwt from 'jsonwebtoken';

const secretkey = process.env.SECRETKEY || "";

export const generarToken = (usuario: any) => {
    let token;

    token = jwt.sign({ usuario }, secretkey, { expiresIn: '1m' });

    return token;
}