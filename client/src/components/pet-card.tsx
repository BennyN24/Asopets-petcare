import { memo } from "react";
import { useLocation } from "wouter";
import type { Pet, Reminder } from "@shared/schema";
import { Dog, Cat, Bird, Rabbit, Heart } from "lucide-react";

interface PetCardProps {
  pet: Pet;
  reminders: Reminder[];
}

export default memo(function PetCard({ pet, reminders }: PetCardProps) {
  const [, setLocation] = useLocation();
  
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
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setLocation(`/pet/${pet.id}`)}
    >
      {/* Pet Image or Icon */}
      {pet.imageUrl ? (
        <img 
          src={pet.imageUrl} 
          alt={pet.name}
          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gray-100 flex items-center justify-center">
          {getCategoryIcon(pet.category)}
        </div>
      )}
      
      <h3 className="text-center font-semibold text-gray-900">{pet.name}</h3>
      <p className="text-center text-xs text-gray-500 mb-2">
        {pet.breed || pet.category.charAt(0).toUpperCase() + pet.category.slice(1)}
      </p>
      
      {/* Notification Badge */}
      {totalNotifications > 0 && (
        <div className={`notification-badge ${overdueCount > 0 ? 'danger' : 'warning'}`}>
          {totalNotifications}
        </div>
      )}
    </div>
  );
});
