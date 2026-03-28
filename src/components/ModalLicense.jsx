import React from "react";
import { ReactImageMagnifier } from "react-image-magnify-lib";
import { CaptionsOff } from "lucide-react";

export default function ModalLicense({ licenseFront, licenseBack, onClose }) {
  return (
    <dialog id="licenseModal" className="modal">
      <div className="modal-box relative">
        <div className="mb-2">
          <h2 className="text-lg font-bold">Driver's License</h2>
          <p className="text-gray-500 text-sm">Hover on the image to magnify</p>
        </div>

        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        {licenseFront ? (
          <div className="space-y-4 overflow-hidden p-2 flex flex-col items-center">
            <ReactImageMagnifier
              smallImageSrc={licenseFront}
              largeImageSrc={licenseFront}
              magnifierHeight={200}
              magnifierWidth={200}
              zoomLevel={3}
              alt="Driver License Front"
            />
            {licenseBack && (
              <ReactImageMagnifier
                smallImageSrc={licenseBack}
                largeImageSrc={licenseBack}
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={3}
                alt="Driver License Back"
              />
            )}
          </div>
        ) : (
          <div className="p-4 flex justify-center items-center flex-col">
            <CaptionsOff className="size-8 text-error mb-2" />
            <p className="text-center text-gray-500 text-sm">
              No license uploaded yet.
            </p>
          </div>
        )}
      </div>
    </dialog>
  );
}
