# Distribucion de contenedores
api routes:

- api_actualizar:

  http://localhost:5002/api/usuarios/id_persona

- api_borrar

  http://localhost:5003/api/eliminar/id_persona

- api_consultausuarios:

  - listar todos los usuarios:

    http://localhost:5001/api/usuarios

  -buscar por id:

    http://localhost:5001/api/usuarios/id_persona

- api_registrar:

  http://localhost:5000/api/usuarios

- api_consultalogs:

  - listar todos los logs:

    http://localhost:5004/api/logs

  - buscar por filtros (id, fecha, accion, tipo de documento):

    http://localhost:5004/api/logs/buscar?filtro=valor&filtro=valor
