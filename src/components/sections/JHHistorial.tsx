
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

      {/* Dialog para ver recibo */}
      <Dialog open={isVerOpen} onOpenChange={setIsVerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Recibo</DialogTitle>
            <DialogDescription>
              Información completa del recibo seleccionado
            </DialogDescription>
          </DialogHeader>
          {reciboSeleccionado && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Información del Recibo</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">N° Pedido:</span>
                    <div className="font-medium">{reciboSeleccionado.numeroPedido}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de Emisión:</span>
                    <div className="font-medium">{reciboSeleccionado.fechaEmision}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Monto:</span>
                    <div className="font-medium">{reciboSeleccionado.monto} {reciboSeleccionado.tipoMoneda}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Método de Pago:</span>
                    <div className="font-medium">{reciboSeleccionado.metodoPago}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Datos del Cliente</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <div className="font-medium">{reciboSeleccionado.cliente.nombre}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Contacto:</span>
                    <div className="font-medium">{reciboSeleccionado.cliente.contacto}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Dirección:</span>
                    <div className="font-medium">{reciboSeleccionado.cliente.direccion}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Badge 
                  variant={
                    reciboSeleccionado.estado === 'pagado' ? 'secondary' : 
                    reciboSeleccionado.estado === 'cancelado' ? 'destructive' : 'default'
                  }
                  className="text-base px-4 py-2"
                >
                  Estado: {reciboSeleccionado.estado === 'pagado' ? 'Pagado' : 
                           reciboSeleccionado.estado === 'cancelado' ? 'Cancelado' : 'Pendiente'}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JHHistorial;
