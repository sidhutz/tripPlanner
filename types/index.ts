export type Destination = {
  id: string;
  name: string;
  slug: string;
  description: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type PlaceCategory =
  | 'Temples'
  | 'Ghats'
  | 'Spiritual'
  | 'Historical'
  | 'Cultural'
  | 'Food'
  | 'Shopping'
  | 'Photography'
  | 'Family'
  | 'Nearby Attractions';

export type Place = {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  description: string;
  category: PlaceCategory;
  location: string;
  latitude: number | null;
  longitude: number | null;
  recommended_duration: string;
  best_time: string;
  entry_fee: string | null;
  image_url: string;
  maps_url: string;
  travel_tips: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type HotelType =
  | 'Hostel'
  | 'Guest House'
  | 'Homestay'
  | 'Budget Hotel'
  | 'Mid-range Hotel'
  | 'Luxury Hotel';

export type Hotel = {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  hotel_type: HotelType;
  price_min: number;
  price_max: number;
  currency: string;
  rating: number;
  amenities: string[];
  image_url: string;
  maps_url: string;
  booking_url: string | null;
  active: boolean;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Traveller = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  created_at: string;
  updated_at: string;
};

export type TripStatus =
  | 'new'
  | 'draft'
  | 'planned'
  | 'generated'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type Trip = {
  id: string;
  traveller_id: string;
  arrival_date: string;
  departure_date: string;
  number_of_days: number;
  adults: number;
  children: number;
  total_travellers: number;
  budget: number | null;
  currency: string;
  accommodation_preference: string;
  transport_preference: string;
  additional_requirements: string | null;
  status: TripStatus;
  created_at: string;
  updated_at: string;
};

export type Preferences = {
  id: string;
  trip_id: string;
  temples: boolean;
  ghats: boolean;
  ganga_aarti: boolean;
  spirituality: boolean;
  history: boolean;
  culture: boolean;
  food: boolean;
  shopping: boolean;
  photography: boolean;
  family: boolean;
  nightlife: boolean;
  sarnath: boolean;
  nearby_destinations: boolean;
};

export type ItineraryDay = {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  activities: {
    place: string;
    duration: string;
    travel_suggestion?: string;
    food_suggestion?: string;
  }[];
};

export type ItineraryJSON = {
  trip_summary: string;
  days: ItineraryDay[];
  hotel_recommendations: string[];
  travel_tips: string[];
};

export type Itinerary = {
  id: string;
  trip_id: string;
  summary: string;
  itinerary_json: ItineraryJSON;
  estimated_hotel_cost: number;
  estimated_food_cost: number;
  estimated_transport_cost: number;
  estimated_activity_cost: number;
  estimated_total_cost: number;
  currency: string;
  ai_model: string;
  created_at: string;
  updated_at: string;
};

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Follow-up'
  | 'Qualified'
  | 'Confirmed'
  | 'Completed'
  | 'Lost';

export type LeadPriority = 'Low' | 'Medium' | 'High';

export type Lead = {
  id: string;
  traveller_id: string;
  trip_id: string | null;
  lead_source: string;
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to: string | null;
  notes: string | null;
  contacted_at: string | null;
  converted_at: string | null;
  created_at: string;
  updated_at: string;
};
