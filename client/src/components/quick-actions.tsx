import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Calendar, MapPin } from "lucide-react";
import { useLocation } from "wouter";

interface QuickActionsProps {
  onFindClinics: () => void;
}

export default function QuickActions({ onFindClinics }: QuickActionsProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-white rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 text-lg">Quick Actions</h3>
      
      <div className="space-y-3">
        {/* View Schedule */}
        <button 
          onClick={() => setLocation("/schedule")}
          className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mr-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">View Schedule</h4>
            <p className="text-sm text-gray-600">Check upcoming reminders</p>
          </div>
        </button>

        {/* Find Vet Clinics */}
        <button 
          onClick={onFindClinics}
          className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mr-4">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">Find Vet Clinics</h4>
            <p className="text-sm text-gray-600">Find vet clinics near you</p>
          </div>
        </button>
      </div>
    </div>
  );
}