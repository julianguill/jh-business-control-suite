import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft, DollarSign, TrendingUp, Activity, Users, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const JHInicio = () => {
  const [tasa, setTasa] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [tasaGuardada, setTasaGuardada] = useState<{tasa: string, moneda: string} | null>(null);

  useEffect(() => {
    const tasaData = localStorage.getItem('tasaCambio');
    if (tasaData) {
      const tasaObj = JSON.parse(tasaData);
      setTasaGuardada(tasaObj);
      setTasa(tasaObj.tasa); // Mostrar la tasa actual en el campo
    }
  }, []);

  const handleAsignarTasa = () => {
    if (!tasa) {
      toast({
        title: "Error",
        description: "Por favor ingrese la tasa de cambio",
        variant: "destructive",
      });
      return;
    }

    const tasaData = { tasa, moneda: 'BS' };
    localStorage.setItem('tasaCambio', JSON.stringify(tasaData));
    setTasaGuardada(tasaData);
    
    toast({
      title: "Tasa asignada exitosamente",
      description: `Nueva tasa: ${tasa} BS por 1 USD`,
    });
    
    setIsOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Header con gradiente */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">¡Bienvenido a JH Control!</h1>
          <p className="text-xl text-blue-100">Tu centro de comando empresarial definitivo</p>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* Cards de estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200/30 rounded-bl-3xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Estado del Sistema</p>
                <p className="text-2xl font-bold text-emerald-800">Activo</p>
              </div>
              <Activity className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-bl-3xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Productividad</p>
                <p className="text-2xl font-bold text-blue-800">100%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-bl-3xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Usuarios Activos</p>
                <p className="text-2xl font-bold text-purple-800">1</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/30 rounded-bl-3xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Tiempo Online</p>
                <p className="text-2xl font-bold text-orange-800">24/7</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card principal mejorado */}
      <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-r from-white to-gray-50">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-3xl text-gray-900 mb-4">Sistema de Gestión Integral</CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Controla todas las operaciones de tu negocio desde un panel unificado. 
                Gestiona tareas, facturación, contabilidad y análisis financiero con nuestra 
                plataforma empresarial de última generación.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 font-medium">Sistema operativo y sincronizado</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 font-medium">Todas las funciones disponibles</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-700 font-medium">Datos en tiempo real</span>
                </div>
              </div>
            </CardContent>
          </div>
          <div className="flex-1 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center text-white">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <DollarSign className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Control Total</h3>
              <p className="text-blue-100 text-lg">Administra tu negocio con confianza</p>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          </div>
        </div>
      </Card>

      {/* Sección de tasa de cambio */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-amber-900 mb-2">Gestión de Tasa de Cambio</h3>
              <p className="text-amber-700 text-lg">
                {tasaGuardada 
                  ? `Tasa actual: ${tasaGuardada.tasa} BS por 1 USD`
                  : 'Configura la tasa de cambio BS por USD para las conversiones automáticas'
                }
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold px-8 py-4 h-auto transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  {tasaGuardada ? 'Actualizar Tasa' : 'Asignar Tasa'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <ArrowRightLeft className="w-6 h-6 text-amber-600" />
                    Configurar Tasa de Cambio
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Establece cuántos bolívares equivalen a 1 dólar estadounidense.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="tasa" className="text-base font-medium">BS por 1 USD</Label>
                    <Input
                      id="tasa"
                      type="number"
                      step="0.01"
                      placeholder="Ej: 36.50"
                      value={tasa}
                      onChange={(e) => setTasa(e.target.value)}
                      className="text-lg p-3"
                    />
                    <p className="text-sm text-gray-600">Ingresa la cantidad de bolívares que equivale a 1 dólar</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 py-3"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 py-3"
                      onClick={handleAsignarTasa}
                    >
                      Guardar Tasa
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JHInicio;
