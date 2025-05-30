
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
  moneda: 'USD' | 'BS';
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
  const [tasaCambio, setTasaCambio] = useState<{tasa: string, moneda: string} | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [nuevoRecibo, setNuevoRecibo] = useState({
    cliente: {
      nombre: '',
      contacto: '',
      direccion: ''
    },
    monto: '',
    moneda: 'USD' as 'USD' | 'BS',
    metodoPago: 'efectivo'
  });

  useEffect(() => {
    const recibosGuardados = JSON.parse(localStorage.getItem('jhRecibos') || '[]');
    setRecibos(recibosGuardados);
    
    const tasa = localStorage.getItem('tasaCambio');
    if (tasa) {
      setTasaCambio(JSON.parse(tasa));
    }
  }, []);

  const guardarRecibos = (nuevosRecibos: Recibo[]) => {
    localStorage.setItem('jhRecibos', JSON.stringify(nuevosRecibos));
    setRecibos(nuevosRecibos);
  };

  const convertirMoneda = (monto: string, monedaOrigen: 'USD' | 'BS', monedaDestino: 'USD' | 'BS') => {
    if (!tasaCambio || monedaOrigen === monedaDestino) return parseFloat(monto);
    
    const valor = parseFloat(monto);
    const tasa = parseFloat(tasaCambio.tasa);
    
    if (monedaOrigen === 'USD' && monedaDestino === 'BS') {
      return valor * tasa;
    } else if (monedaOrigen === 'BS' && monedaDestino === 'USD') {
      return valor / tasa;
    }
    
    return valor;
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
      moneda: nuevoRecibo.moneda,
      metodoPago: nuevoRecibo.metodoPago,
      estado: 'pendiente'
    };

    const nuevosRecibos = [...recibos, recibo];
    guardarRecibos(nuevosRecibos);
    
    toast({
      title: "Recibo creado exitosamente",
      description: `Recibo N° ${recibo.numeroPedido} ha sido generado`,
    });

    setNuevoRecibo({
      cliente: { nombre: '', contacto: '', direccion: '' },
      monto: '',
      moneda: 'USD',
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

      // Configurar canvas con dimensiones similares al recibo de referencia
      canvas.width = 400;
      canvas.height = 700;

      // Fondo blanco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header con círculo verde de check
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 60, 25, 0, 2 * Math.PI);
      ctx.fill();

      // Check mark
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 8, 60);
      ctx.lineTo(canvas.width / 2 - 2, 66);
      ctx.lineTo(canvas.width / 2 + 8, 54);
      ctx.stroke();

      // Título principal
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡Gracias por tu compra!', canvas.width / 2, 120);

      ctx.font = '16px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Tu pedido ha sido procesado correctamente.', canvas.width / 2, 145);

      // Sección de resumen del pedido
      let y = 190;
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('📋 Resumen del Pedido', 30, y);

      y += 40;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#4b5563';

      // Número de pedido
      ctx.fillText('Número de Pedido:', 30, y);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(recibo.numeroPedido, 300, y);

      y += 25;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('Fecha:', 30, y);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(recibo.fechaEmision, 300, y);

      y += 25;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('Estado:', 30, y);
      ctx.fillStyle = recibo.estado === 'pagado' ? '#10b981' : 
                      recibo.estado === 'cancelado' ? '#ef4444' : '#f59e0b';
      ctx.font = 'bold 14px Arial';
      
      // Badge para el estado
      const estadoTexto = recibo.estado === 'pagado' ? 'Pagado' :
                         recibo.estado === 'cancelado' ? 'Cancelado' : 'En proceso';
      
      ctx.fillStyle = recibo.estado === 'pagado' ? '#dcfce7' :
                      recibo.estado === 'cancelado' ? '#fee2e2' : '#fef3c7';
      ctx.fillRect(280, y - 15, 90, 20);
      
      ctx.fillStyle = recibo.estado === 'pagado' ? '#166534' :
                      recibo.estado === 'cancelado' ? '#991b1b' : '#92400e';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(estadoTexto, 325, y - 2);

      y += 35;
      ctx.textAlign = 'left';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('Total:', 30, y);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      
      // Mostrar monto en ambas monedas
      const montoUSD = convertirMoneda(recibo.monto, recibo.moneda, 'USD');
      const montoBS = convertirMoneda(recibo.monto, recibo.moneda, 'BS');
      
      if (recibo.moneda === 'USD') {
        ctx.fillText(`$/ ${parseFloat(recibo.monto).toFixed(2)}`, 260, y);
        if (tasaCambio) {
          ctx.font = '12px Arial';
          ctx.fillStyle = '#6b7280';
          ctx.fillText(`(${tasaCambio.moneda} ${montoBS.toFixed(2)})`, 260, y + 18);
        }
      } else {
        ctx.fillText(`${tasaCambio?.moneda || 'BS'} ${parseFloat(recibo.monto).toFixed(2)}`, 240, y);
        ctx.font = '12px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(`($/ ${montoUSD.toFixed(2)})`, 240, y + 18);
      }

      // Datos del cliente
      y += 70;
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('👤 Datos de Envío', 30, y);

      y += 35;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.fillText(recibo.cliente.nombre, 30, y);

      y += 20;
      ctx.fillStyle = '#6b7280';
      ctx.fillText(recibo.cliente.contacto, 30, y);

      if (recibo.cliente.direccion) {
        y += 20;
        ctx.fillText(recibo.cliente.direccion, 30, y);
      }

      // Método de pago
      y += 50;
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('💳 Método de Pago', 30, y);

      y += 35;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#4b5563';
      const metodoPagoTexto = recibo.metodoPago.charAt(0).toUpperCase() + recibo.metodoPago.slice(1);
      ctx.fillText(metodoPagoTexto, 30, y);

      // Footer
      y = canvas.height - 60;
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Te hemos enviado un correo con los detalles de tu compra a', canvas.width / 2, y);
      
      y += 20;
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(recibo.cliente.contacto, canvas.width / 2, y);

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
        
        // Solo mensaje de notificación para WhatsApp
        const mensaje = `Hola! Te envío el recibo de tu compra. Número de pedido: ${reciboCompartir.numeroPedido}`;

        const urlWhatsApp = `https://wa.me/${telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
        
        toast({
          title: "Recibo compartido exitosamente",
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
  const montoTotalUSD = recibos.reduce((acc, r) => acc + convertirMoneda(r.monto, r.moneda, 'USD'), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">Gestión de Recibos</h1>
          <p className="text-lg text-gray-600">Crea, edita y gestiona todos los recibos de pago con conversión automática</p>
        </div>
        <Dialog open={isCrearOpen} onOpenChange={setIsCrearOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg">
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
                  <Label htmlFor="moneda">Moneda *</Label>
                  <Select value={nuevoRecibo.moneda} onValueChange={(value: 'USD' | 'BS') => setNuevoRecibo({ ...nuevoRecibo, moneda: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD (Dólares)</SelectItem>
                      <SelectItem value="BS">{tasaCambio?.moneda || 'BS'} (Moneda Local)</SelectItem>
                    </SelectContent>
                  </Select>
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
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                  onClick={crearRecibo}
                >
                  Crear Recibo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tarjetas de resumen mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200/30 rounded-bl-3xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">Total de Recibos</CardTitle>
            <FileText className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-800">{totalRecibos}</div>
            <p className="text-xs text-emerald-600 mt-1">recibos generados</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-bl-3xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Monto Total</CardTitle>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">${montoTotalUSD.toFixed(2)}</div>
            <p className="text-xs text-blue-600 mt-1">valor total facturado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros mejorados */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por número de pedido o cliente..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
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

      {/* Tabla mejorada */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
          <CardTitle className="text-xl">Lista de Recibos ({recibosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-700">N° Pedido</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Cliente</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Fecha</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Monto USD</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Monto {tasaCambio?.moneda || 'BS'}</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recibosFiltrados.map((recibo, index) => (
                  <tr 
                    key={recibo.id} 
                    className="border-b hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4 font-medium">{recibo.numeroPedido}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{recibo.cliente.nombre}</div>
                        <div className="text-xs text-gray-500">{recibo.cliente.contacto}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{recibo.fechaEmision}</td>
                    <td className="p-4">
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                        ${convertirMoneda(recibo.monto, recibo.moneda, 'USD').toFixed(2)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        {tasaCambio?.moneda || 'BS'} {convertirMoneda(recibo.monto, recibo.moneda, 'BS').toFixed(2)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={
                          recibo.estado === 'pagado' ? 'secondary' : 
                          recibo.estado === 'cancelado' ? 'destructive' : 'default'
                        }
                        className={
                          recibo.estado === 'pagado' ? 'bg-green-100 text-green-800' :
                          recibo.estado === 'cancelado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {recibo.estado === 'pagado' ? 'Pagado' : 
                         recibo.estado === 'cancelado' ? 'Cancelado' : 'Pendiente'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReciboCompartir(recibo);
                            setIsCompartirOpen(true);
                          }}
                          className="w-8 h-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
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
                          className="w-8 h-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarRecibo(recibo.id)}
                          className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No se encontraron recibos que coincidan con los filtros</p>
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
              Se generará una imagen del recibo como la que mostraste y se enviará por WhatsApp
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
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg border border-emerald-200">
                <h4 className="font-medium mb-2">Recibo seleccionado:</h4>
                <p className="text-sm text-gray-600">
                  N° {reciboCompartir.numeroPedido} - {reciboCompartir.cliente.nombre} - {reciboCompartir.monto} {reciboCompartir.moneda}
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
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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
                  <Label htmlFor="edit-moneda">Moneda</Label>
                  <Select value={reciboEditando.moneda} onValueChange={(value: 'USD' | 'BS') => setReciboEditando({ ...reciboEditando, moneda: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD (Dólares)</SelectItem>
                      <SelectItem value="BS">{tasaCambio?.moneda || 'BS'} (Moneda Local)</SelectItem>
                    </SelectContent>
                  </Select>
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
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
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
