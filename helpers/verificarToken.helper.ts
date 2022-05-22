import jwt from 'jsonwebtoken';

export const verificarToken = (token: string) : Promise<any> => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRETKEY || "", (err: any, decoded: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });

}
