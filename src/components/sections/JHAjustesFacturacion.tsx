
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, FileText, DollarSign, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConfiguracionFacturacion {
  empresa: {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    logo: string;
  };
  facturacion: {
    prefijo: string;
    numeroInicial: number;
    monedaPorDefecto: string;
    metodoPagoPorDefecto: string;
    incluirImpuestos: boolean;
    porcentajeImpuesto: number;
    terminosCondiciones: string;
  };
  notificaciones: {
    emailRecordatorios: boolean;
    diasAnticipacion: number;
    mensajePersonalizado: string;
  };
}

const JHAjustesFacturacion = () => {
  const [config, setConfig] = useState<ConfiguracionFacturacion>({
    empresa: {
      nombre: 'JH Control',
      direccion: '',
      telefono: '',
      email: '',
      logo: ''
    },
    facturacion: {
      prefijo: 'JH',
      numeroInicial: 1000,
      monedaPorDefecto: 'USD',
      metodoPagoPorDefecto: 'efectivo',
      incluirImpuestos: false,
      porcentajeImpuesto: 16,
      terminosCondiciones: 'Pago requerido en un plazo de 30 días.'
    },
    notificaciones: {
      emailRecordatorios: false,
      diasAnticipacion: 7,
      mensajePersonalizado: 'Le recordamos que tiene un pago pendiente.'
    }
  });

  useEffect(() => {
    const configGuardada = localStorage.getItem('jhConfigFacturacion');
    if (configGuardada) {
      setConfig(JSON.parse(configGuardada));
    }
  }, []);

  const guardarConfiguracion = () => {
    localStorage.setItem('jhConfigFacturacion', JSON.stringify(config));
    toast({
      title: "Configuración guardada",
      description: "Los ajustes de facturación han sido actualizados",
    });
  };

  const actualizarEmpresa = (campo: string, valor: string) => {
    setConfig({
      ...config,
      empresa: {
        ...config.empresa,
        [campo]: valor
      }
    });
  };

  const actualizarFacturacion = (campo: string, valor: any) => {
    setConfig({
      ...config,
      facturacion: {
        ...config.facturacion,
        [campo]: valor
      }
    });
  };

  const actualizarNotificaciones = (campo: string, valor: any) => {
    setConfig({
      ...config,
      notificaciones: {
        ...config.notificaciones,
        [campo]: valor
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajustes de Facturación</h1>
        <p className="text-lg text-gray-600">Configura los parámetros para la generación de recibos y facturas</p>
      </div>

      {/* Información de la Empresa */}
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Información de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Empresa</Label>
              <Input
                id="nombre"
                value={config.empresa.nombre}
                onChange={(e) => actualizarEmpresa('nombre', e.target.value)}
                placeholder="Nombre de tu empresa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de Contacto</Label>
              <Input
                id="email"
                type="email"
                value={config.empresa.email}
                onChange={(e) => actualizarEmpresa('email', e.target.value)}
                placeholder="contacto@empresa.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={config.empresa.telefono}
                onChange={(e) => actualizarEmpresa('telefono', e.target.value)}
                placeholder="+58 412 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={config.empresa.direccion}
                onChange={(e) => actualizarEmpresa('direccion', e.target.value)}
                placeholder="Dirección completa"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Facturación */}
      <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Configuración de Facturación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefijo">Prefijo de Recibos</Label>
              <Input
                id="prefijo"
                value={config.facturacion.prefijo}
                onChange={(e) => actualizarFacturacion('prefijo', e.target.value.toUpperCase())}
                placeholder="JH"
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroInicial">Número Inicial</Label>
              <Input
                id="numeroInicial"
                type="number"
                value={config.facturacion.numeroInicial}
                onChange={(e) => actualizarFacturacion('numeroInicial', parseInt(e.target.value))}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monedaDefecto">Moneda por Defecto</Label>
              <Input
                id="monedaDefecto"
                value={config.facturacion.monedaPorDefecto}
                onChange={(e) => actualizarFacturacion('monedaPorDefecto', e.target.value.toUpperCase())}
                placeholder="USD"
                maxLength={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metodoPagoDefecto">Método de Pago por Defecto</Label>
            <Select 
              value={config.facturacion.metodoPagoPorDefecto} 
              onValueChange={(value) => actualizarFacturacion('metodoPagoPorDefecto', value)}
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

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="incluirImpuestos">Incluir Impuestos</Label>
                <p className="text-sm text-gray-500">
                  Agregar impuestos automáticamente a los recibos
                </p>
              </div>
              <Switch
                id="incluirImpuestos"
                checked={config.facturacion.incluirImpuestos}
                onCheckedChange={(checked) => actualizarFacturacion('incluirImpuestos', checked)}
              />
            </div>

            {config.facturacion.incluirImpuestos && (
              <div className="space-y-2">
                <Label htmlFor="porcentajeImpuesto">Porcentaje de Impuesto (%)</Label>
                <Input
                  id="porcentajeImpuesto"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={config.facturacion.porcentajeImpuesto}
                  onChange={(e) => actualizarFacturacion('porcentajeImpuesto', parseFloat(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="terminosCondiciones">Términos y Condiciones</Label>
            <Textarea
              id="terminosCondiciones"
              value={config.facturacion.terminosCondiciones}
              onChange={(e) => actualizarFacturacion('terminosCondiciones', e.target.value)}
              placeholder="Escriba los términos y condiciones que aparecerán en los recibos"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Notificaciones */}
      <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Notificaciones y Recordatorios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailRecordatorios">Recordatorios por Email</Label>
              <p className="text-sm text-gray-500">
                Enviar recordatorios automáticos de pagos pendientes
              </p>
            </div>
            <Switch
              id="emailRecordatorios"
              checked={config.notificaciones.emailRecordatorios}
              onCheckedChange={(checked) => actualizarNotificaciones('emailRecordatorios', checked)}
            />
          </div>

          {config.notificaciones.emailRecordatorios && (
            <>
              <div className="space-y-2">
                <Label htmlFor="diasAnticipacion">Días de Anticipación</Label>
                <Input
                  id="diasAnticipacion"
                  type="number"
                  min="1"
                  max="30"
                  value={config.notificaciones.diasAnticipacion}
                  onChange={(e) => actualizarNotificaciones('diasAnticipacion', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500">
                  Enviar recordatorio X días antes del vencimiento
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensajePersonalizado">Mensaje Personalizado</Label>
                <Textarea
                  id="mensajePersonalizado"
                  value={config.notificaciones.mensajePersonalizado}
                  onChange={(e) => actualizarNotificaciones('mensajePersonalizado', e.target.value)}
                  placeholder="Mensaje que se incluirá en los recordatorios"
                  rows={2}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Botón de Guardar */}
      <div className="flex justify-end">
        <Button 
          onClick={guardarConfiguracion}
          className="bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
};

export default JHAjustesFacturacion;
