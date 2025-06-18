import React from "react";
import { Bell, QrCode, Download, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StandardHeaderProps {
  title: string;
  subtitle?: string;
  showNotificationBell?: boolean;
  notificationCount?: number;
  showQRScanner?: boolean;
  showDownload?: boolean;
  showLogout?: boolean;
  onNotificationClick?: () => void;
  onQRScannerClick?: () => void;
  onDownloadClick?: () => void;
  onLogoutClick?: () => void;
}

export default function StandardHeader({
  title,
  subtitle,
  showNotificationBell = false,
  notificationCount = 0,
  showQRScanner = false,
  showDownload = false,
  showLogout = false,
  onNotificationClick,
  onQRScannerClick,
  onDownloadClick,
  onLogoutClick
}: StandardHeaderProps) {
  return (
    <div className="bg-primary text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-sm">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {showQRScanner && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={onQRScannerClick}
            >
              <QrCode className="w-5 h-5" />
            </Button>
          )}
          {showDownload && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={onDownloadClick}
            >
              <Download className="w-5 h-5" />
            </Button>
          )}
          {showNotificationBell && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative p-2"
              onClick={onNotificationClick}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </div>
              )}
            </Button>
          )}
          {showLogout && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={onLogoutClick}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
