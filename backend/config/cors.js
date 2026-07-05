const LOCAL_DEV_ORIGIN = "http://localhost:5173";

export const ALLOWED_METHODS = [
  "GET",
  "HEAD",
  "PUT",
  "PATCH",
  "POST",
  "DELETE",
  "OPTIONS",
];

export const ALLOWED_HEADERS = ["Content-Type", "Authorization"];

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

export const isOriginAllowed = (origin) => {
  if (!origin) return true;

  const normalized = normalizeOrigin(origin);

  if (staticAllowedOrigins.has(normalized)) return true;
  if (normalized === LOCAL_DEV_ORIGIN) return true;
  if (isVercelOrigin(normalized)) return true;

  return false;
};

export const applyCors = (req, res, next) => {
  const origin = req.headers.origin;
  const allowed = !origin || isOriginAllowed(origin);

  if (allowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    if (allowed && origin) {
      res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS.join(","));
      res.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(","));
      res.setHeader("Access-Control-Max-Age", "0");
    }
    return res.status(204).end();
  }

  next();
};

export const corsOriginChecker = (origin, callback) => {
  if (!origin || isOriginAllowed(origin)) {
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
  preflightContinue: false,
};
