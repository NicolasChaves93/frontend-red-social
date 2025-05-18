import { useState, useRef } from "react";
import { usePosts } from "../hooks/usePosts";
import Button from "../../../shared/components/Button";
import { useToast } from "../../../shared/hooks/useToast";

interface CreatePostFormProps {
  onPostCreated?: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { createPost, loading } = usePosts();
  const { showToast } = useToast();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      return showToast("Escribe algo o añade una imagen", "error");
    }
    
    try {
      await createPost(content, image || undefined);
      setContent("");
      removeImage();
      showToast("¡Publicación creada con éxito!", "success");
      
      // Invocar callback para recargar posts
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      showToast("Error al crear la publicación", "error");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      <div className="mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué estás pensando?"
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        ></textarea>
      </div>
      
      {imagePreview && (
        <div className="mb-3 relative">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-auto max-h-60 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={imageInputRef}
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Añadir imagen
          </button>
        </div>
        
        <Button
          type="submit"
          disabled={loading || (!content.trim() && !image)}
          isLoading={loading}
        >
          Publicar
        </Button>
      </div>
    </form>
  );
}
