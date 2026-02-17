import { useState } from 'react';
import { Upload, Loader2, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type AnalysisResult = {
  condition: string;
  severity: 'Mild' | 'Moderate' | 'Urgent';
  careSteps: string[];
  disclaimer: string;
};

export default function SkinCheck() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/skin-analysis`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
            userId: user?.id
          })
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const data = await response.json();
        setResult(data);
      };
      reader.readAsDataURL(image);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900">Skin Condition Check</h2>
        <p className="text-gray-600 text-sm mt-1">Upload an image for AI-powered triage</p>
      </div>

      <div className="bg-yellow-50 border-b border-yellow-100 px-6 py-3">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            <strong>Non-Diagnostic Tool:</strong> This analysis is for informational purposes only
            and is NOT a medical diagnosis. Please consult a healthcare professional for proper evaluation.
          </p>
        </div>
      </div>

      <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />

          {!preview ? (
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-900 font-medium mb-1">Upload skin condition image</p>
              <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
            </label>
          ) : (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-contain rounded-lg"
              />
              <div className="flex space-x-3">
                <label
                  htmlFor="image-upload"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Change Image
                </label>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>Analyze Image</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Possible Condition</h3>
                  <p className="text-gray-700">{result.condition}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(result.severity)}`}>
                  {result.severity}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Immediate Care Steps</h4>
                <ol className="space-y-2">
                  {result.careSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{result.disclaimer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
