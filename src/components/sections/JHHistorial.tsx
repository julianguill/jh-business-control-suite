
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Calendar, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Recibo {
  id: string;
  numeroPedido: string;
  fechaEmision: string;
  cliente: {
    nombre: string;
    contacto: string;
    direccion: string;
  };
  monto: string;
  tipoMoneda: string;
  metodoPago: string;
  estado: 'pendiente' | 'pagado' | 'cancelado';
}

const JHHistorial = () => {
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [filtro, setFiltro] = useState('');
  const [reciboSeleccionado, setReciboSeleccionado] = useState<Recibo | null>(null);
  const [isVerOpen, setIsVerOpen] = useState(false);

  useEffect(() => {
    const recibosGuardados = JSON.parse(localStorage.getItem('jhRecibos') || '[]');
    setRecibos(recibosGuardados);
  }, []);

  const recibosFiltrados = recibos.filter(recibo => 
    recibo.numeroPedido.toLowerCase().includes(filtro.toLowerCase()) ||
    recibo.cliente.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const verRecibo = (recibo: Recibo) => {
    setReciboSeleccionado(recibo);
    setIsVerOpen(true);
  };

  const totalRecibos = recibos.length;
  const totalMonto = recibos.reduce((acc, r) => acc + parseFloat(r.monto), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Recibos</h1>
        <p className="text-lg text-gray-600">Consulta todos los recibos emitidos en el sistema</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Recibos</CardTitle>
            <FileText className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalRecibos}</div>
            <p className="text-xs text-gray-500">recibos emitidos</p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <Calendar className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalMonto.toFixed(2)}</div>
            <p className="text-xs text-gray-500">valor total facturado</p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recibos Pendientes</CardTitle>
            <FileText className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {recibos.filter(r => r.estado === 'pendiente').length}
            </div>
            <p className="text-xs text-gray-500">por cobrar</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtro de búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por número de pedido o cliente..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de recibos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Recibos ({recibosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">N° Pedido</th>
                  <th className="text-left p-2">Cliente</th>
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Monto</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recibosFiltrados.map((recibo, index) => (
                  <tr 
                    key={recibo.id} 
                    className="border-b hover:bg-gray-50 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-2 font-medium">{recibo.numeroPedido}</td>
                    <td className="p-2">{recibo.cliente.nombre}</td>
                    <td className="p-2 text-sm">{recibo.fechaEmision}</td>
                    <td className="p-2">
                      <Badge variant="default">
                        {recibo.monto} {recibo.tipoMoneda}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge 
                        variant={
                          recibo.estado === 'pagado' ? 'secondary' : 
                          recibo.estado === 'cancelado' ? 'destructive' : 'default'
                        }
                      >
                        {recibo.estado === 'pagado' ? 'Pagado' : 
                         recibo.estado === 'cancelado' ? 'Cancelado' : 'Pendiente'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => verRecibo(recibo)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recibosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron recibos que coincidan con la búsqueda
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para ver recibo - Estilo mejorado tipo imagen de recibo */}
      <Dialog open={isVerOpen} onOpenChange={setIsVerOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-blue-600">RECIBO DE PAGO</DialogTitle>
            <DialogDescription className="text-center">
              Comprobante de transacción comercial
            </DialogDescription>
          </DialogHeader>
          {reciboSeleccionado && (
            <div className="bg-white border-2 border-blue-200 rounded-lg p-8 space-y-6">
              {/* Header del recibo */}
              <div className="text-center border-b-2 border-blue-100 pb-4">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">JH CONTROL</h2>
                <p className="text-gray-600">Sistema de Gestión Empresarial</p>
                <div className="mt-3 inline-block bg-blue-100 px-4 py-2 rounded-full">
                  <span className="text-blue-800 font-semibold">Recibo N° {reciboSeleccionado.numeroPedido}</span>
                </div>
              </div>

              {/* Información principal */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-500 block">FECHA DE EMISIÓN</span>
                    <span className="font-bold text-lg">{reciboSeleccionado.fechaEmision}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-500 block">MÉTODO DE PAGO</span>
                    <span className="font-bold text-lg">{reciboSeleccionado.metodoPago}</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                  <span className="text-sm text-green-600 block mb-1">MONTO TOTAL</span>
                  <span className="text-3xl font-bold text-green-700">
                    {reciboSeleccionado.monto} {reciboSeleccionado.tipoMoneda}
                  </span>
                </div>
              </div>
              
              {/* Información del cliente */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                  DATOS DEL CLIENTE
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex">
                    <span className="text-blue-600 font-medium w-24">Nombre:</span>
                    <span className="font-semibold">{reciboSeleccionado.cliente.nombre}</span>
                  </div>
                  <div className="flex">
                    <span className="text-blue-600 font-medium w-24">Contacto:</span>
                    <span className="font-semibold">{reciboSeleccionado.cliente.contacto}</span>
                  </div>
                  <div className="flex">
                    <span className="text-blue-600 font-medium w-24">Dirección:</span>
                    <span className="font-semibold">{reciboSeleccionado.cliente.direccion}</span>
                  </div>
                </div>
              </div>

              {/* Estado del recibo */}
              <div className="text-center pt-4 border-t-2 border-gray-100">
                <div className="inline-block">
                  <Badge 
                    variant={
                      reciboSeleccionado.estado === 'pagado' ? 'secondary' : 
                      reciboSeleccionado.estado === 'cancelado' ? 'destructive' : 'default'
                    }
                    className="text-lg px-6 py-2"
                  >
                    ESTADO: {reciboSeleccionado.estado === 'pagado' ? 'PAGADO' : 
                             reciboSeleccionado.estado === 'cancelado' ? 'CANCELADO' : 'PENDIENTE'}
                  </Badge>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                <p>Este es un documento generado automáticamente por JH Control</p>
                <p className="mt-1">Para consultas: contacto@jhcontrol.com</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JHHistorial;
