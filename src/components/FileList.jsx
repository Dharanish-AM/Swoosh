import React from "react";

export default function FileList({ files }) {
  const filesArray = files ? Array.from(files) : [];

  if (filesArray.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <p className="text-gray-500 text-sm">No files selected</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      {filesArray.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center justify-between cursor-pointer p-4 border-b border-gray-200 hover:bg-[#16c47e29] transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span> {index + 1}.</span>
            {file.type?.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-8 h-8 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;base64,...";
                }}
              />
            ) : (
              <div className="w-8 h-8 bg-gray-100 font-medium rounded flex items-center justify-center">
                <FileIcon extension={file.name.split(".").pop()} />
              </div>
            )}
            <span className="text-sm font-medium truncate" title={file.name}>
              {file.name}
            </span>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      ))}
    </div>
  );
}

function FileIcon({ extension }) {
  const icons = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    xls: "📊",
    xlsx: "📊",
    ppt: "📑",
    pptx: "📑",
    txt: "📄",
  };

  return <span>{icons[extension] || "📁"}</span>;
}
