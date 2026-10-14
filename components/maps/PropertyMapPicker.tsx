"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Search, X, Check, Loader2 } from "lucide-react";

export interface PickedLocation {
	lat: number;
	lng: number;
	formatted_address: string;
	state: string;
	local_government: string;
	city?: string;
}

interface PropertyMapPickerProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (location: PickedLocation) => void;
	initialLocation?: PickedLocation;
}

declare global {
	interface Window {
		google: typeof google;
		initMap: () => void;
	}
}

function extractAddressComponent(
	components: google.maps.GeocoderAddressComponent[],
	types: string[]
): string {
	const component = components.find((c) => types.some((t) => c.types.includes(t)));
	return component?.long_name ?? "";
}

export function PropertyMapPicker({
	open,
	onClose,
	onConfirm,
	initialLocation,
}: PropertyMapPickerProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<google.maps.Map | null>(null);
	const markerRef = useRef<google.maps.Marker | null>(null);
	const geocoderRef = useRef<google.maps.Geocoder | null>(null);
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [mapsLoaded, setMapsLoaded] = useState(false);
	const [picked, setPicked] = useState<PickedLocation | null>(
		initialLocation ?? null
	);
	const [searchQuery, setSearchQuery] = useState("");

	const defaultCenter = { lat: 6.5244, lng: 3.3792 };

	const loadGoogleMaps = useCallback(() => {
		if (window.google?.maps) {
			setMapsLoaded(true);
			return;
		}
		const existingScript = document.getElementById("google-maps-script");
		if (existingScript) {
			existingScript.addEventListener("load", () => setMapsLoaded(true));
			return;
		}
		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
		if (!apiKey) {
			console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set");
			return;
		}
		const script = document.createElement("script");
		script.id = "google-maps-script";
		script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
		script.async = true;
		script.defer = true;
		script.onload = () => setMapsLoaded(true);
		document.head.appendChild(script);
	}, []);

	useEffect(() => {
		if (open) loadGoogleMaps();
	}, [open, loadGoogleMaps]);

	useEffect(() => {
		if (!open || !mapsLoaded || !mapRef.current) return;

		const center = initialLocation
			? { lat: initialLocation.lat, lng: initialLocation.lng }
			: defaultCenter;

		const map = new window.google.maps.Map(mapRef.current, {
			center,
			zoom: 14,
			mapTypeControl: false,
			streetViewControl: false,
			fullscreenControl: false,
			styles: [
				{ featureType: "poi.business", stylers: [{ visibility: "off" }] },
				{ featureType: "transit", stylers: [{ visibility: "simplified" }] },
			],
		});
		mapInstanceRef.current = map;

		const marker = new window.google.maps.Marker({
			position: center,
			map,
			draggable: true,
			icon: {
				url:
					"data:image/svg+xml;charset=UTF-8," +
					encodeURIComponent(
						`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
              <ellipse cx="18" cy="40" rx="8" ry="4" fill="rgba(0,0,0,0.15)"/>
              <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="#2563eb"/>
              <circle cx="18" cy="18" r="8" fill="white"/>
            </svg>`
					),
				scaledSize: new window.google.maps.Size(36, 44),
				anchor: new window.google.maps.Point(18, 44),
			},
		});
		markerRef.current = marker;
		geocoderRef.current = new window.google.maps.Geocoder();

		if (initialLocation) {
			setPicked(initialLocation);
		}

		const reverseGeocode = (latLng: google.maps.LatLng) => {
			setIsLoading(true);
			geocoderRef.current?.geocode({ location: latLng }, (results, status) => {
				setIsLoading(false);
				if (status === "OK" && results?.[0]) {
					const r = results[0];
					const state = extractAddressComponent(r.address_components, ["administrative_area_level_1"]);
					const lga = extractAddressComponent(r.address_components, ["administrative_area_level_2"]);
					const city = extractAddressComponent(r.address_components, ["locality", "sublocality"]);
					setPicked({
						lat: latLng.lat(),
						lng: latLng.lng(),
						formatted_address: r.formatted_address,
						state,
						local_government: lga,
						city,
					});
				}
			});
		};

		marker.addListener("dragend", () => {
			const pos = marker.getPosition();
			if (pos) reverseGeocode(pos);
		});

		map.addListener("click", (e: google.maps.MapMouseEvent) => {
			if (e.latLng) {
				marker.setPosition(e.latLng);
				reverseGeocode(e.latLng);
			}
		});

		if (searchInputRef.current) {
			const autocomplete = new window.google.maps.places.Autocomplete(
				searchInputRef.current,
				{ componentRestrictions: { country: "ng" }, fields: ["geometry", "formatted_address", "address_components"] }
			);
			autocompleteRef.current = autocomplete;
			autocomplete.addListener("place_changed", () => {
				const place = autocomplete.getPlace();
				if (!place.geometry?.location) return;
				const loc = place.geometry.location;
				map.setCenter(loc);
				map.setZoom(16);
				marker.setPosition(loc);
				const state = extractAddressComponent(place.address_components ?? [], ["administrative_area_level_1"]);
				const lga = extractAddressComponent(place.address_components ?? [], ["administrative_area_level_2"]);
				const city = extractAddressComponent(place.address_components ?? [], ["locality", "sublocality"]);
				setPicked({
					lat: loc.lat(),
					lng: loc.lng(),
					formatted_address: place.formatted_address ?? "",
					state,
					local_government: lga,
					city,
				});
				setSearchQuery(place.formatted_address ?? "");
			});
		}

		return () => {
			mapInstanceRef.current = null;
			markerRef.current = null;
			geocoderRef.current = null;
			autocompleteRef.current = null;
		};
	}, [open, mapsLoaded]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_32px_80px_rgba(15,23,42,0.25)]">
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
					<div className="flex items-center gap-2.5">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700">
							<MapPin className="h-5 w-5 text-white" />
						</div>
						<div>
							<h2 className="text-base font-black tracking-[-0.03em] text-slate-900">
								Pick Property Location
							</h2>
							<p className="text-xs text-slate-400">Click on the map or search an address</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="border-b border-slate-100 px-6 py-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<input
							ref={searchInputRef}
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search for an address in Nigeria..."
							className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
						/>
					</div>
				</div>

				<div className="relative h-[380px] w-full bg-slate-100">
					{!mapsLoaded && (
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
							<p className="text-sm font-medium text-slate-500">Loading map…</p>
						</div>
					)}
					<div ref={mapRef} className="h-full w-full" />
					{isLoading && (
						<div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
							<Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
							<span className="text-xs font-medium text-slate-600">Getting address…</span>
						</div>
					)}
				</div>

				{picked && (
					<div className="border-t border-slate-100 bg-blue-50/60 px-6 py-3">
						<div className="flex items-start gap-2.5">
							<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
							<div className="flex-1 min-w-0">
								<p className="truncate text-sm font-semibold text-slate-800">
									{picked.formatted_address}
								</p>
								<p className="mt-0.5 text-xs text-slate-400">
									{picked.state}{picked.local_government ? `, ${picked.local_government}` : ""}
									{" · "}
									{picked.lat.toFixed(5)}, {picked.lng.toFixed(5)}
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="flex justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
					<button
						onClick={onClose}
						className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						disabled={!picked}
						onClick={() => picked && onConfirm(picked)}
						className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-5 py-2 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] transition hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Check className="h-4 w-4" />
						Confirm Location
					</button>
				</div>
			</div>
		</div>
	);
}
