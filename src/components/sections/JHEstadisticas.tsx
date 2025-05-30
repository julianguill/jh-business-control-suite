
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, DollarSign, TrendingUp, Users, FileText } from 'lucide-react';

const JHEstadisticas = () => {
  const [stats, setStats] = useState({
    tareasPendientes: 0,
    tareasCompletadas: 0,
    montoTotal: 0,
    clientesActivos: 0,
    facturasPendientes: 0,
    ingresosMes: 0
  });

  useEffect(() => {
    // Cargar estadísticas desde localStorage
    const tareas = JSON.parse(localStorage.getItem('jhTareas') || '[]');
    const recibos = JSON.parse(localStorage.getItem('jhRecibos') || '[]');
    
    const tareasPendientes = tareas.filter((t: any) => !t.completada).length;
    const tareasCompletadas = tareas.filter((t: any) => t.completada).length;
    const montoTotal = tareas.reduce((acc: number, t: any) => acc + (parseFloat(t.monto) || 0), 0);
    
    const clientesUnicos = [...new Set(tareas.map((t: any) => t.cliente))].length;
    const facturasPendientes = recibos.filter((r: any) => r.estado === 'pendiente').length;
    const ingresosMes = recibos
      .filter((r: any) => {
        const fecha = new Date(r.fechaEmision);
        const ahora = new Date();
        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
      })
      .reduce((acc: number, r: any) => acc + (parseFloat(r.monto) || 0), 0);

    setStats({
      tareasPendientes,
      tareasCompletadas,
      montoTotal,
      clientesActivos: clientesUnicos,
      facturasPendientes,
      ingresosMes
    });
  }, []);

  const statCards = [
    {
      title: "Tareas Pendientes",
      value: stats.tareasPendientes,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Tareas por completar"
    },
    {
      title: "Tareas Completadas",
      value: stats.tareasCompletadas,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Tareas finalizadas"
    },
    {
      title: "Monto Total por Cobrar",
      value: `$${stats.montoTotal.toFixed(2)}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Total pendiente de cobro"
    },
    {
      title: "Clientes Activos",
      value: stats.clientesActivos,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Clientes con tareas"
    },
    {
      title: "Facturas Pendientes",
      value: stats.facturasPendientes,
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Facturas por cobrar"
    },
    {
      title: "Ingresos del Mes",
      value: `$${stats.ingresosMes.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Ingresos mensuales"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Estadísticas del Negocio</h1>
        <p className="text-lg text-gray-600">Monitorea el rendimiento y progreso de tu empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <CardDescription className="text-xs text-gray-500">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen rápido */}
      <Card className="animate-slide-in-right">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Resumen Ejecutivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Eficiencia de Tareas</span>
              <span className="text-sm font-bold text-green-600">
                {stats.tareasCompletadas + stats.tareasPendientes > 0 
                  ? Math.round((stats.tareasCompletadas / (stats.tareasCompletadas + stats.tareasPendientes)) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Promedio por Cliente</span>
              <span className="text-sm font-bold text-blue-600">
                ${stats.clientesActivos > 0 ? (stats.montoTotal / stats.clientesActivos).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Estado General</span>
              <span className={`text-sm font-bold ${
                stats.tareasPendientes <= stats.tareasCompletadas ? 'text-green-600' : 'text-orange-600'
              }`}>
                {stats.tareasPendientes <= stats.tareasCompletadas ? 'Excelente' : 'En Progreso'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JHEstadisticas;
