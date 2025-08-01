import { useState, useRef } from "react";
import { ChatMessage, Language } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Camera,
  Image as ImageIcon,
  Clock,
  Check,
  CheckCheck,
  X,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentUserId: string;
  otherUserName: string;
  onSendMessage: (
    message: string,
    type?: "text" | "image",
    imageUrl?: string,
  ) => void;
  language: Language;
  className?: string;
}

export const ChatInterface = ({
  messages,
  currentUserId,
  otherUserName,
  onSendMessage,
  language,
  className,
}: ChatInterfaceProps) => {
  const { t } = useTranslation(language);
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendText = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage("");
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For demo purposes, we'll create a blob URL
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  const handleSendImage = () => {
    if (!selectedImage) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      onSendMessage("📷 Image", "image", selectedImage);
      setSelectedImage(null);
      setIsUploading(false);
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString(
        language === "hi" ? "hi-IN" : "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    } catch {
      return timestamp;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-white rounded-lg", className)}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-blue-50 to-green-50">
        <Avatar>
          <AvatarFallback className="bg-blue-100 text-blue-800">
            {otherUserName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">{otherUserName}</h3>
          <p className="text-sm text-gray-500">Farmer • Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">Start your conversation</p>
            <p className="text-sm text-gray-500">
              Send a message to connect with {otherUserName}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.senderId === currentUserId
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}
                >
                  {message.messageType === "image" && message.imageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={message.imageUrl}
                        alt="Shared image"
                        className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(message.imageUrl, "_blank")}
                      />
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1 h-auto ${
                            message.senderId === currentUserId
                              ? "text-blue-100 hover:text-white"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                          onClick={() =>
                            window.open(message.imageUrl, "_blank")
                          }
                        >
                          <Download className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.message}
                    </p>
                  )}

                  <div
                    className={`flex items-center justify-end gap-1 mt-2 text-xs ${
                      message.senderId === currentUserId
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(message.timestamp)}</span>
                    {message.senderId === currentUserId && (
                      <div className="ml-1">
                        {message.isRead ? (
                          <CheckCheck className="h-3 w-3 text-blue-200" />
                        ) : (
                          <Check className="h-3 w-3 text-blue-200" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Image Preview */}
      {selectedImage && (
        <div className="p-4 border-t bg-gray-50">
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white rounded-full hover:bg-red-600"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button
              onClick={handleSendImage}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Image
                </div>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedImage(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              placeholder={t("type.message")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="rounded-xl border-2 border-gray-200 focus:border-blue-500 resize-none"
              disabled={!!selectedImage || isUploading}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-xl border-2 border-gray-200 hover:border-gray-300"
          >
            <Camera className="h-5 w-5 text-gray-600" />
          </Button>

          <Button
            onClick={handleSendText}
            disabled={!newMessage.trim() || !!selectedImage || isUploading}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Click camera to share photos
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
