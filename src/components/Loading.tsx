import { Leaf } from "lucide-react";

export const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 w-16 h-16 bg-green-600 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Leaf className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-green-800 mb-2">
          SabziVerse
        </h2>
        <p className="text-green-600">Loading your marketplace...</p>
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
