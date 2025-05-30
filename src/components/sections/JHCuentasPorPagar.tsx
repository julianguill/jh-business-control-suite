
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, CreditCard, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CuentaPorPagar {
  id: string;
  proveedor: string;
  concepto: string;
  monto: string;
  fechaVencimiento: string;
  estado: 'pendiente' | 'pagado' | 'vencido';
  descripcion?: string;
}

const JHCuentasPorPagar = () => {
  const [cuentas, setCuentas] = useState<CuentaPorPagar[]>([]);
  const [filtro, setFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [isCrearOpen, setIsCrearOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [cuentaEditando, setCuentaEditando] = useState<CuentaPorPagar | null>(null);

  const [nuevaCuenta, setNuevaCuenta] = useState({
    proveedor: '',
    concepto: '',
    monto: '',
    fechaVencimiento: '',
    descripcion: ''
  });

  useEffect(() => {
    const cuentasGuardadas = JSON.parse(localStorage.getItem('jhCuentasPorPagar') || '[]');
    setCuentas(cuentasGuardadas);
  }, []);

  const guardarCuentas = (nuevasCuentas: CuentaPorPagar[]) => {
    localStorage.setItem('jhCuentasPorPagar', JSON.stringify(nuevasCuentas));
    setCuentas(nuevasCuentas);
  };

  const determinarEstado = (fechaVencimiento: string): 'pendiente' | 'vencido' => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    return vencimiento < hoy ? 'vencido' : 'pendiente';
  };

  const crearCuenta = () => {
    if (!nuevaCuenta.proveedor || !nuevaCuenta.concepto || !nuevaCuenta.monto || !nuevaCuenta.fechaVencimiento) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const cuenta: CuentaPorPagar = {
      id: Date.now().toString(),
      proveedor: nuevaCuenta.proveedor,
      concepto: nuevaCuenta.concepto,
      monto: nuevaCuenta.monto,
      fechaVencimiento: nuevaCuenta.fechaVencimiento,
      estado: determinarEstado(nuevaCuenta.fechaVencimiento),
      descripcion: nuevaCuenta.descripcion
    };

    const nuevasCuentas = [...cuentas, cuenta];
    guardarCuentas(nuevasCuentas);
    
    toast({
      title: "Cuenta creada",
      description: `La cuenta por pagar ha sido registrada`,
    });

    setNuevaCuenta({ proveedor: '', concepto: '', monto: '', fechaVencimiento: '', descripcion: '' });
    setIsCrearOpen(false);
  };

  const editarCuenta = () => {
    if (!cuentaEditando) return;

    const cuentasActualizadas = cuentas.map(c => 
      c.id === cuentaEditando.id ? cuentaEditando : c
    );
    guardarCuentas(cuentasActualizadas);
    
    toast({
      title: "Cuenta actualizada",
      description: "Los cambios han sido guardados",
    });

    setIsEditarOpen(false);
    setCuentaEditando(null);
  };

  const eliminarCuenta = (id: string) => {
    const cuentasActualizadas = cuentas.filter(c => c.id !== id);
    guardarCuentas(cuentasActualizadas);
    
    toast({
      title: "Cuenta eliminada",
      description: "La cuenta por pagar ha sido eliminada",
    });
  };

  const marcarComoPagado = (id: string) => {
    const cuentasActualizadas = cuentas.map(c => 
      c.id === id ? { ...c, estado: 'pagado' as const } : c
    );
    guardarCuentas(cuentasActualizadas);
    
    toast({
      title: "Cuenta pagada",
      description: "La cuenta ha sido marcada como pagada",
    });
  };

  const cuentasFiltradas = cuentas.filter(cuenta => {
    const coincideTexto = cuenta.proveedor.toLowerCase().includes(filtro.toLowerCase()) ||
                         cuenta.concepto.toLowerCase().includes(filtro.toLowerCase());
    
    const coincideEstado = filtroEstado === 'todas' || cuenta.estado === filtroEstado;
    
    return coincideTexto && coincideEstado;
  });

  const montoTotal = cuentas.filter(c => c.estado !== 'pagado').reduce((acc, c) => acc + parseFloat(c.monto), 0);
  const cuentasVencidas = cuentas.filter(c => c.estado === 'vencido').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cuentas por Pagar</h1>
          <p className="text-lg text-gray-600">Gestiona las obligaciones de pago pendientes</p>
        </div>
        <Dialog open={isCrearOpen} onOpenChange={setIsCrearOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cuenta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Cuenta por Pagar</DialogTitle>
              <DialogDescription>
                Registre una nueva obligación de pago
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor *</Label>
                <Input
                  id="proveedor"
                  value={nuevaCuenta.proveedor}
                  onChange={(e) => setNuevaCuenta({...nuevaCuenta, proveedor: e.target.value})}
                  placeholder="Nombre del proveedor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto *</Label>
                <Input
                  id="concepto"
                  value={nuevaCuenta.concepto}
                  onChange={(e) => setNuevaCuenta({...nuevaCuenta, concepto: e.target.value})}
                  placeholder="Motivo de la cuenta por pagar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monto">Monto *</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  value={nuevaCuenta.monto}
                  onChange={(e) => setNuevaCuenta({...nuevaCuenta, monto: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaVencimiento">Fecha de Vencimiento *</Label>
                <Input
                  id="fechaVencimiento"
                  type="date"
                  value={nuevaCuenta.fechaVencimiento}
                  onChange={(e) => setNuevaCuenta({...nuevaCuenta, fechaVencimiento: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={nuevaCuenta.descripcion}
                  onChange={(e) => setNuevaCuenta({...nuevaCuenta, descripcion: e.target.value})}
                  placeholder="Detalles adicionales"
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
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={crearCuenta}
                >
                  Crear Cuenta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total por Pagar</CardTitle>
            <CreditCard className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${montoTotal.toFixed(2)}</div>
            <p className="text-xs text-gray-500">pendiente de pago</p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuentas Vencidas</CardTitle>
            <Calendar className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{cuentasVencidas}</div>
            <p className="text-xs text-gray-500">requieren pago urgente</p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cuentas</CardTitle>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{cuentas.length}</div>
            <p className="text-xs text-gray-500">registradas en el sistema</p>
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
                  placeholder="Buscar por proveedor o concepto..."
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
                <SelectItem value="todas">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="vencido">Vencidas</SelectItem>
                <SelectItem value="pagado">Pagadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de cuentas */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Cuentas por Pagar ({cuentasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Proveedor</th>
                  <th className="text-left p-2">Concepto</th>
                  <th className="text-left p-2">Monto</th>
                  <th className="text-left p-2">Vencimiento</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuentasFiltradas.map((cuenta, index) => (
                  <tr 
                    key={cuenta.id} 
                    className="border-b hover:bg-gray-50 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-2 font-medium">{cuenta.proveedor}</td>
                    <td className="p-2">
                      <div>
                        <div className="text-sm">{cuenta.concepto}</div>
                        {cuenta.descripcion && (
                          <div className="text-xs text-gray-500">{cuenta.descripcion}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="default" className="bg-red-100 text-red-800">
                        ${cuenta.monto}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">{cuenta.fechaVencimiento}</td>
                    <td className="p-2">
                      <Badge 
                        variant={
                          cuenta.estado === 'pagado' ? 'secondary' : 
                          cuenta.estado === 'vencido' ? 'destructive' : 'default'
                        }
                      >
                        {cuenta.estado === 'pagado' ? 'Pagado' : 
                         cuenta.estado === 'vencido' ? 'Vencido' : 'Pendiente'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        {cuenta.estado !== 'pagado' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => marcarComoPagado(cuenta.id)}
                            className="w-8 h-8 p-0 text-green-600 hover:text-green-700"
                            title="Marcar como pagado"
                          >
                            <CreditCard className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCuentaEditando(cuenta);
                            setIsEditarOpen(true);
                          }}
                          className="w-8 h-8 p-0 text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarCuenta(cuenta.id)}
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
            {cuentasFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron cuentas que coincidan con los filtros
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para editar cuenta */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cuenta por Pagar</DialogTitle>
            <DialogDescription>
              Modifique la información de la cuenta
            </DialogDescription>
          </DialogHeader>
          {cuentaEditando && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-proveedor">Proveedor</Label>
                <Input
                  id="edit-proveedor"
                  value={cuentaEditando.proveedor}
                  onChange={(e) => setCuentaEditando({...cuentaEditando, proveedor: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-concepto">Concepto</Label>
                <Input
                  id="edit-concepto"
                  value={cuentaEditando.concepto}
                  onChange={(e) => setCuentaEditando({...cuentaEditando, concepto: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-monto">Monto</Label>
                <Input
                  id="edit-monto"
                  type="number"
                  step="0.01"
                  value={cuentaEditando.monto}
                  onChange={(e) => setCuentaEditando({...cuentaEditando, monto: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fechaVencimiento">Fecha de Vencimiento</Label>
                <Input
                  id="edit-fechaVencimiento"
                  type="date"
                  value={cuentaEditando.fechaVencimiento}
                  onChange={(e) => setCuentaEditando({...cuentaEditando, fechaVencimiento: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Select 
                  value={cuentaEditando.estado} 
                  onValueChange={(value) => setCuentaEditando({...cuentaEditando, estado: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                    <SelectItem value="pagado">Pagado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  value={cuentaEditando.descripcion || ''}
                  onChange={(e) => setCuentaEditando({...cuentaEditando, descripcion: e.target.value})}
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
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={editarCuenta}
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

export default JHCuentasPorPagar;
