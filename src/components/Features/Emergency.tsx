import { useState } from 'react';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { emergencyCategories, EmergencyCategory } from '../../data/emergencyTree';

export default function Emergency() {
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | null>(null);

  if (selectedCategory) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-3"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to emergencies</span>
          </button>
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{selectedCategory.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.title}</h2>
              <p className="text-gray-600">{selectedCategory.description}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">When to Seek Immediate Help</h3>
                <ul className="space-y-1">
                  {selectedCategory.whenToSeekHelp.map((item, idx) => (
                    <li key={idx} className="text-red-800 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">First Aid Steps</h3>
            <ol className="space-y-3">
              {selectedCategory.steps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-gray-900 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-bold text-yellow-900 mb-4 text-lg">Do NOT Do This</h3>
            <ul className="space-y-2">
              {selectedCategory.warnings.map((warning, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="text-yellow-600 flex-shrink-0 mt-1">⚠️</span>
                  <span className="text-yellow-900">{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Mode</h2>
        <p className="text-gray-600 text-sm mt-1">Offline first-aid guidance for common emergencies</p>
      </div>

      <div className="bg-red-50 border-b border-red-100 px-6 py-3">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            <strong>Emergency Notice:</strong> This information is for immediate first aid only.
            Always call for emergency services or visit nearest hospital for serious conditions.
          </p>
        </div>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-start space-x-4">
              <span className="text-4xl">{category.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
                <div className="mt-3 text-blue-600 text-sm font-medium">
                  View first aid steps →
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
