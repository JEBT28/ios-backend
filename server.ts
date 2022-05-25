import express , {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

//----------Rutas-----------
import * as UsuariosRutas from './routes/usuarios.routes';

const server = express();

server.use(express.json());
server.get('/', (req:Request, res:Response) => {
res.send('BackEnd de Prueba');
});

server.use("/usuarios", UsuariosRutas.default);

server.get("*",(res:Response)=>{
    res.status(404).send("Ruta no encontrada");
})

const port = process.env.PORT || 3000;

server.listen(port, ()=>{
    console.log("Escuchando Puerto: " + port);
})


