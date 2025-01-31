import * as promClient from "prom-client";
import { env } from "./env";

// Create Registry
export const register = new promClient.Registry();

// Collect default metrics
promClient.collectDefaultMetrics({
  register,
  prefix: "rwandapro_"
//   timeout: 5000
});

// HTTP Request Duration Histogram
export const httpRequestDuration = new promClient.Histogram({
  name: "rwandapro_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

// Custom Metrics Endpoint
export const metricsEndpoint = async () => {
  return {
    contentType: register.contentType,
    metrics: await register.metrics()
  };
};
