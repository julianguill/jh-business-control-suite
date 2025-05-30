import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, DollarSign, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CuentaPorCobrar {
  id: string;
  cliente: string;
  concepto: string;
  monto: string;
  moneda: 'USD' | 'BS';
  fechaCreacion: string;
  fechaVencimiento: string;
  estado: 'pendiente' | 'pagado' | 'vencido';
  descripcion?: string;
}

const JHCuentasPorCobrar = () => {
  const [cuentas, setCuentas] = useState<CuentaPorCobrar[]>([]);
  const [filtro, setFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [isCrearOpen, setIsCrearOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [cuentaEditando, setCuentaEditando] = useState<CuentaPorCobrar | null>(null);
  const [tasaCambio, setTasaCambio] = useState<{tasa: string, moneda: string} | null>(null);

  const [nuevaCuenta, setNuevaCuenta] = useState({
    cliente: '',
    concepto: '',
    monto: '',
    moneda: 'USD' as 'USD' | 'BS',
    descripcion: ''
  });

  useEffect(() => {
    const cuentasGuardadas = JSON.parse(localStorage.getItem('jhCuentasPorCobrar') || '[]');
    setCuentas(cuentasGuardadas);
    
    const tasa = localStorage.getItem('tasaCambio');
    if (tasa) {
      setTasaCambio(JSON.parse(tasa));
    }
  }, []);

  const guardarCuentas = (nuevasCuentas: CuentaPorCobrar[]) => {
    localStorage.setItem('jhCuentasPorCobrar', JSON.stringify(nuevasCuentas));
    setCuentas(nuevasCuentas);
  };

  const calcularFechaVencimiento = (fechaCreacion: string) => {
    const fecha = new Date(fechaCreacion);
    fecha.setDate(fecha.getDate() + 14);
    return fecha.toISOString().split('T')[0];
  };

  const determinarEstado = (fechaVencimiento: string): 'pendiente' | 'vencido' => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    return vencimiento < hoy ? 'vencido' : 'pendiente';
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

  const crearCuenta = () => {
    if (!nuevaCuenta.cliente || !nuevaCuenta.concepto || !nuevaCuenta.monto) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const fechaCreacion = new Date().toISOString().split('T')[0];
    const fechaVencimiento = calcularFechaVencimiento(fechaCreacion);

    const cuenta: CuentaPorCobrar = {
      id: Date.now().toString(),
      cliente: nuevaCuenta.cliente,
      concepto: nuevaCuenta.concepto,
      monto: nuevaCuenta.monto,
      moneda: nuevaCuenta.moneda,
      fechaCreacion,
      fechaVencimiento,
      estado: determinarEstado(fechaVencimiento),
      descripcion: nuevaCuenta.descripcion
    };

    const nuevasCuentas = [...cuentas, cuenta];
    guardarCuentas(nuevasCuentas);
    
    toast({
      title: "Cuenta creada exitosamente",
      description: `La cuenta por cobrar ha sido registrada`,
    });

    setNuevaCuenta({ cliente: '', concepto: '', monto: '', moneda: 'USD', descripcion: '' });
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
      description: "La cuenta por cobrar ha sido eliminada",
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
    const coincideTexto = cuenta.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
                         cuenta.concepto.toLowerCase().includes(filtro.toLowerCase());
    
    const coincideEstado = filtroEstado === 'todas' || cuenta.estado === filtroEstado;
    
    return coincideTexto && coincideEstado;
  });

  const montoTotalUSD = cuentas.filter(c => c.estado !== 'pagado').reduce((acc, c) => {
    return acc + convertirMoneda(c.monto, c.moneda, 'USD');
  }, 0);

  const montoTotalBS = cuentas.filter(c => c.estado !== 'pagado').reduce((acc, c) => {
    return acc + convertirMoneda(c.monto, c.moneda, 'BS');
  }, 0);

  const cuentasVencidas = cuentas.filter(c => c.estado === 'vencido').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Cuentas por Cobrar</h1>
          <p className="text-lg text-gray-600">Gestiona los montos pendientes de cobro con conversión automática</p>
        </div>
        <Dialog open={isCrearOpen} onOpenChange={setIsCrearOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cuenta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Cuenta por Cobrar</DialogTitle>
              <DialogDescription>
                Registre una nueva cuenta pendiente de cobro
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  value={nuevaCuenta.cliente}
                  onChange={(e) => setNuevaCuenta({...nuevaCuenta, cliente: e.target.value})}
                  placeholder="Nombre del cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto *</Label>
                <Input
                  id="concepto"
                  value={nuevaCuenta.concepto}
                  onChange={(e) => setNuevaCuenta({...nuevaCuenta, concepto: e.target.value})}
                  placeholder="Motivo de la cuenta por cobrar"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="moneda">Moneda *</Label>
                  <Select value={nuevaCuenta.moneda} onValueChange={(value: 'USD' | 'BS') => setNuevaCuenta({...nuevaCuenta, moneda: value})}>
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={crearCuenta}
                >
                  Crear Cuenta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tarjetas de resumen mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200/30 rounded-bl-3xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">Total por Cobrar</CardTitle>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">${montoTotalUSD.toFixed(2)}</div>
            <div className="text-lg font-semibold text-emerald-700">{tasaCambio?.moneda || 'BS'} {montoTotalBS.toFixed(2)}</div>
            <p className="text-xs text-emerald-600 mt-1">pendiente de cobro</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-pink-100 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-bl-3xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Cuentas Vencidas</CardTitle>
            <Calendar className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800">{cuentasVencidas}</div>
            <p className="text-xs text-red-600 mt-1">requieren atención urgente</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-bl-3xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total de Cuentas</CardTitle>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{cuentas.length}</div>
            <p className="text-xs text-blue-600 mt-1">registradas en el sistema</p>
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
                  placeholder="Buscar por cliente o concepto..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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

      {/* Tabla mejorada */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-xl">Listado de Cuentas por Cobrar ({cuentasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-700">Cliente</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Concepto</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Monto USD</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Monto {tasaCambio?.moneda || 'BS'}</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Vencimiento</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuentasFiltradas.map((cuenta, index) => (
                  <tr 
                    key={cuenta.id} 
                    className="border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4 font-medium">{cuenta.cliente}</td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm font-medium">{cuenta.concepto}</div>
                        {cuenta.descripcion && (
                          <div className="text-xs text-gray-500">{cuenta.descripcion}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                        ${convertirMoneda(cuenta.monto, cuenta.moneda, 'USD').toFixed(2)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        {tasaCambio?.moneda || 'BS'} {convertirMoneda(cuenta.monto, cuenta.moneda, 'BS').toFixed(2)}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{cuenta.fechaVencimiento}</td>
                    <td className="p-4">
                      <Badge 
                        variant={
                          cuenta.estado === 'pagado' ? 'secondary' : 
                          cuenta.estado === 'vencido' ? 'destructive' : 'default'
                        }
                        className={
                          cuenta.estado === 'pagado' ? 'bg-gray-100 text-gray-800' :
                          cuenta.estado === 'vencido' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {cuenta.estado === 'pagado' ? 'Pagado' : 
                         cuenta.estado === 'vencido' ? 'Vencido' : 'Pendiente'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {cuenta.estado !== 'pagado' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => marcarComoPagado(cuenta.id)}
                            className="w-8 h-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Marcar como pagado"
                          >
                            <DollarSign className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCuentaEditando(cuenta);
                            setIsEditarOpen(true);
                          }}
                          className="w-8 h-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarCuenta(cuenta.id)}
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
            {cuentasFiltradas.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No se encontraron cuentas que coincidan con los filtros</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para editar cuenta */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cuenta por Cobrar</DialogTitle>
            <DialogDescription>
              Modifique la información de la cuenta
            </DialogDescription>
          </DialogHeader>
          {cuentaEditando && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cliente">Cliente</Label>
                <Input
                  id="edit-cliente"
                  value={cuentaEditando.cliente}
                  onChange={(e) => setCuentaEditando({...cuentaEditando, cliente: e.target.value})}
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
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="edit-moneda">Moneda</Label>
                  <Select value={cuentaEditando.moneda} onValueChange={(value: 'USD' | 'BS') => setCuentaEditando({...cuentaEditando, moneda: value})}>
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

export default JHCuentasPorCobrar;
