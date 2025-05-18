import { useState } from "react";
import type { User } from "../../../shared/types";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

interface EditProfileFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function EditProfileForm({ 
  user, 
  onSubmit, 
  onCancel,
  isLoading 
}: EditProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.profileImage || null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      
      // Preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const updatedData: Partial<User> = {
      name,
      bio: bio.trim() ? bio : undefined,
    };
    
    if (profileImage) {
      // En una implementación real, aquí se manejaría la subida de la imagen
      // y se asignaría la URL resultante a updatedData.profileImage
    }
    
    onSubmit(updatedData);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
      <h2 className="text-2xl font-bold mb-6">Editar perfil</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-2">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Vista previa" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-4xl font-semibold">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profile-image"
          />
          <label 
            htmlFor="profile-image"
            className="cursor-pointer text-blue-600 hover:underline"
          >
            Cambiar foto de perfil
          </label>
        </div>
        
        <Input
          label="Nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 min-h-[100px]"
            placeholder="Cuéntanos sobre ti..."
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            variant="secondary" 
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
