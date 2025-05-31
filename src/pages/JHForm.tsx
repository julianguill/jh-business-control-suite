
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';

const JHForm = () => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueadoHasta, setBloqueadoHasta] = useState<number | null>(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const navigate = useNavigate();

  const MAX_INTENTOS = 3;
  const TIEMPO_BLOQUEO = 30000; // 30 segundos

  // Verificar si hay un bloqueo activo al cargar
  useEffect(() => {
    const bloqueoGuardado = localStorage.getItem('jhBloqueoHasta');
    const intentosGuardados = localStorage.getItem('jhIntentosFallidos');
    
    if (bloqueoGuardado) {
      const tiempoBloqueo = parseInt(bloqueoGuardado);
      if (Date.now() < tiempoBloqueo) {
        setBloqueadoHasta(tiempoBloqueo);
      } else {
        localStorage.removeItem('jhBloqueoHasta');
        localStorage.removeItem('jhIntentosFallidos');
      }
    }
    
    if (intentosGuardados) {
      setIntentosFallidos(parseInt(intentosGuardados));
    }
  }, []);

  // Contador regresivo para el bloqueo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (bloqueadoHasta) {
      interval = setInterval(() => {
        const ahora = Date.now();
        const restante = Math.max(0, Math.ceil((bloqueadoHasta - ahora) / 1000));
        setTiempoRestante(restante);
        
        if (restante <= 0) {
          setBloqueadoHasta(null);
          setIntentosFallidos(0);
          localStorage.removeItem('jhBloqueoHasta');
          localStorage.removeItem('jhIntentosFallidos');
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [bloqueadoHasta]);

  const sanitizarInput = (input: string) => {
    return input.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  };

  const validarCredenciales = (usuario: string, clave: string) => {
    // Validaciones básicas
    if (usuario.length < 3) {
      toast({
        title: "Error de validación",
        description: "El usuario debe tener al menos 3 caracteres",
        variant: "destructive",
      });
      return false;
    }
    
    if (clave.length < 5) {
      toast({
        title: "Error de validación", 
        description: "La contraseña debe tener al menos 5 caracteres",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const manejarBloqueo = () => {
    const nuevoTiempoBloqueo = Date.now() + TIEMPO_BLOQUEO;
    setBloqueadoHasta(nuevoTiempoBloqueo);
    localStorage.setItem('jhBloqueoHasta', nuevoTiempoBloqueo.toString());
    
    toast({
      title: "Cuenta bloqueada temporalmente",
      description: `Demasiados intentos fallidos. Inténtalo de nuevo en ${TIEMPO_BLOQUEO / 1000} segundos.`,
      variant: "destructive",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si está bloqueado
    if (bloqueadoHasta && Date.now() < bloqueadoHasta) {
      toast({
        title: "Acceso bloqueado",
        description: `Inténtalo de nuevo en ${tiempoRestante} segundos`,
        variant: "destructive",
      });
      return;
    }

    // Validar inputs
    if (!validarCredenciales(usuario, clave)) {
      return;
    }

    setLoading(true);

    // Simular delay de autenticación más realista
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sanitizar inputs antes de verificar
    const usuarioLimpio = sanitizarInput(usuario);
    const claveOriginal = clave.trim();

    if (usuarioLimpio === 'julian' && claveOriginal === 'agosto') {
      // Login exitoso - limpiar intentos fallidos
      setIntentosFallidos(0);
      localStorage.removeItem('jhIntentosFallidos');
      localStorage.removeItem('jhBloqueoHasta');
      
      toast({
        title: "¡Bienvenido!",
        description: "Inicio de sesión exitoso",
      });
      
      localStorage.setItem('jhAuth', 'true');
      localStorage.setItem('jhAuthTime', Date.now().toString());
      navigate('/jh-control');
    } else {
      // Login fallido
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);
      localStorage.setItem('jhIntentosFallidos', nuevosIntentos.toString());
      
      if (nuevosIntentos >= MAX_INTENTOS) {
        manejarBloqueo();
      } else {
        const intentosRestantes = MAX_INTENTOS - nuevosIntentos;
        toast({
          title: "Credenciales incorrectas",
          description: `Tienes ${intentosRestantes} intento${intentosRestantes !== 1 ? 's' : ''} restante${intentosRestantes !== 1 ? 's' : ''}`,
          variant: "destructive",
        });
      }
    }
    
    setLoading(false);
  };

  const estaBloquedo = bloqueadoHasta && Date.now() < bloqueadoHasta;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            {estaBloquedo ? (
              <Shield className="w-8 h-8 text-white" />
            ) : (
              <LogIn className="w-8 h-8 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">JH Control</CardTitle>
          <CardDescription className="text-gray-600">
            Sistema de Gestión Empresarial
          </CardDescription>
          {estaBloquedo && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium">
                Acceso bloqueado por {tiempoRestante}s
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-sm font-medium text-gray-700">
                Usuario
              </Label>
              <Input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingrese su usuario"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={estaBloquedo || loading}
                maxLength={20}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clave" className="text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="clave"
                  type={showPassword ? 'text' : 'password'}
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="h-11 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={estaBloquedo || loading}
                  maxLength={50}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={estaBloquedo || loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            {intentosFallidos > 0 && !estaBloquedo && (
              <div className="text-sm text-amber-600 text-center">
                Intentos fallidos: {intentosFallidos}/{MAX_INTENTOS}
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
              disabled={loading || estaBloquedo}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verificando...
                </div>
              ) : estaBloquedo ? (
                `Bloqueado (${tiempoRestante}s)`
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JHForm;
