import { Newspaper, ExternalLink } from "lucide-react";

function NewsCard({
  title,
  source,
  time,
  description,
  image,
  url,
}) {
  // ======================================================
  // IMAGE FALLBACK
  // ======================================================

  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";

    const fallback =
      event.currentTarget.parentElement?.querySelector(
        ".image-fallback"
      );

    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  // ======================================================
  // FORMAT TIME
  // ======================================================

  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
      onClick={(event) => {
        if (!url) {
          event.preventDefault();
        }
      }}
    >

      {/* ==================================================
          NEWS CARD
      ================================================== */}

      <div className="h-full overflow-hidden bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all duration-200">

        {/* ==================================================
            NEWS IMAGE
        ================================================== */}

        <div className="relative w-full h-48 bg-slate-700">

          {/* Actual Image */}

          {image && (
            <img
              src={image}
              alt={title || "Financial News"}
              className="w-full h-48 object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          )}

          {/* Fallback */}

          <div
            className={`image-fallback absolute inset-0 ${
              image ? "hidden" : "flex"
            } items-center justify-center bg-slate-700`}
          >
            <div className="flex flex-col items-center justify-center">

              <Newspaper
                size={50}
                className="text-slate-500"
              />

              <p className="text-slate-500 text-sm mt-2">
                No image available
              </p>

            </div>
          </div>

        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="p-5">

          {/* ==================================================
              SOURCE + EXTERNAL LINK
          ================================================== */}

          <div className="flex items-center justify-between gap-3 mb-3">

            <div className="flex items-center gap-2 min-w-0">

              <Newspaper
                className="text-blue-400 flex-shrink-0"
                size={22}
              />

              <span className="text-sm text-slate-400 truncate">
                {source || "Financial News"}
              </span>

            </div>

            <ExternalLink
              size={18}
              className="text-slate-400 flex-shrink-0"
            />

          </div>

          {/* ==================================================
              TITLE
          ================================================== */}

          <h3 className="text-lg font-semibold leading-relaxed mb-3 line-clamp-3">
            {title || "Financial News"}
          </h3>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          {description && (
            <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>
          )}

          {/* ==================================================
              TIME
          ================================================== */}

          {time && (
            <p className="text-sm text-slate-500">
              {formatTime(time)}
            </p>
          )}

        </div>

      </div>

    </a>
  );
}

export default NewsCard;