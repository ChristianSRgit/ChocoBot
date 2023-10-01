class Venta {
    constructor(nombreCliente, pedido, metodoPago, valorVenta, comprobante, direccion, diaEnvio) {
        this.nombreCliente = nombreCliente;
        this.pedido = pedido;
        this.metodoPago = metodoPago;
        this.valorVenta = valorVenta;
        this.comprobante = comprobante;
        this.direccion = direccion;
        this.diaEnvio = diaEnvio;
    }

}

module.exports = Venta; 