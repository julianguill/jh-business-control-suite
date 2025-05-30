
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
    { id: 'inicio', label: 'Inicio', icon: Home, gradient: 'from-blue-500 to-purple-600' },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3, gradient: 'from-emerald-500 to-teal-600' },
    { id: 'tareas', label: 'Tareas', icon: CheckSquare, gradient: 'from-orange-500 to-red-600' },
  ];

  const SidebarItem = ({ item, isActive, onClick }: any) => {
    const Icon = item.icon;
    
    if (!isExpanded) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`w-12 h-12 p-0 justify-center relative group transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-110` 
                    : 'text-gray-600 hover:text-white hover:shadow-lg'
                } rounded-xl`}
                onClick={onClick}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl blur-sm opacity-50`}></div>
                )}
                {!isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                )}
                <Icon className="w-5 h-5 relative z-10" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Button
        variant="ghost"
        className={`w-full justify-start gap-3 h-12 px-4 relative group transition-all duration-300 ${
          isActive 
            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg border-r-4 border-white/30` 
            : 'text-gray-700 hover:text-white hover:shadow-lg'
        } rounded-xl mb-1`}
        onClick={onClick}
      >
        {isActive && (
          <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl blur-sm opacity-50`}></div>
        )}
        {!isActive && (
          <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
        )}
        <Icon className="w-5 h-5 relative z-10" />
        <span className="text-sm font-medium relative z-10">{item.label}</span>
      </Button>
    );
  };

  return (
    <div className={`bg-gradient-to-b from-slate-50 to-white border-r border-gray-200 shadow-xl transition-all duration-300 ${
      isExpanded ? 'w-72' : 'w-20'
    } flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          {isExpanded && (
            <div className="text-white">
              <h1 className="text-xl font-bold">JH Control</h1>
              <p className="text-xs text-blue-100">Sistema de Gestión</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
          />
        ))}

        {/* Contabilidad Dropdown */}
        <div className="space-y-1">
          {!isExpanded ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 p-0 justify-center text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 rounded-xl transition-all duration-300 hover:shadow-lg"
                    onClick={() => setIsContabilidadOpen(!isContabilidadOpen)}
                  >
                    <DollarSign className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                  <p>Contabilidad</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-between h-12 px-4 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 rounded-xl transition-all duration-300 hover:shadow-lg group"
                onClick={() => setIsContabilidadOpen(!isContabilidadOpen)}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm font-medium">Contabilidad</span>
                </div>
                {isContabilidadOpen ? (
                  <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform duration-300" />
                )}
              </Button>
              {isContabilidadOpen && (
                <div className="ml-8 space-y-1 animate-fade-in">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-10 px-3 text-sm rounded-lg transition-all duration-300 ${
                      activeSection === 'cuentas-por-cobrar'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-l-4 border-green-500'
                        : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                    }`}
                    onClick={() => setActiveSection('cuentas-por-cobrar')}
                  >
                    Cuentas por cobrar
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-10 px-3 text-sm rounded-lg transition-all duration-300 ${
                      activeSection === 'cuentas-por-pagar'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-l-4 border-green-500'
                        : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                    }`}
                    onClick={() => setActiveSection('cuentas-por-pagar')}
                  >
                    Cuentas por pagar
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Facturación Dropdown */}
        <div className="space-y-1">
          {!isExpanded ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 p-0 justify-center text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 rounded-xl transition-all duration-300 hover:shadow-lg"
                    onClick={() => setIsFacturacionOpen(!isFacturacionOpen)}
                  >
                    <FileText className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                  <p>Facturación</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-between h-12 px-4 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 rounded-xl transition-all duration-300 hover:shadow-lg group"
                onClick={() => setIsFacturacionOpen(!isFacturacionOpen)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Facturación</span>
                </div>
                {isFacturacionOpen ? (
                  <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform duration-300" />
                )}
              </Button>
              {isFacturacionOpen && (
                <div className="ml-8 space-y-1 animate-fade-in">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-10 px-3 text-sm rounded-lg transition-all duration-300 ${
                      activeSection === 'historial'
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-l-4 border-indigo-500'
                        : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
                    }`}
                    onClick={() => setActiveSection('historial')}
                  >
                    Historial
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-10 px-3 text-sm rounded-lg transition-all duration-300 ${
                      activeSection === 'gestion-recibos'
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-l-4 border-indigo-500'
                        : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
                    }`}
                    onClick={() => setActiveSection('gestion-recibos')}
                  >
                    Gestión de recibos
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-10 px-3 text-sm rounded-lg transition-all duration-300 ${
                      activeSection === 'ajustes-facturacion'
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-l-4 border-indigo-500'
                        : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
                    }`}
                    onClick={() => setActiveSection('ajustes-facturacion')}
                  >
                    Ajustes de facturación
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <SidebarItem
          item={{ 
            id: 'ajustes', 
            label: 'Ajustes', 
            icon: Settings, 
            gradient: 'from-gray-500 to-slate-600' 
          }}
          isActive={activeSection === 'ajustes'}
          onClick={() => setActiveSection('ajustes')}
        />
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
        {!isExpanded ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 p-0 justify-center text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 hover:shadow-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                <p>Cerrar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 px-4 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 hover:shadow-lg group"
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
