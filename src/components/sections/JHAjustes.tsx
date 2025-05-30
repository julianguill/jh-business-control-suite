
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Settings, 
  User, 
  Mail, 
  Phone, 
  Save, 
  FileDown, 
  Upload,
  Camera,
  Database,
  Shield
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PerfilAdmin {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  foto: string;
  biografia: string;
}

const JHAjustes = () => {
  const [perfil, setPerfil] = useState<PerfilAdmin>({
    nombre: 'Administrador',
    email: 'admin@jhcontrol.com',
    telefono: '+58 412 123 4567',
    empresa: 'JH Control System',
    foto: '',
    biografia: 'Administrador del sistema de gestión empresarial JH Control.'
  });

  const [isReporteOpen, setIsReporteOpen] = useState(false);
  const [tipoReporte, setTipoReporte] = useState('completo');

  useEffect(() => {
    const perfilGuardado = localStorage.getItem('jhPerfilAdmin');
    if (perfilGuardado) {
      setPerfil(JSON.parse(perfilGuardado));
    }
  }, []);

  const guardarPerfil = () => {
    localStorage.setItem('jhPerfilAdmin', JSON.stringify(perfil));
    toast({
      title: "Perfil actualizado",
      description: "Los cambios han sido guardados exitosamente",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPerfil({ ...perfil, foto: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const generarReporte = () => {
    const datos = {
      tareas: JSON.parse(localStorage.getItem('jhTareas') || '[]'),
      recibos: JSON.parse(localStorage.getItem('jhRecibos') || '[]'),
      cuentasPorCobrar: JSON.parse(localStorage.getItem('jhCuentasPorCobrar') || '[]'),
      cuentasPorPagar: JSON.parse(localStorage.getItem('jhCuentasPorPagar') || '[]'),
      configuracion: JSON.parse(localStorage.getItem('jhConfigFacturacion') || '{}'),
      perfil: JSON.parse(localStorage.getItem('jhPerfilAdmin') || '{}')
    };

    let reporte = '';
    const fecha = new Date().toLocaleDateString();

    switch (tipoReporte) {
      case 'completo':
        reporte = `REPORTE COMPLETO DEL SISTEMA JH CONTROL\nFecha: ${fecha}\n\n`;
        reporte += `=== ESTADÍSTICAS GENERALES ===\n`;
        reporte += `Total de Tareas: ${datos.tareas.length}\n`;
        reporte += `Tareas Completadas: ${datos.tareas.filter((t: any) => t.completada).length}\n`;
        reporte += `Total de Recibos: ${datos.recibos.length}\n`;
        reporte += `Cuentas por Cobrar: ${datos.cuentasPorCobrar.length}\n`;
        reporte += `Cuentas por Pagar: ${datos.cuentasPorPagar.length}\n\n`;
        
        reporte += `=== RESUMEN FINANCIERO ===\n`;
        reporte += `Monto Total en Tareas: $${datos.tareas.reduce((acc: number, t: any) => acc + parseFloat(t.monto || 0), 0).toFixed(2)}\n`;
        reporte += `Monto Total en Recibos: $${datos.recibos.reduce((acc: number, r: any) => acc + parseFloat(r.monto || 0), 0).toFixed(2)}\n\n`;
        break;
        
      case 'financiero':
        reporte = `REPORTE FINANCIERO - JH CONTROL\nFecha: ${fecha}\n\n`;
        reporte += `=== INGRESOS ===\n`;
        datos.recibos.forEach((r: any) => {
          reporte += `${r.numeroPedido}: ${r.monto} ${r.tipoMoneda} - ${r.cliente.nombre}\n`;
        });
        reporte += `\n=== CUENTAS POR COBRAR ===\n`;
        datos.cuentasPorCobrar.forEach((c: any) => {
          reporte += `${c.cliente}: $${c.monto} - Vence: ${c.fechaVencimiento}\n`;
        });
        break;
        
      case 'tareas':
        reporte = `REPORTE DE TAREAS - JH CONTROL\nFecha: ${fecha}\n\n`;
        datos.tareas.forEach((t: any) => {
          reporte += `${t.nombre} - Cliente: ${t.cliente} - Monto: $${t.monto} - Estado: ${t.completada ? 'Completada' : 'Pendiente'}\n`;
        });
        break;
    }

    // Descargar el reporte
    const blob = new Blob([reporte], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_${tipoReporte}_${fecha.replace(/\//g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Reporte generado",
      description: `El reporte ${tipoReporte} ha sido descargado`,
    });

    setIsReporteOpen(false);
  };

  const exportarDatos = () => {
    const todosLosDatos = {
      tareas: JSON.parse(localStorage.getItem('jhTareas') || '[]'),
      recibos: JSON.parse(localStorage.getItem('jhRecibos') || '[]'),
      cuentasPorCobrar: JSON.parse(localStorage.getItem('jhCuentasPorCobrar') || '[]'),
      cuentasPorPagar: JSON.parse(localStorage.getItem('jhCuentasPorPagar') || '[]'),
      configuracion: JSON.parse(localStorage.getItem('jhConfigFacturacion') || '{}'),
      perfil: JSON.parse(localStorage.getItem('jhPerfilAdmin') || '{}'),
      fechaExportacion: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(todosLosDatos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_jh_control_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Datos exportados",
      description: "Backup completo del sistema descargado",
    });
  };

  const limpiarDatos = () => {
    if (confirm('¿Está seguro de que desea eliminar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('jhTareas');
      localStorage.removeItem('jhRecibos');
      localStorage.removeItem('jhCuentasPorCobrar');
      localStorage.removeItem('jhCuentasPorPagar');
      localStorage.removeItem('jhConfigFacturacion');
      
      toast({
        title: "Datos eliminados",
        description: "Todos los datos del sistema han sido eliminados",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración del Sistema</h1>
        <p className="text-lg text-gray-600">Administra tu perfil y las configuraciones generales</p>
      </div>

      {/* Perfil del Administrador */}
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Perfil del Administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={perfil.foto} alt={perfil.nombre} />
                <AvatarFallback className="text-2xl">
                  {perfil.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label htmlFor="foto-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  id="foto-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{perfil.nombre}</h3>
              <p className="text-gray-600">{perfil.empresa}</p>
              <p className="text-sm text-gray-500">{perfil.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={perfil.nombre}
                onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                placeholder="Tu nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={perfil.email}
                onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={perfil.telefono}
                onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                placeholder="+58 412 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={perfil.empresa}
                onChange={(e) => setPerfil({ ...perfil, empresa: e.target.value })}
                placeholder="Nombre de tu empresa"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biografia">Biografía</Label>
            <Textarea
              id="biografia"
              value={perfil.biografia}
              onChange={(e) => setPerfil({ ...perfil, biografia: e.target.value })}
              placeholder="Descripción breve sobre ti o tu rol"
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={guardarPerfil} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Guardar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Datos */}
      <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            Gestión de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog open={isReporteOpen} onOpenChange={setIsReporteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <FileDown className="w-6 h-6 text-blue-600" />
                  <div className="text-center">
                    <div className="font-medium">Generar Reporte</div>
                    <div className="text-xs text-gray-500">Exportar datos en formato texto</div>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generar Reporte del Sistema</DialogTitle>
                  <DialogDescription>
                    Seleccione el tipo de reporte que desea generar
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Reporte</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="completo"
                          name="tipoReporte"
                          value="completo"
                          checked={tipoReporte === 'completo'}
                          onChange={(e) => setTipoReporte(e.target.value)}
                          className="rounded"
                        />
                        <label htmlFor="completo" className="text-sm">Reporte Completo</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="financiero"
                          name="tipoReporte"
                          value="financiero"
                          checked={tipoReporte === 'financiero'}
                          onChange={(e) => setTipoReporte(e.target.value)}
                          className="rounded"
                        />
                        <label htmlFor="financiero" className="text-sm">Reporte Financiero</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="tareas"
                          name="tipoReporte"
                          value="tareas"
                          checked={tipoReporte === 'tareas'}
                          onChange={(e) => setTipoReporte(e.target.value)}
                          className="rounded"
                        />
                        <label htmlFor="tareas" className="text-sm">Reporte de Tareas</label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsReporteOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={generarReporte}
                    >
                      Generar Reporte
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={exportarDatos}
            >
              <Upload className="w-6 h-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium">Exportar Datos</div>
                <div className="text-xs text-gray-500">Backup completo del sistema</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={limpiarDatos}
            >
              <Shield className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Limpiar Datos</div>
                <div className="text-xs text-gray-500">Eliminar toda la información</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Versión:</span>
                <span className="font-medium">JH Control v1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última actualización:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-green-600">Operativo</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de tareas:</span>
                <span className="font-medium">{JSON.parse(localStorage.getItem('jhTareas') || '[]').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de recibos:</span>
                <span className="font-medium">{JSON.parse(localStorage.getItem('jhRecibos') || '[]').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Almacenamiento:</span>
                <span className="font-medium">Local Storage</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JHAjustes;
