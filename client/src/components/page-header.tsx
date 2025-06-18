import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Bell, QrCode, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  showNotificationBell?: boolean;
  notificationCount?: number;
  showQRScanner?: boolean;
  showSettings?: boolean;
  onNotificationClick?: () => void;
  onQRScannerClick?: () => void;
  onSettingsClick?: () => void;
}

export default function PageHeader({
  title,
  showNotificationBell = false,
  notificationCount = 0,
  showQRScanner = false,
  showSettings = false,
  onNotificationClick,
  onQRScannerClick,
  onSettingsClick
}: PageHeaderProps) {
  return (
    <div className="bg-primary text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {showNotificationBell && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative"
              onClick={onNotificationClick}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          )}
          {showQRScanner && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={onQRScannerClick}
            >
              <QrCode className="w-5 h-5" />
            </Button>
          )}
          {showSettings && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={onSettingsClick}
            >
              <Settings className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}