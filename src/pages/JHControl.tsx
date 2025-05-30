
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JHSidebar from '@/components/JHSidebar';
import JHInicio from '@/components/sections/JHInicio';
import JHEstadisticas from '@/components/sections/JHEstadisticas';
import JHTareas from '@/components/sections/JHTareas';
import JHCuentasPorCobrar from '@/components/sections/JHCuentasPorCobrar';
import JHCuentasPorPagar from '@/components/sections/JHCuentasPorPagar';
import JHHistorial from '@/components/sections/JHHistorial';
import JHGestionRecibos from '@/components/sections/JHGestionRecibos';
import JHAjustesFacturacion from '@/components/sections/JHAjustesFacturacion';
import JHAjustes from '@/components/sections/JHAjustes';

const JHControl = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('jhAuth');
    if (!isAuth) {
      navigate('/');
    }
  }, [navigate]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'inicio':
        return <JHInicio />;
      case 'estadisticas':
        return <JHEstadisticas />;
      case 'tareas':
        return <JHTareas />;
      case 'cuentas-por-cobrar':
        return <JHCuentasPorCobrar />;
      case 'cuentas-por-pagar':
        return <JHCuentasPorPagar />;
      case 'historial':
        return <JHHistorial />;
      case 'gestion-recibos':
        return <JHGestionRecibos />;
      case 'ajustes-facturacion':
        return <JHAjustesFacturacion />;
      case 'ajustes':
        return <JHAjustes />;
      default:
        return <JHInicio />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <JHSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
};

export default JHControl;
