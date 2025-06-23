import React, { memo } from "react";
import { useLocation } from "wouter";
import type { Pet, Reminder } from "@shared/schema";
import { Dog, Cat, Bird, Rabbit, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PetCardProps {
  pet: Pet;
  reminders: Reminder[];
  onDelete?: (pet: Pet) => void;
}

export default React.memo(function PetCard({ pet, reminders, onDelete }: PetCardProps) {
  const [, setLocation] = useLocation();
  
  const handleCardClick = () => {
    console.log('Navigating to pet profile:', `/pet/${pet.id}`);
    setLocation(`/pet/${pet.id}`);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "dog": return <Dog className="w-8 h-8 text-gray-600" />;
      case "cat": return <Cat className="w-8 h-8 text-gray-600" />;
      case "bird": return <Bird className="w-8 h-8 text-gray-600" />;
      case "rabbit": return <Rabbit className="w-8 h-8 text-gray-600" />;
      default: return <Heart className="w-8 h-8 text-gray-600" />;
    }
  };

  const overdueCount = reminders.filter(r => r.isOverdue).length;
  const upcomingCount = reminders.filter(r => !r.isOverdue && !r.isCompleted).length;
  const totalNotifications = overdueCount + upcomingCount;

  return (
    <div 
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow"
    >
      {/* Delete Button */}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(pet);
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}

      {/* Pet Image or Icon */}
      <div onClick={handleCardClick} className="cursor-pointer">
        {pet.imageUrl && pet.imageUrl.trim() !== '' ? (
          <img 
            src={pet.imageUrl} 
            alt={pet.name}
            className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-white shadow-sm"
            onError={(e) => {
              console.log('Image failed to load for pet:', pet.name);
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-16 h-16 rounded-full mx-auto mb-3 bg-gray-100 flex items-center justify-center ${pet.imageUrl && pet.imageUrl.trim() !== '' ? 'hidden' : ''}`}>
          {getCategoryIcon(pet.category)}
        </div>

        {/* Pet Info */}
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{pet.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{pet.breed}</p>
          
          {/* Notifications Badge */}
          {totalNotifications > 0 && (
            <div className="flex items-center justify-center space-x-1">
              {overdueCount > 0 && (
                <span className="status-badge overdue">
                  {overdueCount} overdue
                </span>
              )}
              {upcomingCount > 0 && (
                <span className="status-badge upcoming">
                  {upcomingCount} upcoming
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
