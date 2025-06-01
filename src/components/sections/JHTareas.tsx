import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Check, 
  Share2, 
  DollarSign,
  Calendar,
  User
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Tarea {
  id: string;
  nombre: string;
  cliente: string;
  fechaCreacion: string;
  monto: string;
  tipoMoneda: 'USD' | 'BS';
  completada: boolean;
  descripcion?: string;
}

const JHTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtroTareas, setFiltroTareas] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [isCrearOpen, setIsCrearOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [isCompartirOpen, setIsCompartirOpen] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [telefono, setTelefono] = useState('');
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState<string[]>([]);
  const [tasaCambio, setTasaCambio] = useState<{tasa: string, moneda: string} | null>(null);

  const [nuevaTarea, setNuevaTarea] = useState({
    nombre: '',
    cliente: '',
    monto: '',
    tipoMoneda: 'USD' as 'USD' | 'BS',
    descripcion: ''
  });

  useEffect(() => {
    const tareasGuardadas = JSON.parse(localStorage.getItem('jhTareas') || '[]');
    setTareas(tareasGuardadas);
    
    const tasa = localStorage.getItem('tasaCambio');
    if (tasa) {
      setTasaCambio(JSON.parse(tasa));
    }
  }, []);

  const guardarTareas = (nuevasTareas: Tarea[]) => {
    localStorage.setItem('jhTareas', JSON.stringify(nuevasTareas));
    setTareas(nuevasTareas);
  };

  const convertirMoneda = (monto: string, monedaOrigen: 'USD' | 'BS', monedaDestino: 'USD' | 'BS') => {
    if (!tasaCambio || monedaOrigen === monedaDestino) return parseFloat(monto) || 0;
    
    const valor = parseFloat(monto) || 0;
    const tasa = parseFloat(tasaCambio.tasa);
    
    if (monedaOrigen === 'USD' && monedaDestino === 'BS') {
      return valor * tasa;
    } else if (monedaOrigen === 'BS' && monedaDestino === 'USD') {
      return valor / tasa;
    }
    
    return valor;
  };

  const crearTarea = () => {
    if (!nuevaTarea.nombre || !nuevaTarea.cliente) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios (nombre y cliente)",
        variant: "destructive",
      });
      return;
    }

    const tarea: Tarea = {
      id: Date.now().toString(),
      nombre: nuevaTarea.nombre,
      cliente: nuevaTarea.cliente,
      fechaCreacion: new Date().toLocaleDateString('es-ES'),
      monto: nuevaTarea.monto || '0',
      tipoMoneda: nuevaTarea.tipoMoneda,
      completada: false,
      descripcion: nuevaTarea.descripcion
    };

    const nuevasTareas = [...tareas, tarea];
    guardarTareas(nuevasTareas);
    
    toast({
      title: "Tarea creada",
      description: `La tarea "${tarea.nombre}" ha sido creada exitosamente`,
    });

    setNuevaTarea({ nombre: '', cliente: '', monto: '', tipoMoneda: 'USD', descripcion: '' });
    setIsCrearOpen(false);
  };

  const editarTarea = () => {
    if (!tareaEditando) return;

    const tareasActualizadas = tareas.map(t => 
      t.id === tareaEditando.id ? tareaEditando : t
    );
    guardarTareas(tareasActualizadas);
    
    toast({
      title: "Tarea actualizada",
      description: "Los cambios han sido guardados",
    });

    setIsEditarOpen(false);
    setTareaEditando(null);
  };

  const eliminarTarea = (id: string) => {
    const tareasActualizadas = tareas.filter(t => t.id !== id);
    guardarTareas(tareasActualizadas);
    
    toast({
      title: "Tarea eliminada",
      description: "La tarea ha sido eliminada del sistema",
    });
  };

  const completarTarea = (id: string) => {
    const tareasActualizadas = tareas.map(t => 
      t.id === id ? { ...t, completada: !t.completada } : t
    );
    guardarTareas(tareasActualizadas);
    
    const tarea = tareas.find(t => t.id === id);
    toast({
      title: tarea?.completada ? "Tarea marcada como pendiente" : "Tarea completada",
      description: `La tarea "${tarea?.nombre}" ha sido actualizada`,
    });
  };

  const compartirPorWhatsApp = () => {
    if (!telefono || tareasSeleccionadas.length === 0) {
      toast({
        title: "Error",
        description: "Seleccione tareas y proporcione un número de teléfono",
        variant: "destructive",
      });
      return;
    }

    const tareasParaCompartir = tareas.filter(t => tareasSeleccionadas.includes(t.id));
    let mensaje = `Hola! Te envio el resumen de tareas:\n\n`;
    
    tareasParaCompartir.forEach((tarea, index) => {
      mensaje += `${index + 1}. ${tarea.nombre}\n`;
      mensaje += `   Cliente: ${tarea.cliente}\n`;
      mensaje += `   Monto: ${tarea.monto} ${tarea.tipoMoneda}\n`;
      mensaje += `   Estado: ${tarea.completada ? 'Completada' : 'Pendiente'}\n\n`;
    });

    const urlWhatsApp = `https://wa.me/${telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
    
    toast({
      title: "Compartiendo por WhatsApp",
      description: "Se abrirá WhatsApp con el mensaje preparado",
    });

    setIsCompartirOpen(false);
    setTelefono('');
    setTareasSeleccionadas([]);
  };

  const tareasFiltradas = tareas.filter(tarea => {
    const coincideTexto = tarea.nombre.toLowerCase().includes(filtroTareas.toLowerCase()) ||
                         tarea.cliente.toLowerCase().includes(filtroTareas.toLowerCase());
    
    const coincideEstado = filtroEstado === 'todas' ||
                          (filtroEstado === 'pendientes' && !tarea.completada) ||
                          (filtroEstado === 'completadas' && tarea.completada);
    
    return coincideTexto && coincideEstado;
  });

  const tareasPendientes = tareas.filter(t => !t.completada);
  const montoTotalPendienteUSD = tareasPendientes.reduce((acc, t) => {
    return acc + convertirMoneda(t.monto, t.tipoMoneda, 'USD');
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Tareas</h1>
          <p className="text-lg text-gray-600">Administra y organiza todas las tareas del negocio</p>
        </div>
        <Dialog open={isCrearOpen} onOpenChange={setIsCrearOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Tarea</DialogTitle>
              <DialogDescription>
                Complete la información para crear una nueva tarea
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Tarea *</Label>
                <Input
                  id="nombre"
                  value={nuevaTarea.nombre}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, nombre: e.target.value})}
                  placeholder="Ej: Desarrollo de sitio web"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  value={nuevaTarea.cliente}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, cliente: e.target.value})}
                  placeholder="Nombre del cliente"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto (opcional)</Label>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    value={nuevaTarea.monto}
                    onChange={(e) => setNuevaTarea({...nuevaTarea, monto: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoMoneda">Moneda</Label>
                  <Select value={nuevaTarea.tipoMoneda} onValueChange={(value: 'USD' | 'BS') => setNuevaTarea({...nuevaTarea, tipoMoneda: value})}>
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
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={nuevaTarea.descripcion}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, descripcion: e.target.value})}
                  placeholder="Descripción detallada de la tarea"
                />
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
                  onClick={crearTarea}
                >
                  Crear Tarea
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
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <Calendar className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{tareasPendientes.length}</div>
            <p className="text-xs text-gray-500">tareas por completar</p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total Pendiente</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${montoTotalPendienteUSD.toFixed(2)}</div>
            <p className="text-xs text-gray-500">total por cobrar</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar tareas o clientes..."
                  value={filtroTareas}
                  onChange={(e) => setFiltroTareas(e.target.value)}
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
                <SelectItem value="todas">Todas las tareas</SelectItem>
                <SelectItem value="pendientes">Pendientes</SelectItem>
                <SelectItem value="completadas">Completadas</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isCompartirOpen} onOpenChange={setIsCompartirOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Compartir Tareas por WhatsApp</DialogTitle>
                  <DialogDescription>
                    Seleccione las tareas y proporcione un número de teléfono
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
                  <div className="space-y-2">
                    <Label>Seleccionar Tareas</Label>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {tareas.map((tarea) => (
                        <div key={tarea.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={tarea.id}
                            checked={tareasSeleccionadas.includes(tarea.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTareasSeleccionadas([...tareasSeleccionadas, tarea.id]);
                              } else {
                                setTareasSeleccionadas(tareasSeleccionadas.filter(id => id !== tarea.id));
                              }
                            }}
                            className="rounded"
                          />
                          <label htmlFor={tarea.id} className="text-sm">
                            {tarea.nombre} - {tarea.cliente}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Tabla de tareas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tareas ({tareasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Tarea</th>
                  <th className="text-left p-2">Cliente</th>
                  <th className="text-left p-2">Fecha Creación</th>
                  <th className="text-left p-2">Monto USD</th>
                  <th className="text-left p-2">Monto {tasaCambio?.moneda || 'BS'}</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareasFiltradas.map((tarea, index) => (
                  <tr 
                    key={tarea.id} 
                    className="border-b hover:bg-gray-50 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => completarTarea(tarea.id)}
                        className={`w-8 h-8 p-0 ${
                          tarea.completada 
                            ? 'text-green-600 hover:text-green-700' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className={`font-medium ${tarea.completada ? 'line-through text-gray-500' : ''}`}>
                          {tarea.nombre}
                        </div>
                        {tarea.descripcion && (
                          <div className="text-xs text-gray-500">{tarea.descripcion}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{tarea.cliente}</span>
                      </div>
                    </td>
                    <td className="p-2 text-sm text-gray-600">{tarea.fechaCreacion}</td>
                    <td className="p-2">
                      <Badge variant={tarea.completada ? "secondary" : "default"}>
                        ${convertirMoneda(tarea.monto, tarea.tipoMoneda, 'USD').toFixed(2)}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">
                        {tasaCambio?.moneda || 'BS'} {convertirMoneda(tarea.monto, tarea.tipoMoneda, 'BS').toFixed(2)}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTareaEditando(tarea);
                            setIsEditarOpen(true);
                          }}
                          className="w-8 h-8 p-0 text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarTarea(tarea.id)}
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
            {tareasFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron tareas que coincidan con los filtros
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para editar tarea */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
            <DialogDescription>
              Modifique la información de la tarea
            </DialogDescription>
          </DialogHeader>
          {tareaEditando && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre de la Tarea</Label>
                <Input
                  id="edit-nombre"
                  value={tareaEditando.nombre}
                  onChange={(e) => setTareaEditando({...tareaEditando, nombre: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cliente">Cliente</Label>
                <Input
                  id="edit-cliente"
                  value={tareaEditando.cliente}
                  onChange={(e) => setTareaEditando({...tareaEditando, cliente: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-monto">Monto</Label>
                  <Input
                    id="edit-monto"
                    type="number"
                    step="0.01"
                    value={tareaEditando.monto}
                    onChange={(e) => setTareaEditando({...tareaEditando, monto: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tipoMoneda">Moneda</Label>
                  <Select value={tareaEditando.tipoMoneda} onValueChange={(value: 'USD' | 'BS') => setTareaEditando({...tareaEditando, tipoMoneda: value})}>
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
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  value={tareaEditando.descripcion || ''}
                  onChange={(e) => setTareaEditando({...tareaEditando, descripcion: e.target.value})}
                />
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
                  onClick={editarTarea}
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

export default JHTareas;
