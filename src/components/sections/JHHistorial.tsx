
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Eye, 
  Filter, 
  FileText, 
  Calendar,
  User,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Recibo {
  id: string;
  numeroPedido: string;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  items: Array<{
    descripcion: string;
    cantidad: number;
    precio: number;
    total: number;
  }>;
  subtotal: number;
  descuento: number;
  total: number;
  monto: number;
  tipoMoneda: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: string;
  notas?: string;
}

const JHHistorial = () => {
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [filtro, setFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [reciboSeleccionado, setReciboSeleccionado] = useState<Recibo | null>(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);

  useEffect(() => {
    const recibosGuardados = JSON.parse(localStorage.getItem('jhRecibos') || '[]');
    setRecibos(recibosGuardados);
  }, []);

  const recibosFiltrados = recibos.filter(recibo => {
    const coincideTexto = recibo.numeroPedido.includes(filtro) ||
                         recibo.cliente.nombre.toLowerCase().includes(filtro.toLowerCase());
    
    const coincideEstado = filtroEstado === 'todos' || recibo.estado === filtroEstado;
    
    return coincideTexto && coincideEstado;
  });

  const verDetalle = (recibo: Recibo) => {
    setReciboSeleccionado(recibo);
    setIsDetalleOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Historial de Recibos
          </h1>
          <p className="text-lg text-gray-600">Consulta y revisa todos los recibos generados</p>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total de Recibos</CardTitle>
            <FileText className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{recibos.length}</div>
            <p className="text-xs text-blue-600 mt-1">recibos generados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Monto Total</CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              ${recibos.reduce((acc, r) => acc + r.total, 0).toFixed(2)}
            </div>
            <p className="text-xs text-green-600 mt-1">valor total facturado</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Este Mes</CardTitle>
            <Calendar className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {recibos.filter(r => {
                const fechaRecibo = new Date(r.fechaEmision);
                const ahora = new Date();
                return fechaRecibo.getMonth() === ahora.getMonth() && 
                       fechaRecibo.getFullYear() === ahora.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-purple-600 mt-1">recibos este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por número de pedido o cliente..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pagado">Pagados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="vencido">Vencidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de recibos */}
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardTitle className="text-xl">Listado de Recibos ({recibosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-700">N° Pedido</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Cliente</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Fecha</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Total</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recibosFiltrados.map((recibo, index) => (
                  <tr 
                    key={recibo.id} 
                    className="border-b hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4 font-medium text-blue-600">#{recibo.numeroPedido}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{recibo.cliente.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{recibo.fechaEmision}</td>
                    <td className="p-4">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        ${recibo.total.toFixed(2)} {recibo.tipoMoneda}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={
                          recibo.estado === 'pagado' ? 'secondary' : 
                          recibo.estado === 'vencido' ? 'destructive' : 'default'
                        }
                      >
                        {recibo.estado === 'pagado' ? 'Pagado' : 
                         recibo.estado === 'vencido' ? 'Vencido' : 'Pendiente'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => verDetalle(recibo)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recibosFiltrados.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No se encontraron recibos que coincidan con los filtros</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para ver detalle del recibo - Versión adaptable */}
      <Dialog open={isDetalleOpen} onOpenChange={setIsDetalleOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-center mb-4">Detalle del Recibo</DialogTitle>
          </DialogHeader>
          {reciboSeleccionado && (
            <div className="bg-white p-4 md:p-6 text-sm">
              {/* Header del recibo */}
              <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
                <h1 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">JH CONTROL</h1>
                <p className="text-gray-600 text-xs md:text-sm">Sistema de Gestión Empresarial</p>
                <div className="mt-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                    RECIBO #{reciboSeleccionado.numeroPedido}
                  </span>
                </div>
              </div>

              {/* Información de fechas y estado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Fecha de Emisión</p>
                    <p className="text-gray-600">{reciboSeleccionado.fechaEmision}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Vencimiento</p>
                    <p className="text-gray-600">{reciboSeleccionado.fechaVencimiento}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    reciboSeleccionado.estado === 'pagado' ? 'bg-green-500' : 
                    reciboSeleccionado.estado === 'vencido' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-gray-700">Estado</p>
                    <p className="text-gray-600 capitalize">{reciboSeleccionado.estado}</p>
                  </div>
                </div>
              </div>

              {/* Información del cliente */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-gray-700">Nombre:</p>
                    <p className="text-gray-600">{reciboSeleccionado.cliente.nombre}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-700">Email:</p>
                      <p className="text-gray-600">{reciboSeleccionado.cliente.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-700">Teléfono:</p>
                      <p className="text-gray-600">{reciboSeleccionado.cliente.telefono}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-700">Dirección:</p>
                      <p className="text-gray-600">{reciboSeleccionado.cliente.direccion}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles de items */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">Detalle de Servicios/Productos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-2 border-b font-semibold">Descripción</th>
                        <th className="text-center p-2 border-b font-semibold w-16">Cant.</th>
                        <th className="text-right p-2 border-b font-semibold w-20">Precio</th>
                        <th className="text-right p-2 border-b font-semibold w-20">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reciboSeleccionado.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{item.descripcion}</td>
                          <td className="p-2 text-center">{item.cantidad}</td>
                          <td className="p-2 text-right">${item.precio.toFixed(2)}</td>
                          <td className="p-2 text-right font-semibold">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold">${reciboSeleccionado.subtotal.toFixed(2)}</span>
                  </div>
                  {reciboSeleccionado.descuento > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-${reciboSeleccionado.descuento.toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-bold text-blue-600">
                    <span>TOTAL:</span>
                    <span>${reciboSeleccionado.total.toFixed(2)} {reciboSeleccionado.tipoMoneda}</span>
                  </div>
                </div>
              </div>

              {/* Notas adicionales */}
              {reciboSeleccionado.notas && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Notas:</h4>
                  <p className="text-gray-700 text-xs">{reciboSeleccionado.notas}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Gracias por su confianza - JH Control
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Sistema de Gestión Empresarial
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JHHistorial;
