
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BarChart3, 
  CheckSquare, 
  DollarSign, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronDown, 
  ChevronRight,
  Receipt,
  CreditCard
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface JHSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const JHSidebar = ({ activeSection, setActiveSection }: JHSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isContabilidadOpen, setIsContabilidadOpen] = useState(false);
  const [isFacturacionOpen, setIsFacturacionOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jhAuth');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    navigate('/');
  };

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { id: 'tareas', label: 'Tareas', icon: CheckSquare },
  ];

  const SidebarItem = ({ item, isActive, onClick }: any) => {
    const Icon = item.icon;
    
    if (!isExpanded) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={`w-12 h-12 p-0 justify-center ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={onClick}
              >
                <Icon className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 h-11 px-3 ${
          isActive 
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        onClick={onClick}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </Button>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    } flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>
          {isExpanded && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">JH Control</h1>
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
          />
        ))}

        {/* Contabilidad Dropdown */}
        <div>
          {!isExpanded ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 p-0 justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsContabilidadOpen(!isContabilidadOpen)}
                  >
                    <DollarSign className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Contabilidad</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-between h-11 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsContabilidadOpen(!isContabilidadOpen)}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm font-medium">Contabilidad</span>
                </div>
                {isContabilidadOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              {isContabilidadOpen && (
                <div className="ml-6 space-y-1">
                  <Button
                    variant={activeSection === 'cuentas-por-cobrar' ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 px-3 ${
                      activeSection === 'cuentas-por-cobrar'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('cuentas-por-cobrar')}
                  >
                    <span className="text-sm">Cuentas por cobrar</span>
                  </Button>
                  <Button
                    variant={activeSection === 'cuentas-por-pagar' ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 px-3 ${
                      activeSection === 'cuentas-por-pagar'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('cuentas-por-pagar')}
                  >
                    <span className="text-sm">Cuentas por pagar</span>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Facturación Dropdown */}
        <div>
          {!isExpanded ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 p-0 justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsFacturacionOpen(!isFacturacionOpen)}
                  >
                    <FileText className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Facturación</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-between h-11 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsFacturacionOpen(!isFacturacionOpen)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Facturación</span>
                </div>
                {isFacturacionOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              {isFacturacionOpen && (
                <div className="ml-6 space-y-1">
                  <Button
                    variant={activeSection === 'historial' ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 px-3 ${
                      activeSection === 'historial'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('historial')}
                  >
                    <span className="text-sm">Historial</span>
                  </Button>
                  <Button
                    variant={activeSection === 'gestion-recibos' ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 px-3 ${
                      activeSection === 'gestion-recibos'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('gestion-recibos')}
                  >
                    <span className="text-sm">Gestión de recibos</span>
                  </Button>
                  <Button
                    variant={activeSection === 'ajustes-facturacion' ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 px-3 ${
                      activeSection === 'ajustes-facturacion'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('ajustes-facturacion')}
                  >
                    <span className="text-sm">Ajustes de facturación</span>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <SidebarItem
          item={{ id: 'ajustes', label: 'Ajustes', icon: Settings }}
          isActive={activeSection === 'ajustes'}
          onClick={() => setActiveSection('ajustes')}
        />
      </div>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-200">
        {!isExpanded ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 p-0 justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Cerrar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default JHSidebar;
