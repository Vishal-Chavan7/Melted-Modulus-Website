const LOCAL_DEV_ORIGIN = "http://localhost:5173";

const ALLOWED_METHODS = [
  "GET",
  "HEAD",
  "PUT",
  "PATCH",
  "POST",
  "DELETE",
  "OPTIONS",
];

const ALLOWED_HEADERS = ["Content-Type", "Authorization"];

const normalizeOrigin = (url) => String(url || "").trim().replace(/\/+$/, "");

const parseAllowedOrigins = () => {
  const origins = new Set();

  const primary = normalizeOrigin(process.env.FRONTEND_URL);
  if (primary) origins.add(primary);

  const extra = process.env.FRONTEND_URLS?.split(",") ?? [];
  for (const url of extra) {
    const normalized = normalizeOrigin(url);
    if (normalized) origins.add(normalized);
  }

  return origins;
};

const staticAllowedOrigins = parseAllowedOrigins();

const isVercelOrigin = (origin) =>
  origin.startsWith("https://") && origin.endsWith(".vercel.app");

export const corsOriginChecker = (origin, callback) => {
  if (!origin) {
    return callback(null, true);
  }

  const normalized = normalizeOrigin(origin);

  if (staticAllowedOrigins.has(normalized)) {
    return callback(null, true);
  }

  if (normalized === LOCAL_DEV_ORIGIN) {
    return callback(null, true);
  }

  if (isVercelOrigin(normalized)) {
    return callback(null, true);
  }

  callback(new Error(`CORS blocked origin: ${origin}`));
};

export const corsOptions = {
  origin: corsOriginChecker,
  credentials: true,
  methods: ALLOWED_METHODS,
  allowedHeaders: ALLOWED_HEADERS,
  optionsSuccessStatus: 204,
};
