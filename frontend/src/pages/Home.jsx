import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SEO from '../components/SEO';
import AdBanner from '../components/AdBanner';

const Home = () => {
  const [url, setUrl] = useState("");
  const [customWord, setCustomWord] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return toast.error("Enter a valid URL");
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/shorten", { 
        url,
        customWord: customWord.trim() || undefined
      });
      setShortUrl(data.shortUrl);
      setIsExisting(data.isExisting);
      toast.success(
        data.updated 
          ? "URL updated with custom word!"
          : data.isExisting 
            ? "URL was already shortened before!" 
            : "URL shortened successfully!"
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Error creating short URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
        {/* Horizontal Ad for Mobile */}
        <div className="lg:hidden w-full max-w-2xl mx-auto mb-12">
          <AdBanner type="horizontal" />
        </div>

        {/* Main Content with Vertical Ads */}
        <div className="flex justify-center items-start gap-12 max-w-7xl mx-auto">
          {/* Left Ad - Hidden on Mobile */}
          <div className="hidden lg:block sticky top-12">
            <AdBanner type="vertical" />
          </div>

          {/* Main Content */}
          <div className="w-full max-w-2xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">URL Shortener</h1>
              <p className="text-lg text-gray-600">Make your long URLs short and sweet</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Long URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Path (optional)</label>
                  <input
                    type="text"
                    placeholder="my-custom-url"
                    value={customWord}
                    onChange={(e) => setCustomWord(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <button
                  disabled={loading}
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Shortening...' : 'Shorten URL'}
                </button>
              </div>
            </form>

            {shortUrl && (
              <div className="mt-8 bg-white p-8 rounded-xl shadow-md animate-fade-in">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {isExisting ? "Existing shortened URL found:" : "Your shortened URL:"}
                </p>
                {isExisting && (
                  <p className="text-xs text-gray-500 mb-2">
                    This URL was previously shortened
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shortUrl}
                    className="flex-1 p-2 border rounded bg-gray-50"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            <ToastContainer position="bottom-center" />
          </div>

          {/* Right Ad - Hidden on Mobile */}
          <div className="hidden lg:block sticky top-12">
            <AdBanner type="vertical" />
          </div>
        </div>

        {/* Bottom Horizontal Ad for Mobile */}
        <div className="lg:hidden w-full max-w-2xl mx-auto mt-12">
          <AdBanner type="horizontal" />
        </div>
      </div>
    </>
  );
};

export default Home;
