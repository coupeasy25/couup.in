"use client";

import { useCallback, useState, useMemo } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Check, Plus, Trash, Target, X } from "lucide-react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HostEmailVerification from "./HostEmailVerification";

enum STEPS {
  INTRO = 0,
  BASICS = 1,
  DETAILS = 2,
  ROOMS = 3,
  AMENITIES = 4,
  STANDOUTS = 5,
  SAFETY = 6,
  POLICIES = 7,
  PRICE = 8,
}

const AMENITIES_LIST = ["Wifi", "TV", "Kitchen", "Washing Machine", "Free Parking", "Paid Parking", "Air Conditioning"];
const STANDOUTS_LIST = ["Pool", "Hot tub", "Outdoor dining area", "Pool table", "Beach access"];
const SAFETY_LIST = ["Smoke alarm", "First aid kit", "Fire extinguisher"];

const CITIES = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Navsari", "Morbi", "Bharuch", "Vapi", "Porbandar", "Bhuj", "Gandhidham",
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Pali", "Sri Ganganagar", "Bharatpur", "Jaisalmer", "Mount Abu", "Pushkar"
].sort();

interface BecomeHostClientProps {
  currentUser?: any;
  initialData?: any;
}

const BecomeHostClient: React.FC<BecomeHostClientProps> = ({ currentUser, initialData }) => {
  const router = useRouter();

  const [step, setStep] = useState(STEPS.INTRO);
  const [isLoading, setIsLoading] = useState(false);
  const [imgInput, setImgInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      imageSrc: initialData?.imageSrc || [],
      propertyType: initialData?.propertyType || 'Hotel',
      fullAddress: initialData?.fullAddress || '',
      locationValue: initialData?.locationValue || '',
      peoplePerRoom: initialData?.peoplePerRoom || 1,
      bathroomType: initialData?.bathroomType || 'Private',
      amenities: initialData?.amenities || [],
      standoutAmenities: initialData?.standoutAmenities || [],
      safetyItems: initialData?.safetyItems || [],
      checkInTime: initialData?.checkInTime || '2:00 PM',
      checkOutTime: initialData?.checkOutTime || '11:00 AM',
      cancellationPolicy: initialData?.cancellationPolicy || 'Free cancellation before 48 hours',
      smokingAllowed: initialData?.smokingAllowed || false,
      petsAllowed: initialData?.petsAllowed || false,
      partyAllowed: initialData?.partyAllowed || false,
      rooms: initialData?.rooms || [],
      price: initialData?.price || 100,
    }
  });

  const propertyType = watch('propertyType');
  const bathroomType = watch('bathroomType');
  const imageSrc = watch('imageSrc') || [];
  const amenities = watch('amenities') || [];
  const standoutAmenities = watch('standoutAmenities') || [];
  const safetyItems = watch('safetyItems') || [];
  const smokingAllowed = watch('smokingAllowed');
  const petsAllowed = watch('petsAllowed');
  const partyAllowed = watch('partyAllowed');
  const rooms = watch('rooms') || [];

  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [roomImgInput, setRoomImgInput] = useState("");
  const [roomFacilityInput, setRoomFacilityInput] = useState("");
  const [roomInclusionInput, setRoomInclusionInput] = useState("");

  const [customAmenityInput, setCustomAmenityInput] = useState("");
  const [customStandoutInput, setCustomStandoutInput] = useState("");
  const [customSafetyInput, setCustomSafetyInput] = useState("");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const toggleArrayItem = (id: string, currentArray: string[], item: string) => {
    if (currentArray.includes(item)) {
      setCustomValue(id, currentArray.filter((i) => i !== item));
    } else {
      setCustomValue(id, [...currentArray, item]);
    }
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.BASICS) {
      if (imageSrc.length < 5 || imageSrc.length > 15) {
        toast.error("Please add between 5 and 15 photos.");
        return;
      }
    }
    if (step === STEPS.ROOMS) {
      if (rooms.length === 0) {
        toast.error("Please add at least one room type.");
        return;
      }
      if (editingRoom) {
        toast.error("Please save your room details first.");
        return;
      }
    }
    setStep((value) => value + 1);
  };

  const onSubmit = (data: FieldValues) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    if (initialData) {
      axios.patch(`/api/listings/${initialData.id}`, data)
      .then(() => {
        toast.success('Listing updated successfully!');
        router.push('/host/properties');
        router.refresh();
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || 'Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      axios.post('/api/listings', data)
      .then(() => {
        toast.success('Listing created successfully!');
        router.push('/');
        router.refresh();
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || 'Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return initialData ? 'Save Changes' : 'Create';
    }
    return 'Next';
  }, [step, initialData]);

  let leftContent;
  let rightContent = null;

  if (step === STEPS.INTRO) {
    leftContent = (
      <div className="flex flex-col justify-center h-full px-10 md:px-20 max-w-2xl">
        <h2 className="text-lg font-semibold text-neutral-600 mb-2">Step 1</h2>
        <h1 className="text-5xl font-semibold mb-6">Tell us about your place</h1>
        <p className="text-xl text-neutral-600 leading-relaxed font-light">
          In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.
        </p>
      </div>
    );
    rightContent = (
      <div className="flex items-center justify-center h-full w-full">
        <div className="relative w-full max-w-lg aspect-square">
          <Image src="/images/couup_resort_illustration.png" alt="Resort Illustration" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain mix-blend-multiply scale-110" />
        </div>
      </div>
    );
  }

  if (step === STEPS.BASICS) {
    leftContent = (
      <div className="flex flex-col justify-center min-h-[100%] py-12 px-10 md:px-20 max-w-2xl gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">The Basics</h2>
          <p className="text-xl text-gray-500 font-light">Give your place a name, description, and some photos.</p>
        </div>
        <div className="flex flex-col gap-4">
          <Input className="text-lg py-6" {...register("title", { required: true })} placeholder="Hotel/Resort Name" />
          <Input className="text-lg py-6" {...register("description", { required: true })} placeholder="Describe your place..." />
          
          <div className="mt-4">
            <Label className="text-lg font-semibold">Photos (Min 5, Max 15)</Label>
            <div className="flex gap-2 mt-2">
              <Input 
                className="py-6 text-lg"
                value={imgInput} 
                onChange={(e) => setImgInput(e.target.value)} 
                placeholder="Paste image URL here" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (imgInput && imageSrc.length < 15) {
                      setCustomValue('imageSrc', [...imageSrc, imgInput]);
                      setImgInput('');
                    }
                  }
                }}
              />
              <button 
                type="button"
                onClick={() => {
                  if (imgInput && imageSrc.length < 15) {
                    setCustomValue('imageSrc', [...imageSrc, imgInput]);
                    setImgInput('');
                  }
                }}
                className="bg-[#0f3d30] text-[#D4AF37] px-6 rounded-md hover:bg-[#0a2a21] transition font-semibold"
              >
                Add
              </button>
            </div>
            <p className="text-sm text-neutral-500 mt-2 font-medium">Added: {imageSrc.length}/15</p>
            <div className="flex flex-wrap gap-4 mt-4">
              {imageSrc.map((src: string, index: number) => (
                <div key={index} className="relative group w-24 h-24 rounded-lg overflow-hidden bg-neutral-100 border-[1px] border-neutral-200">
                  <img src={src} alt="Upload" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => {
                      const newImages = [...imageSrc];
                      newImages.splice(index, 1);
                      setCustomValue('imageSrc', newImages);
                    }}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash size={14} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.DETAILS) {
    leftContent = (
      <div className="flex flex-col justify-center min-h-[100%] py-12 px-10 md:px-20 max-w-2xl gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">Property Details</h2>
          <p className="text-xl text-gray-500 font-light">Tell us more about the property.</p>
        </div>
        
        <div className="flex flex-col gap-8">
          <div>
            <Label className="text-xl font-semibold">Is this a Hotel or Resort?</Label>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div 
                onClick={() => setCustomValue('propertyType', 'Hotel')}
                className={`p-6 border-2 rounded-xl cursor-pointer transition ${propertyType === 'Hotel' ? 'border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div className="font-semibold text-lg">Hotel</div>
              </div>
              <div 
                onClick={() => setCustomValue('propertyType', 'Resort')}
                className={`p-6 border-2 rounded-xl cursor-pointer transition ${propertyType === 'Resort' ? 'border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div className="font-semibold text-lg">Resort</div>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xl font-semibold">City</Label>
            <select 
              className="mt-4 flex h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              {...register("locationValue", { required: true })}
            >
              <option value="" disabled>Select your city</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xl font-semibold">Full Address</Label>
            <Input className="mt-4 text-lg py-6" {...register("fullAddress", { required: true })} placeholder="123 Main St, Local Area" />
          </div>

          <div>
            <Label className="text-xl font-semibold">How many people stay here in one room?</Label>
            <Input className="mt-4 text-lg py-6" type="number" min={1} {...register("peoplePerRoom", { required: true })} />
          </div>

          <div>
            <Label className="text-xl font-semibold">What kind of bathrooms are available to guests?</Label>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div 
                onClick={() => setCustomValue('bathroomType', 'Private')}
                className={`p-6 border-2 rounded-xl cursor-pointer transition ${bathroomType === 'Private' ? 'border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div className="font-semibold text-lg">Private and attached</div>
              </div>
              <div 
                onClick={() => setCustomValue('bathroomType', 'Shared')}
                className={`p-6 border-2 rounded-xl cursor-pointer transition ${bathroomType === 'Shared' ? 'border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div className="font-semibold text-lg">Shared</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (step === STEPS.ROOMS) {
    leftContent = (
      <div className="flex flex-col justify-center min-h-[100%] py-12 px-10 md:px-20 max-w-2xl gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">Rooms Available</h2>
          <p className="text-xl text-gray-500 font-light">Add the different types of rooms available at your property.</p>
        </div>

        {editingRoom ? (
          <div className="flex flex-col gap-4 border-[1px] border-neutral-200 p-6 rounded-xl">
            <h3 className="text-xl font-semibold">Room Details</h3>
            
            <div>
              <Label className="text-sm font-semibold">Room Name / Type</Label>
              <Input 
                value={editingRoom.type}
                onChange={(e) => setEditingRoom({...editingRoom, type: e.target.value})}
                placeholder="e.g. Deluxe Room"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-semibold">Price per night (₹)</Label>
                <Input 
                  type="number"
                  value={editingRoom.price}
                  onChange={(e) => setEditingRoom({...editingRoom, price: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Capacity (Guests)</Label>
                <Input 
                  type="number"
                  value={editingRoom.capacity}
                  onChange={(e) => setEditingRoom({...editingRoom, capacity: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Number of Rooms</Label>
                <Input 
                  type="number"
                  min={1}
                  value={editingRoom.count ?? 1}
                  onChange={(e) => setEditingRoom({...editingRoom, count: Number(e.target.value)})}
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <Label className="text-sm font-semibold">Room Photos (1-4 images)</Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  value={roomImgInput}
                  onChange={(e) => setRoomImgInput(e.target.value)}
                  placeholder="Paste image URL"
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (roomImgInput && editingRoom.images.length < 4) {
                      setEditingRoom({ ...editingRoom, images: [...editingRoom.images, roomImgInput] });
                      setRoomImgInput("");
                    }
                  }}
                  className="bg-[#0f3d30] text-[#D4AF37] px-4 py-2 rounded-md font-semibold text-sm hover:bg-[#0a2a21] transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editingRoom.images.map((src: string, index: number) => (
                  <div key={index} className="relative w-16 h-16 bg-neutral-100 rounded-md overflow-hidden group">
                    <img src={src} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        const newImgs = [...editingRoom.images];
                        newImgs.splice(index, 1);
                        setEditingRoom({...editingRoom, images: newImgs});
                      }}
                      className="absolute top-1 right-1 bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash size={12} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <Label className="text-sm font-semibold">Facilities (e.g. AC, TV)</Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  value={roomFacilityInput}
                  onChange={(e) => setRoomFacilityInput(e.target.value)}
                  placeholder="Facility"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (roomFacilityInput) {
                        setEditingRoom({ ...editingRoom, facilities: [...editingRoom.facilities, roomFacilityInput] });
                        setRoomFacilityInput("");
                      }
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (roomFacilityInput) {
                      setEditingRoom({ ...editingRoom, facilities: [...editingRoom.facilities, roomFacilityInput] });
                      setRoomFacilityInput("");
                    }
                  }}
                  className="bg-[#0f3d30] text-[#D4AF37] px-4 py-2 rounded-md font-semibold text-sm hover:bg-[#0a2a21] transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editingRoom.facilities.map((fac: string, index: number) => (
                  <div key={index} className="bg-neutral-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {fac}
                    <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => {
                      const newFac = [...editingRoom.facilities];
                      newFac.splice(index, 1);
                      setEditingRoom({...editingRoom, facilities: newFac});
                    }}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <Label className="text-sm font-semibold">Inclusions (e.g. Free Breakfast)</Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  value={roomInclusionInput}
                  onChange={(e) => setRoomInclusionInput(e.target.value)}
                  placeholder="Inclusion"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (roomInclusionInput) {
                        setEditingRoom({ ...editingRoom, inclusions: [...editingRoom.inclusions, roomInclusionInput] });
                        setRoomInclusionInput("");
                      }
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (roomInclusionInput) {
                      setEditingRoom({ ...editingRoom, inclusions: [...editingRoom.inclusions, roomInclusionInput] });
                      setRoomInclusionInput("");
                    }
                  }}
                  className="bg-[#0f3d30] text-[#D4AF37] px-4 py-2 rounded-md font-semibold text-sm hover:bg-[#0a2a21] transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editingRoom.inclusions.map((inc: string, index: number) => (
                  <div key={index} className="bg-neutral-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {inc}
                    <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => {
                      const newInc = [...editingRoom.inclusions];
                      newInc.splice(index, 1);
                      setEditingRoom({...editingRoom, inclusions: newInc});
                    }}/>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button 
                type="button"
                onClick={() => setEditingRoom(null)}
                className="px-4 py-2 border-[1px] border-neutral-300 rounded-lg font-semibold hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (editingRoom.images.length === 0 || editingRoom.images.length > 4) {
                    toast.error("Please add 1 to 4 images for this room.");
                    return;
                  }
                  if (!editingRoom.type) {
                    toast.error("Please add a room type/name.");
                    return;
                  }
                  const existingIndex = rooms.findIndex((r: any) => r.id === editingRoom.id);
                  const updatedRooms = [...rooms];
                  if (existingIndex >= 0) {
                    updatedRooms[existingIndex] = editingRoom;
                  } else {
                    updatedRooms.push(editingRoom);
                  }
                  setCustomValue('rooms', updatedRooms);
                  setEditingRoom(null);
                }}
                className="px-4 py-2 bg-[#0f3d30] text-[#D4AF37] rounded-lg font-semibold hover:bg-[#0a2a21] transition"
              >
                Save Room
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rooms.map((room: any) => (
              <div key={room.id} className="flex justify-between items-center p-4 border-[1px] border-neutral-200 rounded-xl">
                <div>
                  <div className="font-semibold text-lg">{room.type}</div>
                  <div className="text-neutral-500 text-sm">₹{room.price} / night · {room.capacity} Guests</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setEditingRoom(room)}
                    className="px-4 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition font-semibold text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCustomValue('rooms', rooms.filter((r: any) => r.id !== room.id))}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              type="button"
              onClick={() => setEditingRoom({
                id: Math.random().toString(36).substring(7),
                type: 'New Room Type',
                images: [],
                price: 1000,
                capacity: 2,
                count: 1,
                facilities: [],
                inclusions: []
              })}
              className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-black hover:bg-neutral-50 transition"
            >
              <Plus size={24} />
              <span className="font-semibold text-lg">Add another room type</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (step === STEPS.AMENITIES) {
    leftContent = (
      <div className="flex flex-col justify-center min-h-[100%] py-12 px-10 md:px-20 max-w-2xl gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">Tell guests what your place has to offer</h2>
          <p className="text-xl text-gray-500 font-light">Select all amenities available.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {AMENITIES_LIST.map((item) => {
            const isSelected = amenities.includes(item);
            return (
              <div 
                key={item}
                onClick={() => toggleArrayItem('amenities', amenities, item)}
                className={`p-6 border-2 rounded-xl cursor-pointer transition flex justify-between items-center ${isSelected ? 'border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <span className="font-semibold text-lg">{item}</span>
                {isSelected && <Check size={24} className="text-[#0f3d30]" />}
              </div>
            )
          })}
          {amenities.filter((a: string) => !AMENITIES_LIST.includes(a)).map((item: string) => (
            <div 
              key={item}
              onClick={() => toggleArrayItem('amenities', amenities, item)}
              className="p-6 border-2 rounded-xl cursor-pointer transition flex justify-between items-center border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]"
            >
              <span className="font-semibold text-lg">{item}</span>
              <Check size={24} className="text-[#0f3d30]" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input 
            value={customAmenityInput} 
            onChange={(e) => setCustomAmenityInput(e.target.value)} 
            placeholder="Add another amenity..." 
            className="text-lg py-6"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (customAmenityInput && !amenities.includes(customAmenityInput)) {
                  setCustomValue('amenities', [...amenities, customAmenityInput]);
                  setCustomAmenityInput('');
                }
              }
            }}
          />
          <button 
            type="button"
            onClick={() => {
              if (customAmenityInput && !amenities.includes(customAmenityInput)) {
                setCustomValue('amenities', [...amenities, customAmenityInput]);
                setCustomAmenityInput('');
              }
            }}
            className="bg-[#0f3d30] text-[#D4AF37] px-8 rounded-md hover:bg-[#0a2a21] transition font-semibold"
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  if (step === STEPS.STANDOUTS) {
    leftContent = (
      <div className="flex flex-col justify-center min-h-[100%] py-12 px-10 md:px-20 max-w-2xl gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">Do you have any standout amenities?</h2>
          <p className="text-xl text-gray-500 font-light">Guests love these special features.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {STANDOUTS_LIST.map((item) => {
            const isSelected = standoutAmenities.includes(item);
            return (
              <div 
                key={item}
                onClick={() => toggleArrayItem('standoutAmenities', standoutAmenities, item)}
                className={`p-6 border-2 rounded-xl cursor-pointer transition flex justify-between items-center ${isSelected ? 'border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <span className="font-semibold text-lg">{item}</span>
                {isSelected && <Check size={24} className="text-[#0f3d30]" />}
              </div>
            )
          })}
          {standoutAmenities.filter((a: string) => !STANDOUTS_LIST.includes(a)).map((item: string) => (
            <div 
              key={item}
              onClick={() => toggleArrayItem('standoutAmenities', standoutAmenities, item)}
              className="p-6 border-2 rounded-xl cursor-pointer transition flex justify-between items-center border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]"
            >
              <span className="font-semibold text-lg">{item}</span>
              <Check size={24} className="text-[#0f3d30]" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input 
            value={customStandoutInput} 
            onChange={(e) => setCustomStandoutInput(e.target.value)} 
            placeholder="Add another standout amenity..." 
            className="text-lg py-6"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (customStandoutInput && !standoutAmenities.includes(customStandoutInput)) {
                  setCustomValue('standoutAmenities', [...standoutAmenities, customStandoutInput]);
                  setCustomStandoutInput('');
                }
              }
            }}
          />
          <button 
            type="button"
            onClick={() => {
              if (customStandoutInput && !standoutAmenities.includes(customStandoutInput)) {
                setCustomValue('standoutAmenities', [...standoutAmenities, customStandoutInput]);
                setCustomStandoutInput('');
              }
            }}
            className="bg-[#0f3d30] text-[#D4AF37] px-8 rounded-md hover:bg-[#0a2a21] transition font-semibold"
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  if (step === STEPS.SAFETY) {
    leftContent = (
      <div className="flex flex-col justify-center min-h-[100%] py-12 px-10 md:px-20 max-w-2xl gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">Do you have any of these safety items?</h2>
          <p className="text-xl text-gray-500 font-light">Help keep your guests safe.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {SAFETY_LIST.map((item) => {
            const isSelected = safetyItems.includes(item);
            return (
              <div 
                key={item}
                onClick={() => toggleArrayItem('safetyItems', safetyItems, item)}
                className={`p-6 border-2 rounded-xl cursor-pointer transition flex justify-between items-center ${isSelected ? 'border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <span className="font-semibold text-lg">{item}</span>
                {isSelected && <Check size={24} className="text-[#0f3d30]" />}
              </div>
            )
          })}
          {safetyItems.filter((a: string) => !SAFETY_LIST.includes(a)).map((item: string) => (
            <div 
              key={item}
              onClick={() => toggleArrayItem('safetyItems', safetyItems, item)}
              className="p-6 border-2 rounded-xl cursor-pointer transition flex justify-between items-center border-[#D4AF37] bg-[#0f3d30]/5 shadow-[0_0_0_1px_#D4AF37]"
            >
              <span className="font-semibold text-lg">{item}</span>
              <Check size={24} className="text-[#0f3d30]" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input 
            value={customSafetyInput} 
            onChange={(e) => setCustomSafetyInput(e.target.value)} 
            placeholder="Add another safety item..." 
            className="text-lg py-6"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (customSafetyInput && !safetyItems.includes(customSafetyInput)) {
                  setCustomValue('safetyItems', [...safetyItems, customSafetyInput]);
                  setCustomSafetyInput('');
                }
              }
            }}
          />
          <button 
            type="button"
            onClick={() => {
              if (customSafetyInput && !safetyItems.includes(customSafetyInput)) {
                setCustomValue('safetyItems', [...safetyItems, customSafetyInput]);
                setCustomSafetyInput('');
              }
            }}
            className="bg-[#0f3d30] text-[#D4AF37] px-8 rounded-md hover:bg-[#0a2a21] transition font-semibold"
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  if (step === STEPS.POLICIES) {
    leftContent = (
      <div className="flex flex-col justify-center min-h-[100%] py-12 px-10 md:px-20 max-w-2xl gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">House Rules & Policies</h2>
          <p className="text-xl text-gray-500 font-light">Set your timing, cancellation rules, and allowed activities.</p>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-lg font-semibold">Check-in Time</Label>
              <Input className="mt-2 text-lg py-6" {...register("checkInTime", { required: true })} placeholder="e.g. 2:00 PM" />
            </div>
            <div>
              <Label className="text-lg font-semibold">Check-out Time</Label>
              <Input className="mt-2 text-lg py-6" {...register("checkOutTime", { required: true })} placeholder="e.g. 11:00 AM" />
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold">Cancellation Policy</Label>
            <Input className="mt-2 text-lg py-6" {...register("cancellationPolicy", { required: true })} placeholder="e.g. Free cancellation before 48 hours" />
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <Label className="text-lg font-semibold">Allowed Activities</Label>
            
            <div className="flex items-center justify-between p-4 border-[1px] border-neutral-200 rounded-lg">
              <span className="font-medium text-lg">Smoking Allowed</span>
              <button 
                type="button"
                onClick={() => setCustomValue('smokingAllowed', !smokingAllowed)}
                className={`w-14 h-8 rounded-full flex items-center transition px-1 ${smokingAllowed ? 'bg-[#0f3d30] justify-end' : 'bg-neutral-300 justify-start'}`}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border-[1px] border-neutral-200 rounded-lg">
              <span className="font-medium text-lg">Pets Allowed</span>
              <button 
                type="button"
                onClick={() => setCustomValue('petsAllowed', !petsAllowed)}
                className={`w-14 h-8 rounded-full flex items-center transition px-1 ${petsAllowed ? 'bg-[#0f3d30] justify-end' : 'bg-neutral-300 justify-start'}`}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border-[1px] border-neutral-200 rounded-lg">
              <span className="font-medium text-lg">Parties Allowed</span>
              <button 
                type="button"
                onClick={() => setCustomValue('partyAllowed', !partyAllowed)}
                className={`w-14 h-8 rounded-full flex items-center transition px-1 ${partyAllowed ? 'bg-[#0f3d30] justify-end' : 'bg-neutral-300 justify-start'}`}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    leftContent = (
      <div className="flex flex-col justify-center h-full px-10 md:px-20 max-w-2xl gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">Now, set your price</h2>
          <p className="text-xl text-gray-500 font-light">How much do you charge per night?</p>
        </div>
        <Input className="text-2xl py-8 font-semibold" type="number" {...register("price", { required: true, min: 1 })} placeholder="Price per night (₹)" />
      </div>
    );
  }

  // Calculate progress percentage
  const progress = ((step + 1) / (Object.keys(STEPS).length / 2)) * 100;

  if (currentUser && !currentUser.emailVerified) {
    return <HostEmailVerification currentUser={currentUser} />;
  }

  return (
    <div className="fixed inset-0 bg-white z-[999] flex flex-col">
      {/* Top Navbar */}
      <div className="h-24 w-full flex items-center justify-between px-10 bg-[#0f3d30] shadow-md border-b-[1px] border-[#0a2a21]">
        <div 
          onClick={() => router.push('/')}
          className="flex flex-col cursor-pointer transition text-[#D4AF37]"
        >
          <div className="font-serif text-3xl tracking-[0.2em] font-medium uppercase drop-shadow-sm">Couup</div>
          <div className="text-[9px] tracking-[0.3em] font-light uppercase text-center mt-1 text-[#D4AF37]/80">Hotels & Resorts</div>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 border-[1px] border-[#D4AF37]/50 text-[#D4AF37] rounded-full font-semibold text-sm hover:bg-[#D4AF37]/10 transition">
            Questions?
          </button>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 border-[1px] border-[#D4AF37]/50 text-[#D4AF37] rounded-full font-semibold text-sm hover:bg-[#D4AF37]/10 transition"
          >
            Save & exit
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Area */}
        <div className={`h-full w-full ${rightContent ? 'md:w-1/2' : 'flex justify-center items-center'} overflow-y-auto pb-32`}>
          {leftContent}
        </div>
        
        {/* Right Illustration Area */}
        {rightContent && (
          <div className="hidden md:flex h-full w-1/2 justify-center items-center bg-white">
            {rightContent}
          </div>
        )}
      </div>

      {/* Bottom Fixed Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#0f3d30] border-t-[1px] border-[#0a2a21] z-[1000] flex flex-col justify-between">
        {/* Progress bar */}
        <div className="w-full h-2 bg-[#0a2a21]">
          <div 
            className="h-full bg-[#D4AF37] transition-all duration-300 ease-in-out shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Buttons */}
        <div className="flex-1 flex items-center justify-between px-10">
          <button
            onClick={step === STEPS.INTRO ? undefined : onBack}
            className={`font-semibold text-lg text-white/80 hover:text-white transition ${step === STEPS.INTRO ? 'opacity-0 cursor-default' : 'hover:bg-white/10 px-4 py-2 rounded-lg'}`}
          >
            Back
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition shadow-md ${isLoading ? 'bg-neutral-500 cursor-not-allowed text-white' : 'bg-[#D4AF37] text-[#0f3d30] hover:bg-[#c4a133]'}`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeHostClient;
