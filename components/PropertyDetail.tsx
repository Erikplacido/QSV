import React from 'react';
import { Property } from '../types';
import { PlusIcon } from './Icons';

// --- Property Detail Component ---
interface PropertyDetailProps {
  property: Property;
  onStartInspection: () => void;
  onViewReport: (inspectionId: string) => void;
}
const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, onStartInspection, onViewReport }) => {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{property.address}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{property.type}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <p><strong className="dark:text-gray-300">Área:</strong> {property.area} m²</p>
          <p><strong className="dark:text-gray-300">Cômodos:</strong> {property.rooms}</p>
          <p><strong className="dark:text-gray-300">Ano:</strong> {property.year}</p>
        </div>
        <p className="mt-4 text-sm"><strong className="dark:text-gray-300">Detalhes:</strong> {property.details || 'N/A'}</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Vistorias</h3>
        {property.inspections.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhuma vistoria realizada.</p>
        ) : (
          property.inspections.map(insp => (
            <div key={insp.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold dark:text-white">Vistoria de {new Date(insp.date).toLocaleDateString()}</p>
                {/* FIX: Added optional chaining as 'photos' can be undefined. */}
                <p className="text-sm text-gray-500 dark:text-gray-400">{insp.photos?.length || 0} fotos</p>
              </div>
              <button onClick={() => onViewReport(insp.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Gerar Relatório</button>
            </div>
          ))
        )}
      </div>

      <div className="sticky bottom-0 pb-4 bg-gray-100 dark:bg-gray-900">
        <button onClick={onStartInspection} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
          <PlusIcon />
          Iniciar Nova Vistoria
        </button>
      </div>
    </div>
  );
};

export default PropertyDetail;
