import React from 'react';
import { Property, Inspection } from '../types';
import { DownloadIcon, MapPinIcon, SpinnerIcon } from './Icons';

interface ReportViewProps {
  property: Property;
  inspection: Inspection;
  onGeneratePdf: () => void;
  isGeneratingPdf: boolean;
}

const ReportView: React.FC<ReportViewProps> = ({ property, inspection, onGeneratePdf, isGeneratingPdf }) => {
  return (
    <div className="p-4 space-y-6">
      {/* Property Details Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Relatório de Vistoria</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Data da Vistoria: {new Date(inspection.date).toLocaleDateString()}
        </p>
        <div className="mt-4 border-t dark:border-gray-700 pt-4">
          <h3 className="font-semibold dark:text-gray-200">{property.address}</h3>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span><strong>Tipo:</strong> {property.type}</span>
            <span><strong>Área:</strong> {property.area} m²</span>
            <span><strong>Cômodos:</strong> {property.rooms}</span>
            <span><strong>Ano:</strong> {property.year}</span>
          </div>
           <p className="mt-2 text-sm text-gray-600 dark:text-gray-300"><strong>Detalhes:</strong> {property.details || 'N/A'}</p>
        </div>
      </div>
      
      {/* Photos Section */}
      <div className="space-y-4">
        {/* FIX: Added optional chaining as 'photos' can be undefined. */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Fotos Registradas ({inspection.photos?.length || 0})</h3>
        {inspection.photos?.map((photo) => (
          <div key={photo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <img src={photo.dataUrl} alt={photo.name || 'Foto da vistoria'} className="w-full h-auto max-h-96 object-contain bg-gray-200 dark:bg-gray-700" />
            <div className="p-4">
              <h4 className="font-bold text-lg dark:text-white">{photo.name || 'Foto sem nome'}</h4>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{photo.comment || 'Sem comentários.'}</p>
              <div className="mt-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-2">
                <span>{new Date(photo.timestamp).toLocaleString()}</span>
                <span className="flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3"/>
                    {photo.location ? `${photo.location.lat.toFixed(4)}, ${photo.location.lng.toFixed(4)}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="sticky bottom-0 pb-4 bg-gray-100 dark:bg-gray-900">
        <button
          onClick={onGeneratePdf}
          disabled={isGeneratingPdf}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-wait"
        >
          {isGeneratingPdf ? (
            <>
              <SpinnerIcon />
              Gerando PDF...
            </>
          ) : (
            <>
              <DownloadIcon />
              Baixar Relatório em PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportView;
