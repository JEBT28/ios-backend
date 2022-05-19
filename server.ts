import express , {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

//----------Rutas-----------
import * as AlumnosRutas from './routes/alumnos.routes';
import * as MateriasRutas from './routes/materias.routes';
import * as MaestrosRutas from './routes/maestros.routes';

const server = express();

server.use(express.json());
server.get('/', (req:Request, res:Response) => {
res.send('BackEnd de Prueba');
});

server.use('/alumnos', AlumnosRutas.default);
server.use("/materias", MateriasRutas.default);
server.use("/maestros", MaestrosRutas.default);

server.get("*",(res:Response)=>{
    res.status(404).send("Ruta no encontrada");
})

const port = process.env.PORT || 3000;

server.listen(port, ()=>{
    console.log("Escuchando Puerto: " + port);
})


