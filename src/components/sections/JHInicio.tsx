
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const JHInicio = () => {
  const [tasa, setTasa] = useState('');
  const [moneda, setMoneda] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAsignarTasa = () => {
    if (!tasa || !moneda) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    // Guardar en localStorage para uso global
    localStorage.setItem('tasaCambio', JSON.stringify({ tasa, moneda }));
    
    toast({
      title: "Tasa asignada",
      description: `Tasa de cambio: ${tasa} ${moneda}`,
    });
    
    setIsOpen(false);
    setTasa('');
    setMoneda('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido al Panel de Control!</h1>
        <p className="text-lg text-gray-600">Gestiona tu negocio de manera eficiente y profesional</p>
      </div>

      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl text-gray-900">Sistema de Gestión JH</CardTitle>
              <CardDescription className="text-base">
                Controla todas las operaciones de tu negocio desde un solo lugar. 
                Gestiona tareas, facturación, contabilidad y mucho más con nuestra 
                plataforma integrada.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sistema activo y funcionando</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Todas las funciones disponibles</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Datos sincronizados en tiempo real</span>
                </div>
              </div>
            </CardContent>
          </div>
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Control Total</h3>
              <p className="text-gray-600">Administra tu negocio con confianza</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 h-auto transform hover:scale-105 transition-all duration-200"
            >
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              Asignar Tasa de Cambio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                Configurar Tasa de Cambio
              </DialogTitle>
              <DialogDescription>
                Establece la tasa de cambio actual para las operaciones del sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tasa">Tasa de Cambio</Label>
                <Input
                  id="tasa"
                  type="number"
                  step="0.01"
                  placeholder="Ej: 36.50"
                  value={tasa}
                  onChange={(e) => setTasa(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moneda">Tipo de Moneda</Label>
                <Input
                  id="moneda"
                  type="text"
                  placeholder="Ej: USD, EUR, BS"
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value.toUpperCase())}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleAsignarTasa}
                >
                  Asignar Tasa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JHInicio;
