-- tiendas(Id, dinero) -- 
-- productos(Id, Nombre, -Cantidad-, -Precio-) 
-- tiendasConocidas(ipIdCliente, idTiendaDentro, idTiendaConocida, ipTiendaConocida)
-- tiendaProducto(idTienda, idProducto, Precio, Cantidad)
-- tiendaCliente(idTienda, idCliente, -idMensaje-, -horaMensaje-, -accion-, -productoVendido-, -cantidadProducto-)

create table tiendas(Id int, dinero float);
create table productos(Id int, Nombre varchar(20));
create table tiendasConocidas(idCliente int, idTiendaDentro int, idTiendaConocida int, ipTiendaConocida varchar(20));
create table tiendaProducto(idTienda int, idProducto int, precio int, cantidad int);
create table tiendaCliente(idTienda int, idCliente int);