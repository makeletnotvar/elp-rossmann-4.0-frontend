import { UI } from 'config/ui';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

const {
	VIEW_EDITOR: { ZOOM_FASTER_PERCENT, ZOOM_MAX_PERCENT, ZOOM_MIN_PERCENT, ZOOM_STEP_PERCENT },
} = UI;

export const useDrawViewStyle = (view: DrawView, zoom: number) => {
	const { config } = view;
	const style: CSSProperties = {};

	if (config) {
		if (config.width) style.width = config.width;
		if (config.height) style.height = config.height;
		if (config.background) style.backgroundColor = config.background;
	}

	if (zoom !== undefined) {
		style.zoom = zoom;
	}

	return style;
};

export const useWorkspaceZoom = (view?: DrawView<any>, div?: any) => {
	const [initialZoom, setInitialZoom] = useState<number>(1.0);
	const [zoom, setZoom] = useState<number>(initialZoom);
	const [show, setShow] = useState<boolean>(false);
	const [mouseEntered, setMouseEntered] = useState<boolean>(false);
	const nextZoomRef = useRef(100);

	useEffect(() => {
		nextZoomRef.current = initialZoom * 100;
	}, [initialZoom]);

	useEffect(() => {
		const handleResize = () => {
			if (view && view.config && view.config.height && view.config.width && div?.current) {
				const screenHeight = div.current.clientHeight / 1.043;
				const screenWidth = div.current.clientWidth + 1.043;

				const configHeight = view.config.height;
				const configWidth = view.config.width;

				const zoomHeight = screenHeight / configHeight;
				const zoomWidth = screenWidth / configWidth;

				const newZoom = Math.min(zoomHeight, zoomWidth);
				const clampedZoom = newZoom > 1 ? 1 : newZoom;

				setInitialZoom(clampedZoom);
				setZoom(clampedZoom);
			}
		};

		handleResize();

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [view, div]);

	useEffect(() => {
		const handleTouchStart = (evt: any) => {
			if (evt.touches.length === 2) {
				const initialDistance = Math.hypot(evt.touches[0].pageX - evt.touches[1].pageX, evt.touches[0].pageY - evt.touches[1].pageY);
				const handleTouchMove = (moveEvt: any) => {
					if (moveEvt.touches.length === 2) {
						const currentDistance = Math.hypot(moveEvt.touches[0].pageX - moveEvt.touches[1].pageX, moveEvt.touches[0].pageY - moveEvt.touches[1].pageY);
						const zoomFactor = currentDistance / initialDistance;
						const newZoom = Math.min(Math.max(nextZoomRef.current * zoomFactor, 10), 300);
						const speedZoomFactor = 0.15;
						nextZoomRef.current = nextZoomRef.current + (newZoom - nextZoomRef.current) * speedZoomFactor;
						setZoom(nextZoomRef.current / 100);
					}
				};

				const handleTouchEnd = () => {
					document.removeEventListener('touchmove', handleTouchMove);
					document.removeEventListener('touchend', handleTouchEnd);
				};
				document.addEventListener('touchmove', handleTouchMove, { passive: false });
				document.addEventListener('touchend', handleTouchEnd);
			}
		};

		if (div.current) {
			div.current.addEventListener('touchstart', handleTouchStart, { passive: false });
			return () => {
				div.current.removeEventListener('touchstart', handleTouchStart);
			};
		}
	}, [div]);

	const wheelHandler = useCallback(
		(evt: React.WheelEvent) => {
			if (evt.ctrlKey) {
				setShow(true);
				const mod = evt.shiftKey ? ZOOM_FASTER_PERCENT : ZOOM_STEP_PERCENT;
				let nextZoom = zoom * 100 + (evt.deltaY < 1 ? mod : -mod);

				if (nextZoom > ZOOM_MAX_PERCENT) nextZoom = ZOOM_MAX_PERCENT;
				if (nextZoom < ZOOM_MIN_PERCENT) nextZoom = ZOOM_MIN_PERCENT;

				setZoom(nextZoom / 100);
			}
		},
		[zoom]
	);

	const sliderHandler = useCallback(
		(value: number) => {
			setZoom(value / 100);
		},
		[zoom]
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!mouseEntered) {
				setShow(false);
			}
		}, 3000);
		return () => clearTimeout(timer);
	}, [show, mouseEntered]);

	useEffect(() => {
		const root = document.getElementById('root');
		if (root) {
			const preventDefaultHandler = (evt: WheelEvent) => evt.ctrlKey && evt.preventDefault();
			root.addEventListener('wheel', preventDefaultHandler);
			return () => {
				root && root.removeEventListener('wheel', preventDefaultHandler);
			};
		}
	}, []);

	const resetZoom = () => {
		setZoom(initialZoom);
	};

	return {
		zoom,
		show,
		setShow,
		setMouseEntered,
		setZoom,
		resetZoom,
		wheelHandler,
		sliderHandler,
	};
};
