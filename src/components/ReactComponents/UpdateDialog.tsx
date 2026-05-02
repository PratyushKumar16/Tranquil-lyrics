import React from "react";

interface UpdateDialogProps {
  fromVersion: string;
  tranquilLyricsVersion: string;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ fromVersion, tranquilLyricsVersion }) => {
  return (
    <div className="update-card-wrapper slm">
      <h2 className="header">Tranquil Lyrics has been successfully updated!</h2>
      <div className="card version">
        Version: {fromVersion ? `${fromVersion} → ` : ""}{tranquilLyricsVersion || "Unknown"}
      </div>
      <button
        className="card btn btn-release"
        onClick={() =>
          window.open(
            `https://github.com/PratyushKumar16/Tranquil-lyrics/releases/tag/${tranquilLyricsVersion}`,
            "_blank"
          )
        }
      >
        Release Notes →
      </button>
    </div>
  );
};

export default UpdateDialog;
