import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, ImageIcon } from 'lucide-react'

export default function ImageUpload({ label, icon, preview, onFile, onClear, accept = 'image/*', hint = '' }) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    setIsDragging(false)
    if (acceptedFiles.length > 0) onFile(acceptedFiles[0])
  }, [onFile])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  return (
    <div>
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
            transition-all duration-200 group
            ${isDragging
              ? 'border-gold bg-gold/10 scale-[1.01]'
              : 'border-warm/25 hover:border-gold hover:bg-gold/5'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200
              ${isDragging ? 'bg-gold/20' : 'bg-gold/8 group-hover:bg-gold/15'}
            `}>
              <span className="text-2xl">{icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-ink dark:text-cream">{label}</p>
              <p className="text-xs text-warm/70 mt-1">{hint || 'JPG, PNG, WEBP · Max 10MB'}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gold/80 font-medium">
              <Upload size={11} />
              <span>Drop or click to upload</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-52 object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-xl" />
          <button
            onClick={(e) => { e.stopPropagation(); onClear() }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ink/70 backdrop-blur-sm
                       flex items-center justify-center text-cream hover:bg-ink transition-all
                       opacity-0 group-hover:opacity-100 duration-200"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg
                          px-2.5 py-1 text-cream text-xs flex items-center gap-1.5">
            <ImageIcon size={10} />
            <span>Image ready</span>
          </div>
        </div>
      )}
    </div>
  )
}
