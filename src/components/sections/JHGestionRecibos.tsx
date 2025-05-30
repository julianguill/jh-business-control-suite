
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Share2, 
  FileText, 
  Download,
  Calendar,
  User,
  DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

const JHGestionRecibos = () => {
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [filtro, setFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [isCrearOpen, setIsCrearOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [isCompartirOpen, setIsCompartirOpen] = useState(false);
  const [reciboEditando, setReciboEditando] = useState<Recibo | null>(null);
  const [reciboCompartir, setReciboCompartir] = useState<Recibo | null>(null);
  const [telefono, setTelefono] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [nuevoRecibo, setNuevoRecibo] = useState({
    cliente: {
      nombre: '',
      contacto: '',
      direccion: ''
    },
    monto: '',
    tipoMoneda: 'USD',
    metodoPago: 'efectivo'
  });

  useEffect(() => {
    const recibosGuardados = JSON.parse(localStorage.getItem('jhRecibos') || '[]');
    setRecibos(recibosGuardados);
  }, []);

  const guardarRecibos = (nuevosRecibos: Recibo[]) => {
    localStorage.setItem('jhRecibos', JSON.stringify(nuevosRecibos));
    setRecibos(nuevosRecibos);
  };

  const generarNumeroPedido = () => {
    const prefix = 'JH';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const crearRecibo = () => {
    if (!nuevoRecibo.cliente.nombre || !nuevoRecibo.cliente.contacto || !nuevoRecibo.monto) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const recibo: Recibo = {
      id: Date.now().toString(),
      numeroPedido: generarNumeroPedido(),
      fechaEmision: new Date().toLocaleDateString(),
      cliente: nuevoRecibo.cliente,
      monto: nuevoRecibo.monto,
      tipoMoneda: nuevoRecibo.tipoMoneda,
      metodoPago: nuevoRecibo.metodoPago,
      estado: 'pendiente'
    };

    const nuevosRecibos = [...recibos, recibo];
    guardarRecibos(nuevosRecibos);
    
    toast({
      title: "Recibo creado",
      description: `Recibo N° ${recibo.numeroPedido} ha sido generado`,
    });

    setNuevoRecibo({
      cliente: { nombre: '', contacto: '', direccion: '' },
      monto: '',
      tipoMoneda: 'USD',
      metodoPago: 'efectivo'
    });
    setIsCrearOpen(false);
  };

  const editarRecibo = () => {
    if (!reciboEditando) return;

    const recibosActualizados = recibos.map(r => 
      r.id === reciboEditando.id ? reciboEditando : r
    );
    guardarRecibos(recibosActualizados);
    
    toast({
      title: "Recibo actualizado",
      description: "Los cambios han sido guardados",
    });

    setIsEditarOpen(false);
    setReciboEditando(null);
  };

  const eliminarRecibo = (id: string) => {
    const recibosActualizados = recibos.filter(r => r.id !== id);
    guardarRecibos(recibosActualizados);
    
    toast({
      title: "Recibo eliminado",
      description: "El recibo ha sido eliminado del sistema",
    });
  };

  const generarImagenRecibo = (recibo: Recibo): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve('');

      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      // Configurar canvas
      canvas.width = 400;
      canvas.height = 600;

      // Fondo
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(0, 0, canvas.width, 80);

      // Título
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('RECIBO DE PAGO', canvas.width / 2, 35);

      ctx.font = '14px Arial';
      ctx.fillText('JH Control System', canvas.width / 2, 60);

      // Contenido
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      ctx.font = '16px Arial';

      let y = 120;
      const lineHeight = 25;

      // Información del recibo
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Información del Recibo', 20, y);
      y += lineHeight + 10;

      ctx.font = '14px Arial';
      ctx.fillText(`N° Pedido: ${recibo.numeroPedido}`, 20, y);
      y += lineHeight;

      ctx.fillText(`Fecha: ${recibo.fechaEmision}`, 20, y);
      y += lineHeight;

      ctx.fillText(`Monto: ${recibo.monto} ${recibo.tipoMoneda}`, 20, y);
      y += lineHeight;

      ctx.fillText(`Método de Pago: ${recibo.metodoPago}`, 20, y);
      y += lineHeight + 20;

      // Información del cliente
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Datos del Cliente', 20, y);
      y += lineHeight + 10;

      ctx.font = '14px Arial';
      ctx.fillText(`Cliente: ${recibo.cliente.nombre}`, 20, y);
      y += lineHeight;

      ctx.fillText(`Contacto: ${recibo.cliente.contacto}`, 20, y);
      y += lineHeight;

      if (recibo.cliente.direccion) {
        ctx.fillText(`Dirección: ${recibo.cliente.direccion}`, 20, y);
        y += lineHeight;
      }

      y += 30;

      // Estado
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = recibo.estado === 'pagado' ? '#16a34a' : 
                      recibo.estado === 'cancelado' ? '#dc2626' : '#ea580c';
      ctx.textAlign = 'center';
      ctx.fillText(`Estado: ${recibo.estado.toUpperCase()}`, canvas.width / 2, y);

      // Footer
      y = canvas.height - 40;
      ctx.fillStyle = '#666666';
      ctx.font = '12px Arial';
      ctx.fillText('Gracias por su preferencia', canvas.width / 2, y);

      // Convertir a blob y luego a URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          resolve('');
        }
      }, 'image/png');
    });
  };

  const compartirPorWhatsApp = async () => {
    if (!telefono || !reciboCompartir) {
      toast({
        title: "Error",
        description: "Seleccione un recibo y proporcione un número de teléfono",
        variant: "destructive",
      });
      return;
    }

    try {
      const imagenUrl = await generarImagenRecibo(reciboCompartir);
      
      if (imagenUrl) {
        // Crear enlace para descargar la imagen
        const link = document.createElement('a');
        link.href = imagenUrl;
        link.download = `recibo_${reciboCompartir.numeroPedido}.png`;
        link.click();
        
        // Mensaje para WhatsApp
        const mensaje = `Hola! Te envio el recibo de pago:\n\n` +
                       `N° Pedido: ${reciboCompartir.numeroPedido}\n` +
                       `Cliente: ${reciboCompartir.cliente.nombre}\n` +
                       `Monto: ${reciboCompartir.monto} ${reciboCompartir.tipoMoneda}\n` +
                       `Fecha: ${reciboCompartir.fechaEmision}\n\n` +
                       `La imagen del recibo se ha descargado automáticamente.`;

        const urlWhatsApp = `https://wa.me/${telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
        
        toast({
          title: "Recibo compartido",
          description: "Se ha descargado la imagen y abierto WhatsApp",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar la imagen del recibo",
        variant: "destructive",
      });
    }

    setIsCompartirOpen(false);
    setTelefono('');
    setReciboCompartir(null);
  };

  const recibosFiltrados = recibos.filter(recibo => {
    const coincideTexto = recibo.numeroPedido.toLowerCase().includes(filtro.toLowerCase()) ||
                         recibo.cliente.nombre.toLowerCase().includes(filtro.toLowerCase());
    
    const coincideEstado = filtroEstado === 'todos' || recibo.estado === filtroEstado;
    
    return coincideTexto && coincideEstado;
  });

  const totalRecibos = recibos.length;
  const montoTotal = recibos.reduce((acc, r) => acc + parseFloat(r.monto), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Recibos</h1>
          <p className="text-lg text-gray-600">Crea, edita y gestiona todos los recibos de pago</p>
        </div>
        <Dialog open={isCrearOpen} onOpenChange={setIsCrearOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Recibo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Recibo</DialogTitle>
              <DialogDescription>
                Complete la información para generar un nuevo recibo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Cliente *</Label>
                  <Input
                    id="nombre"
                    value={nuevoRecibo.cliente.nombre}
                    onChange={(e) => setNuevoRecibo({
                      ...nuevoRecibo,
                      cliente: { ...nuevoRecibo.cliente, nombre: e.target.value }
                    })}
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contacto">Contacto *</Label>
                  <Input
                    id="contacto"
                    value={nuevoRecibo.cliente.contacto}
                    onChange={(e) => setNuevoRecibo({
                      ...nuevoRecibo,
                      cliente: { ...nuevoRecibo.cliente, contacto: e.target.value }
                    })}
                    placeholder="Email o teléfono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={nuevoRecibo.cliente.direccion}
                  onChange={(e) => setNuevoRecibo({
                    ...nuevoRecibo,
                    cliente: { ...nuevoRecibo.cliente, direccion: e.target.value }
                  })}
                  placeholder="Dirección completa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto *</Label>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    value={nuevoRecibo.monto}
                    onChange={(e) => setNuevoRecibo({ ...nuevoRecibo, monto: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoMoneda">Tipo de Moneda *</Label>
                  <Input
                    id="tipoMoneda"
                    value={nuevoRecibo.tipoMoneda}
                    onChange={(e) => setNuevoRecibo({ ...nuevoRecibo, tipoMoneda: e.target.value.toUpperCase() })}
                    placeholder="USD, EUR, BS"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metodoPago">Método de Pago</Label>
                <Select 
                  value={nuevoRecibo.metodoPago} 
                  onValueChange={(value) => setNuevoRecibo({ ...nuevoRecibo, metodoPago: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCrearOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={crearRecibo}
                >
                  Crear Recibo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Recibos</CardTitle>
            <FileText className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalRecibos}</div>
            <p className="text-xs text-gray-500">recibos generados</p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${montoTotal.toFixed(2)}</div>
            <p className="text-xs text-gray-500">valor total facturado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
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
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="pagado">Pagados</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de recibos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Recibos ({recibosFiltrados.length})</CardTitle>
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
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{recibo.cliente.nombre}</div>
                        <div className="text-xs text-gray-500">{recibo.cliente.contacto}</div>
                      </div>
                    </td>
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
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReciboCompartir(recibo);
                            setIsCompartirOpen(true);
                          }}
                          className="w-8 h-8 p-0 text-green-600 hover:text-green-700"
                          title="Compartir por WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReciboEditando(recibo);
                            setIsEditarOpen(true);
                          }}
                          className="w-8 h-8 p-0 text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarRecibo(recibo.id)}
                          className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recibosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron recibos que coincidan con los filtros
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para compartir por WhatsApp */}
      <Dialog open={isCompartirOpen} onOpenChange={setIsCompartirOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartir Recibo por WhatsApp</DialogTitle>
            <DialogDescription>
              Se generará una imagen del recibo y se enviará por WhatsApp
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Número de Teléfono</Label>
              <Input
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+58 412 123 4567"
              />
            </div>
            {reciboCompartir && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Recibo seleccionado:</h4>
                <p className="text-sm text-gray-600">
                  N° {reciboCompartir.numeroPedido} - {reciboCompartir.cliente.nombre} - {reciboCompartir.monto} {reciboCompartir.tipoMoneda}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsCompartirOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={compartirPorWhatsApp}
              >
                Enviar por WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar recibo */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Recibo</DialogTitle>
            <DialogDescription>
              Modifique la información del recibo
            </DialogDescription>
          </DialogHeader>
          {reciboEditando && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre del Cliente</Label>
                  <Input
                    id="edit-nombre"
                    value={reciboEditando.cliente.nombre}
                    onChange={(e) => setReciboEditando({
                      ...reciboEditando,
                      cliente: { ...reciboEditando.cliente, nombre: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contacto">Contacto</Label>
                  <Input
                    id="edit-contacto"
                    value={reciboEditando.cliente.contacto}
                    onChange={(e) => setReciboEditando({
                      ...reciboEditando,
                      cliente: { ...reciboEditando.cliente, contacto: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-direccion">Dirección</Label>
                <Input
                  id="edit-direccion"
                  value={reciboEditando.cliente.direccion}
                  onChange={(e) => setReciboEditando({
                    ...reciboEditando,
                    cliente: { ...reciboEditando.cliente, direccion: e.target.value }
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-monto">Monto</Label>
                  <Input
                    id="edit-monto"
                    type="number"
                    step="0.01"
                    value={reciboEditando.monto}
                    onChange={(e) => setReciboEditando({ ...reciboEditando, monto: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tipoMoneda">Tipo de Moneda</Label>
                  <Input
                    id="edit-tipoMoneda"
                    value={reciboEditando.tipoMoneda}
                    onChange={(e) => setReciboEditando({ ...reciboEditando, tipoMoneda: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-metodoPago">Método de Pago</Label>
                  <Select 
                    value={reciboEditando.metodoPago} 
                    onValueChange={(value) => setReciboEditando({ ...reciboEditando, metodoPago: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-estado">Estado</Label>
                  <Select 
                    value={reciboEditando.estado} 
                    onValueChange={(value) => setReciboEditando({ ...reciboEditando, estado: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditarOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={editarRecibo}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JHGestionRecibos;
