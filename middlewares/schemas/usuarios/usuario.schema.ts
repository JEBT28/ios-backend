import * as yup from 'yup';
export const usuarioSchema = yup.object({
    body: yup.object({
        usuario: yup.string().required(),
        contrasena: yup.string().min(6).required(),
        nombre: yup.string().required(),
        apellido: yup.string().required(),
    })
})


export const editarUsuarioSchema = yup.object({
    body: yup.object({
        usuario: yup.string().required(),
        nombre: yup.string().required(),
        apellido: yup.string().required(),
    }),
    params: yup.object({
        usuario: yup.string().required()
    })
});
export const eliminarUsuarioSchema = yup.object({
    params: yup.object({
        usuario: yup.string().required()
    })
});

export const editarContraseñaSchema = yup.object({
    body: yup.object({
        actual: yup.string().required(),
        nueva: yup.string().min(6).required(),
    }),
});

export const iniciarSesionSchema = yup.object({
    body: yup.object({
        usuario: yup.string().required(),
        contrasena: yup.string().required(),
    })
});