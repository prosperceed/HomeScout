import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
	BatchLogRecordProcessor,
	LoggerProvider,
} from "@opentelemetry/sdk-logs";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const isNodeRuntime = process.env.NEXT_RUNTIME !== "edge";

if ((!token || !host) && process.env.NODE_ENV !== "production") {
	const missingVariable = token
		? "NEXT_PUBLIC_POSTHOG_HOST"
		: "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";

	console.warn(
		`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
	);
}

const loggerProvider =
	isNodeRuntime && token && host
		? new LoggerProvider({
				resource: resourceFromAttributes({
					"service.name": "homescout",
					"deployment.environment": process.env.NODE_ENV ?? "development",
				}),
				processors: [
					new BatchLogRecordProcessor({
						exporter: new OTLPLogExporter({
							url: new URL("/i/v1/logs", host).toString(),
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json",
							},
						}),
					}),
				],
			})
		: null;

export const posthogLogger = loggerProvider?.getLogger("homescout.posthog");

export function register() {}
